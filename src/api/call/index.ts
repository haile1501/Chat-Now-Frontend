import { createHeader } from "..";
import { BASE_API_URL } from "@/utils/constant";
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
