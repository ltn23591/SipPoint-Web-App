// ─── App ─────────────────────────────────────────────────────────────────────
export const APP_NAME = "SipPoint";
export const APP_TAGLINE = "Gọi món thông minh cho quán của bạn";
export const APP_DESCRIPTION =
  "Nền tảng quản lý & gọi món thông minh cho quán cà phê, trà sữa.";

// ─── HTTP / API ───────────────────────────────────────────────────────────────
export const CODE_KEY = {
  BAD_REQUEST: 400,
  UNAUTHORIZED_STATUS: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ERROR_NETWORK: "ERR_NETWORK",
  TIME_OUT: 408,
  NOT_INTERNET: "NOT_INTERNET",
  UNDEFINED: "UNDEFINED",
  UNKNOWN: "UNKNOWN",
  CANCEL: "ERR_CANCELED",
  REQUEST_ENTITY_TOO_LARGE: 413,
};

export const API_METHOD = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

export const STORAGE_KEY = {
  THEME: "THEME",
};

export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
export const ISO_DATE_FORMAT = "yyyy-MM-dd";
export const ISO_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
