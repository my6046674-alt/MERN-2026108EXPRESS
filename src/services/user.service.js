import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "../constants/roles.js";
import User from "../models/User.js";
import uploadFile from "../utils/fileUploader.js";
import authService from "./auth.service.js";

const getAll = async (query) => {
  const sort = query.sort ? JSON.parse(query.sort) : {};
  const limit = Number(query.limit ?? 10);
  const offset = Number(query.offset ?? 0);

  const filters = {};
  const { name, email, phone } = query;

  if (name) filters.name = { $regex: name, $options: "i" };
  if (email) filters.email = { $regex: email, $options: "i" };
  if (phone) filters.phone = { $regex: phone, $options: "i" };

  return User.find(filters).sort(sort).limit(limit).skip(offset);
};

const getById = async (id, authUser) => {
  if (authUser._id.toString() !== id && !authUser.role?.includes(ROLE_ADMIN)) {
    throw {
      status: 403,
      message: "Access denied",
    };
  }

  return await User.findById(id);
};

const updateUser = async (id, data, authUser) => {
  if (authUser._id.toString() !== id && !authUser.role?.includes(ROLE_ADMIN)) {
    throw {
      status: 403,
      message: "Access denied",
    };
  }

  return await User.findByIdAndUpdate(
    id,
    {
      name: data?.name,
      phone: data?.phone,
      address: data?.address,
      isActive: data?.isActive,
    },
    {returnDocument:"after" }
  );
};

const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return "User deleted successful";
};

const createUser = async (data) => {
  return await authService.register(data);
};

const updateProfileImage = async (id, file) => {
  if (!file) {
    throw new Error(
      "Profile image is required. Use multipart/form-data with the field name 'image'."
    );
  }

  const uploadedFiles = await uploadFile([file]);

  return await User.findByIdAndUpdate(
    id,
    {
      profileImageUrl: uploadedFiles[0].url,
    },
    { returnDocument: "after" }
  );
};

const updateUserRoles = async (id, roles, authUser) => {
  if (
    (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) &&
    authUser.role?.includes(ROLE_SUPER_ADMIN)
  ) {
    throw {
      status: 403,
      message: "Access denied.",
    };
  }

  return await User.findByIdAndUpdate(id, { role: roles }, {returnDocument:"after" });
};

export default {
  createUser,
  getAll,
  getById,
  updateUser,
  deleteUser,
  updateProfileImage,
  updateUserRoles,
};