import apiCall from "./config";
import { API_METHOD } from "@/constants/application";

// Lead / liên hệ từ trang landing. Endpoint là placeholder — chỉnh theo backend thực tế.
export const ContactApi = {
  submit: (payload) => {
    const endpoint = `/api/v1/landing/contact`;
    return apiCall(API_METHOD.POST, endpoint, payload);
  },
  subscribe: (payload) => {
    const endpoint = `/api/v1/landing/subscribe`;
    return apiCall(API_METHOD.POST, endpoint, payload);
  },
};
