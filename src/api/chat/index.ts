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

    const conversationsList: IConversation[] = responses.data.map(
      (conversationData: any) => {
        const conversation: IConversation = {
          id: conversationData.conversationId,
          type: conversationData.type,
          lastMessage: conversationData.lastMessage?.content,
          isMyLastMessage: conversationData.isMyLastMessage,
          timeSend: conversationData.lastMessage?.timeSend,
          senderId: conversationData.lastMessage?.user.userId,
          avatar: "",
          conversationName: conversationData.groupName,
          isOnline: false,
          privateUserId: null,
        };

        if (conversation.type === "private") {
          conversation.isOnline =
            conversationData.member[0].onlineStatus === "Online";
          conversation.privateUserId = conversationData.member[0].userId;
        }

        if (conversation.lastMessage && conversation.timeSend) {
          let time = new Date(conversation.timeSend);
          conversation.timeSend = time.getHours() + ":" + time.getMinutes();
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
    const data = response.data;

    const conversation: IConversation = {
      id: data.conversationId,
      type: data.type,
      lastMessage: "",
      isMyLastMessage: false,
      timeSend: "",
      senderId: -1,
      avatar: "",
      conversationName: data.groupName,
      isOnline: false,
      privateUserId: null,
    };

    if (conversation.type === "private") {
      const partnerId = userIds[0];
      const partner = data.member.find(
        (user: any) => user.userId === partnerId
      );
      conversation.isOnline = partner.onlineStatus === "Online";
      conversation.privateUserId = partner.userId;
    }

    console.log(conversation);

    return conversation;
  } catch (err) {}
};
