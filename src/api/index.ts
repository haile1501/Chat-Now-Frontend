import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { IConversation } from "@/interfaces/Conversation";

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

export const getConversations = async (accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const responses = await axios.get(
      `${BASE_API_URL}/conversation?page=1&size=100`,
      {
        headers,
      }
    );

    const conversationsList: IConversation[] = responses.data.map(
      (conversationData: any) => {
        const conversation: IConversation = {
          id: conversationData.conversationId,
          type: conversationData.type,
          lastMessage: conversationData.lastMessage.content,
          isMyLastMessage: conversationData.isMyLastMessage,
          timeSend: conversationData.lastMessage.timeSend,
          senderId: conversationData.lastMessage.user.userId,
          avatar: "",
          conversationName: "",
        };

        let time = new Date(conversation.timeSend);
        conversation.timeSend = time.getHours() + ":" + time.getMinutes();

        if (conversation.type === "group") {
          conversation.conversationName = conversationData.groupName;
        } else {
          const partner = conversationData.member[0];
          conversation.conversationName =
            partner.firstName + " " + partner.lastName;
        }

        return conversation;
      }
    );

    return conversationsList;
  } catch (err) {}
};

export const findAllUser = async (name: string) => {
  try {
    const responses = await axios.post(
      `${BASE_API_URL}/user?page=1&size=100&type=all&name=${name}`
    );

    return responses.data;
  } catch (err) {}
};
