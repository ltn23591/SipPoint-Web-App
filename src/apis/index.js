import apiCall from "./config";
import { API_METHOD } from "@/constants/application";


// Lead / liên hệ từ trang landing. Endpoint là placeholder — chỉnh theo backend thực tế.
export const ContactApi = {
  submit: (payload) => {
    const endpoint = `/landing/contact`;
    return apiCall(API_METHOD.POST, endpoint, payload);
  },
  subscribe: (payload) => {
    const endpoint = `/landing/subscribe`;
    return apiCall(API_METHOD.POST, endpoint, payload);
  },
};

export const AiApi = {
  chat: (payload) => {
    const endpoint = `/ai/chat`;
    return apiCall(API_METHOD.POST, endpoint, payload);
  },
  recommendTopProduct: () => {
    const endpoint = `/ai/recommend-top-product`;
    return apiCall(API_METHOD.GET, endpoint);
  },
};


