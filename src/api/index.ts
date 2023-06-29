import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { UserInfo } from "@/interfaces/UserInfo";

export const createHeader = (accessToken: string) => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

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

export const getUserProfile = async (accessToken: string, id: number) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(
      `${BASE_API_URL}/friend/getProfile/${id}`,
      { headers }
    );

    const {
      firstName,
      lastName,
      avatar,
      userId,
      status,
      gender,
      email,
      dob,
      mutualFriends,
      about,
    } = response.data;
    const userProfile: UserInfo = {
      firstName,
      lastName,
      avatar,
      userId,
      status,
      gender,
      email,
      dob: new Date(dob),
      mutualFriends,
      about,
    };

    return userProfile;
  } catch (err) {}
};
