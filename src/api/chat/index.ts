import { IConversation } from "@/interfaces/Conversation";
import axios from "axios";
import { BASE_API_URL, CALL_TYPE, USER_STATUS } from "@/utils/constant";
import { IMessage } from "@/interfaces/Message";
import { createHeader } from "..";
import { User } from "@/interfaces/User";

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
          lastMessage: conversationData.lastMessage?.content,
          isMyLastMessage: conversationData.isMyLastMessage,
          timeSend: conversationData.lastMessage?.timeSend,
          senderId: conversationData.lastMessage?.user.userId,
          avatar: conversationData.avatar,
          conversationName: conversationData.groupName || "",
          userStatus: USER_STATUS.OFF,
          privateUserId: null,
          callType: conversationData.callType,
        };

        if (conversation.type === "private") {
          conversation.userStatus = conversationData.member[0].onlineStatus;
          conversation.privateUserId = conversationData.member[0].userId;
          conversation.avatar = conversationData.member[0].avatar;
          conversation.conversationName = `${conversationData.member[0].firstName} ${conversationData.member[0].lastName}`;
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
        messageId: messageData.messageId,
        content: messageData.content,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
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
      conversationName: data.groupName || "",
      userStatus: USER_STATUS.OFF,
      privateUserId: null,
      callType: CALL_TYPE.NO,
    };

    if (conversation.type === "private") {
      const partnerId = userIds[0];
      const partner = data.users.find((user: any) => user.userId === partnerId);
      conversation.userStatus = partner.onlineStatus;
      conversation.privateUserId = partner.userId;
      conversation.avatar = partner.avatar;
      conversation.conversationName = `${partner.firstName} ${partner.lastName}`;
    }

    return conversation;
  } catch (err) {
    console.log(err);
  }
};

export const getConversationMembers = async (
  accessToken: string,
  conversationId: string
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.get(
      `${BASE_API_URL}/conversation/${conversationId}/member`,
      { headers }
    );
    const data = response.data;

    const members: User[] = data.users.map((user: any) => {
      const member: User = {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        id: user.userId,
      };

      return member;
    });

    return members;
  } catch (err) {}
};

export const leaveGroup = async (
  accessToken: string,
  conversationId: string
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.delete(
      `${BASE_API_URL}/conversation/${conversationId}/leave`,
      { headers }
    );

    return response;
  } catch (err) {}
};

export const addUsersToGroup = async (
  accessToken: string,
  conversationId: string,
  userIds: number[]
) => {
  try {
    const headers = createHeader(accessToken);
    const response = await axios.post(
      `${BASE_API_URL}/conversation/${conversationId}/member`,
      {
        userIds,
      },
      { headers }
    );

    const data = response.data;

    const members: User[] = data.users.map((user: any) => {
      const member: User = {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        id: user.userId,
      };

      return member;
    });

    return members;
  } catch (err) {}
};
