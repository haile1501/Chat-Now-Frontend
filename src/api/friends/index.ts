import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { createHeader } from "..";
import { User } from "@/interfaces/User";

export const getFriends = async (accessToken: string) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(`${BASE_API_URL}/friend/getListFriend`, {
      headers,
    });

    const friends: User[] = response.data.map((user: any) => {
      const { firstName, lastName, avatar, id } = user;
      const friend: User = {
        firstName,
        lastName,
        avatar,
        id,
      };

      return friend;
    });

    return friends;
  } catch (err) {}
};

export const getFriendsRequest = async (
  accessToken: string,
  option: "sent" | "received"
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(
      `${BASE_API_URL}/friend?page=1&size=100&option=${option}`,
      {
        headers,
      }
    );

    const friends: User[] = response.data.map((user: any) => {
      const { firstName, lastName, avatar, id } = user;
      const friend: User = {
        firstName,
        lastName,
        avatar,
        id,
      };

      return friend;
    });

    return friends;
  } catch (err) {}
};
