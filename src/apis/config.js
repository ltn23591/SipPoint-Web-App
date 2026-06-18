import axios from "axios";

import { CODE_KEY } from "@/constants/application";

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL || "/api";

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
  axios.defaults.baseURL = baseUrl ? baseUrl : VITE_APP_API_URL;
  const url = `${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
      ...(args?.[0] || {}),
    });
    return response;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case CODE_KEY.BAD_REQUEST:
          return error.response;
        case CODE_KEY.UNAUTHORIZED_STATUS:
          return error.response;
        case CODE_KEY.REQUEST_ENTITY_TOO_LARGE:
          return error.response;
        default:
          break;
      }
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
  }
};

export default apiCall;
