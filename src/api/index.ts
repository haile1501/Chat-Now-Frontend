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

export const getMyProfile = async (accessToken: string) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(`${BASE_API_URL}/friend/my-profile`, {
      headers,
    });

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

export const uploadFile = async (accessToken: string, file: any) => {
  const headers = createHeader(accessToken);
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(
    `${BASE_API_URL}/user/uploadFile`,
    formData,
    { headers }
  );
  return response.data;
};

export const updateUserProfile = async (
  accessToken: string,
  updateData: any
) => {
  try {
    const headers = createHeader(accessToken);
    const { firstName, lastName, dob, gender, about, avatar } = updateData;
    const updateUserDto = {
      firstName,
      lastName,
      dob,
      gender,
      about,
      avatar,
    };

    const response = await axios.patch(`${BASE_API_URL}/user`, updateUserDto, {
      headers,
    });
    const data = response.data;

    const newProfile: UserInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      userId: data.userId,
      status: "",
      gender: data.gender,
      email: data.email,
      dob: data.dob,
      mutualFriends: 0,
      about: data.about,
    };
    return newProfile;
  } catch (err) {
    console.log(err);
  }
};
