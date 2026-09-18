import mongoose from "mongoose";
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
} from "../constants/orderStatus.js";
import { PAYMENT_METHOD_CASH, PAYMENT_METHOD_ONLINE, PAYMENT_STATUS_FAILED, PAYMENT_STATUS_SUCCESS } from "../constants/payment.js";
import Order from "../models/Order.js";
import payment from "../models/payment.js";
import Product from "../models/Product.js";
import { payViaKhalti } from "../utils/payment.js";
import userService from "./user.service.js"

// for admin
const getOrders = async () => {
  return await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand category price imageUrls");
};

const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand category price imageUrls")
    .populate("payment", "transactionId method status");

  if (!order)
    throw {
      status: 404,
      message: "Order not found.",
    };
  return order;
};

const createOrder = async (data, authUser) => {
  const user = await userService.getById(authUser._id, authUser);

  if(!data.shippingAddress){
    data.shippingAddress = user.address;
  }
   data.orderNumber= crypto.randomUUID();
   data.user=authUser._id;
  return await Order.create(data);
};

const updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};

const cancelOrder = async (id) => {
  return await Order.findByIdAndUpdate(
    id,
    { status: ORDER_STATUS_CANCELLED },
    { new: true },
  );
};

const deleteOrder = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// payment
const confirmOrder = async (id, status) => {
  const order = await getOrderById(id);
  if(status?.toUpperCase() !=PAYMENT_STATUS_SUCCESS){
    await payment.findByIdAndUpdate(order.payment,{
      status:PAYMENT_STATUS_FAILED,
    });
    throw{
      status:400,
      message:"payment failed"
    }
  }
    await payment.findByIdAndUpdate(order.payment,{
      status:PAYMENT_STATUS_SUCCESS,
    });


  return await Order.findByIdAndUpdate(
    id,
    { status: ORDER_STATUS_CONFIRMED },
    { new: true },
  );
};

const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand category price imageUrls");
};

const getOrderByMerchant = async(merchantId) => {

  return await Order.aggregate([
        {
      $lookup:{
          from:"users",
          localField:"user",
          foreignField:"_id",
          as:"orderUser",
      },
    },
    {
       $unwind:"$orderUser"
    },
    {
      $lookup:{
          from:"products",
          localField:"orderItems.product",
          foreignField:"_id",
          as:"orderedProducts",
      },
    },

    {
      $match:{
        "orderedProducts.createdBy": new mongoose.Types.ObjectId(merchantId),
      },
    },
    {
      $project:{
        orderNumber:1,
        payment:1,
        shippingAddress:1,
        status:1,
        totalPrice:1,
        "orderItems.quantity":1,
         "orderUser._id":1,
         "orderUser.name":1,
        "orderUser.email":1,
        "orderUser.phone":1,
        "orderedProducts._id":1,
        "orderedProducts.name":1,
        "orderedProducts.price":1,
        "orderedProducts.brand":1,
        "orderedProducts.category":1,
        "orderedProducts.imageUrls":1,
       
      }
    }
  ])
};

const orderPaymentViaCash = async (id) => {
  const order = await Order.findById(id);

  if (!order) {
    throw {
      status: 404,
      message: "Order not found.",
    };
  }

  const orderPayment = await payment.create({
    method: PAYMENT_METHOD_CASH,
    amount: order.totalPrice,
  });

  return await Order.findByIdAndUpdate(
    id,
    {
      status: ORDER_STATUS_CONFIRMED,
      payment: orderPayment._id,
    },
    {
      new: true,
    },
  );
};
const orderPaymentViaKhalti = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name");

  if (!order) {
    throw {
      status: 404,
      message: "Order not found.",
    };
  }

  const orderPayment = await payment.create({
    method: PAYMENT_METHOD_ONLINE,
    amount: order.totalPrice,
  });

  await Order.findByIdAndUpdate(
    id,
    {
      payment: orderPayment.id,
    },
  );

  const purchaseOrderId = order.orderNumber || order._id.toString();
  const purchaseOrderName =
    order.orderItems?.[0]?.product?.name || "Order Payment";
  const customerInfo = {
    name: order.user?.name || "Customer",
    email: order.user?.email || "customer@example.com",
    phone: order.user?.phone || "",
  };

  return await payViaKhalti({
    amount: Math.round(order.totalPrice * 100),
    purchaseOrderId,
    purchaseOrderName,
    customerInfo,
  });
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  confirmOrder,
  getOrdersByUser,
  getOrderByMerchant,
  orderPaymentViaCash,
  orderPaymentViaKhalti,
};
