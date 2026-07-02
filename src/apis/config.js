import axios from "axios";

import { CODE_KEY } from "@/constants/application";

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL || "https://sippoint-be.onrender.com/api/v1";

const REQUEST_TIMEOUT = 15 * 1000;

axios.defaults.timeout = REQUEST_TIMEOUT;

const apiCall = async (
  method,
  endpoint,
  data = null,
  customHeaders = {},
  baseUrl = null,
  ...args
) => {
  const url = `${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const response = await axios({
      method,
      baseURL: baseUrl ? baseUrl : VITE_APP_API_URL,
      url,
      data,
      headers,
      ...(args?.[0] || {}),
    });
    return response;
  } catch (error) {
    if (error.response) {
      throw error;
    }

    if (error.code === CODE_KEY.CANCEL) {
      console.warn("--------CANCEL--------", error);
      return {
        data: {
          isSuccess: false,
          isCancel: true,
        },
      };
    }

    console.error(error);
    throw error;
  }
};

export default apiCall;
