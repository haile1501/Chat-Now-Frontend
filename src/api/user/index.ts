import { BASE_API_URL } from "@/utils/constant";
import axios from "axios";
import { createHeader } from "..";
import { User } from "@/interfaces/User";

export const findAllUser = async (name: string, accessToken: string) => {
  const headers = createHeader(accessToken);
  try {
    const responses = await axios.get(
      `${BASE_API_URL}/user?page=1&size=100&type=all&name=${name}`,
      { headers }
    );

    const users: User[] = responses.data.map((userData: any) => {
      return {
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        id: userData.userId,
      };
    });

    return users;
  } catch (err) {}
};
