import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { createHeader } from "..";

export const getFriends = async (accessToken: string) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(`${BASE_API_URL}/`);
  } catch (err) {}
};
