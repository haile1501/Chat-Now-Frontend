export const BASE_API_URL = "https://10.14.124.28:3001";

export const DEBOUNCE_TIME = 500;

export const EMAIL_HELPER_TEXT = {
  INVALID_EMAIL: "Invalid email address",
  REGISTERD_EMAIl: "Email has already been registered",
};

export enum USER_STATUS {
  ON = "Online",
  OFF = "Offline",
  CALL = "Call",
}

export enum RELATIONSHIP {
  FRIEND = "friend",
  STRANGE = "strange",
  RECEIVER = "receiver",
  SENDER = "sender",
}

export enum CALL_TYPE {
  VOICE = "voice",
  VIDEO = "video",
  NO = "no",
}

export const TEXT_FIELD_HELPER_TEXT = "This must not be empty";

export const ERROR_CODE = {
  EMAIL_ALREADY_USED: 10001,
  WRONG_EMAIL_OR_PASSWORD: 10002,
  UNVERIFIED_ACCOUNT: 10003,
};
