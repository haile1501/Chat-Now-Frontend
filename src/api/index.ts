import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";

export interface SignUpBody {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  dob: Date;
  gender: string;
}

export const signUp = (body: SignUpBody) => {
  return axios.post(`${BASE_API_URL}/auth/sign-up`, body);
};

export interface SignInBody {
  email: string;
  password: string;
}

export const signIn = (body: SignInBody) => {
  return axios.post(`${BASE_API_URL}/auth/log-in`, body);
};

export const resendEmail = (email: string) => {
  return axios.post(`${BASE_API_URL}/auth/resend-email`, { email });
};

export const verifyEmail = (email: any, otp: any) => {
  return axios.post(`${BASE_API_URL}/auth/verify-email`, { email, otp });
};
