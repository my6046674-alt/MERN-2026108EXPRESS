import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 
    name: {
        type: String,
        required: [true, "User name is required"],
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        validate: {
            validator: (value) => {
                const emailRegex =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                return emailRegex.test(value);
            },
            message: "Invalid email address"
        }
    },

    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [6, "Password length must be at least 6 characters."],
  
    },
 
    phone: {
        type: String,
        required: [true, "Phone number is required."],
        minlength: [6, "Phone number must be at least 6 characters"],
        maxlength: [13, "Phone number cannot exceed 13 characters"],
        unique: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    isActive: {
        type: Boolean,
        default: true
    },

    address: {
        city: {
            type: String,
            required: true
        },
        province: String,
        street: String,
        country: {
            type: String,
            default: "Nepal"
        }
    },

    role: {
        type: [String],
        enum: ["CUSTOMER", "MERCHANT", "ADMIN", "SUPER_ADMIN"],
        default: ["CUSTOMER"]
    },
    profileImageUrl:{
        type:String,
    },
});



export default mongoose.model("User", userSchema);


