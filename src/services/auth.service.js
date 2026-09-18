import crypto from "node:crypto";
import ResetPassword from "../models/ResetPassword.js";
import User from "../models/User.js";
import bcrypt from "bcrypt"
import config from "../config/config.js";
import sendEmail from "../utils/email.js";

const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const login = async (data)=>{
    const email = normalizeEmail(data?.email);

    const user = await User.findOne({
        $or: [
            { email: { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") } },
            { phone: data?.phone }
        ]
    });

    if(!user){
        throw{
            status: 404,
            message: "User not found."
        };
    }
    if(!user.isActive){
        throw{
            status: 400,
            message: "User is inactive."
        };
    }

   const isPasswordMatch= bcrypt.compareSync(data.password, user.password);

   if(!isPasswordMatch){
    throw{
        status: 400,
        message:"passwords do not match."
    };

   }
   return {
    _id:user._id,
    address:user.address,
    phone:user.phone,
    email:user.email,
    name:user.name,
    role:user.role,
    isActive:user.isActive,
    profileImageUrl:user.profileImageUrl,
   };
    // find user and match passwords
};

const register =async (data)=>{
      const email = normalizeEmail(data.email);
      const user = await User.findOne({
        email: { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") }
      });

    if(user){
        throw{
            status: 409,
            message: "User already exists."
        };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    delete data.roles;

     const createdUser = await User.create({
        ...data,
          email,
          role: Array.isArray(data.role) ? data.role : (data.roles ?? ["CUSTOMER"]),
        password: hashedPassword,
     })
     return {
    _id:createdUser._id,
    address:createdUser.address,
    phone:createdUser.phone,
    email:createdUser.email,
    name:createdUser.name,
    role:createdUser.role,
    isActive:createdUser.isActive,
    profileImageUrl:createdUser.profileImageUrl,
   };
    
};

const forgotPassword = async (email)=>{
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw {
        status: 400,
        message: "user not found.."
      };
    }
     const  token = crypto.randomUUID();

      await ResetPassword.create({
        userId: user._id,
        token:token,

      });

   const link = `${config.appUrl}/reset-password?userId=${user._id}&token=${token}`;

   sendEmail({
    recipient:email,
    subject:"Rest password link.",
    html:` 
       <div
      style="
        padding: 16px;
        font-family: sans-serif;
        
      "
    >
      <h1>Please click the link to reset your password.</h1>
      <a
        href="${link}"
        style="
          background-color: steelblue;
          color: white;
          text-decoration: none;
          padding: 8px 32px;
          border-radius: 5px;
        "
        >Reset password</a
      >
    </div>
    `,
   })

    return{
        link,
        message:"Reset password link sent to your email."
    }
};

const resetPassword = async (input)=>{
  const data = await ResetPassword.findOne({
    userId:input.userId,
    expiresAt:{$gt:Date.now()},
  }).sort({createdAt:-1});

  if(!data || data.token !=input.token){
    throw{
      status:400,
      message:"Invalid or expired link.",
    }
  }
  if(data.isUsed){
    throw{
      status:400,
      message:"Link already used"
    }
  }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(input.password, salt);

    await User.findByIdAndUpdate(input.userId,{
      password:hashedPassword,
    })
    await ResetPassword.findByIdAndUpdate(data._id,{
      isUsed:true,
    })

    return {message:"Password reset successful."}
};

export default {register, login, forgotPassword,resetPassword}

