import axios from "axios";
import config from "../config/config.js";

const payViaKhalti=async(data)=>{
const khaltiConfig = config.khalti || config.Khalti;
const body = {
  return_url: khaltiConfig.return_url,
  website_url: config.appUrl,
  amount: data.amount,
  purchase_order_id: data.purchaseOrderId,
  purchase_order_name: data.purchaseOrderName,
  customer_info: data.customerInfo,
};

const response = await axios.post(khaltiConfig.apiUrl, body, {
  headers: {
    Authorization: `key ${khaltiConfig.secretKey}`,
  },
});
return response.data;
}

export {payViaKhalti}