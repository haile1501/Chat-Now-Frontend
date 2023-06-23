import { IConversation } from "@/interfaces/Conversation";
import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { IMessage } from "@/interfaces/Message";
import { createHeader } from "..";

export const getConversations = async (accessToken: string) => {
  try {
    const headers = createHeader(accessToken);
    const responses = await axios.get(
      `${BASE_API_URL}/conversation?page=1&size=100`,
      {
        headers,
      }
    );

    console.log(responses.data);

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

        if (conversation.timeSend) {
          let time = new Date(conversation.timeSend);
          conversation.timeSend = time.getHours() + ":" + time.getMinutes();
        }

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

export const getMessagesList = async (
  conversationId: string,
  accessToken: string
) => {
  try {
    const headers = createHeader(accessToken);
    const responses = await axios.get(
      `${BASE_API_URL}/conversation/${conversationId}/message`,
      {
        headers,
      }
    );

    const messagesList: IMessage[] = responses.data.map((messageData: any) => {
      const user = messageData.user;
      const message: IMessage = {
        content: messageData.content,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: messageData.user,
        isMine: messageData.isMine,
      };

      return message;
    });

    return messagesList;
  } catch {}
};

export const createConversation = async (
  accessToken: string,
  userIds: number[],
  type: string,
  groupName: string | null
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.post(
      `${BASE_API_URL}/conversation`,
      {
        userIds,
        type,
        groupName,
      },
      { headers }
    );
    const data = response.data[0];

    const conversation: IConversation = {
      id: data.conversationId,
      type: data.type,
      lastMessage: "",
      isMyLastMessage: false,
      timeSend: "",
      senderId: -1,
      avatar: "",
      conversationName: data.conversationName,
    };

    if (conversation.type === "private") {
      const partner = data.users[0];
      conversation.conversationName =
        partner.firstName + " " + partner.lastName;
    }

    return conversation;
  } catch (err) {}
};
