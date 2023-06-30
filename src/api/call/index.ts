import { createHeader } from "..";
import { BASE_API_URL, CALL_TYPE } from "@/utils/constant";
import axios from "axios";

export const genRTCToken = async (
  accessToken: string,
  conversationId: string
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.post(
      `${BASE_API_URL}/call/gen-token`,
      { conversationId },
      { headers }
    );

    return response.data;
  } catch (err) {}
};

export const createCallHistory = async (
  accessToken: string,
  type: CALL_TYPE,
  conversationId: string
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.post(
      `${BASE_API_URL}/call?id=${conversationId}&type=${type}`,
      { headers }
    );

    return response;
  } catch (err) {}
};

export const getCallHistories = async (accessToken: string) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(`${BASE_API_URL}/call`, { headers });
    return response.data;
  } catch (err) {}
};
