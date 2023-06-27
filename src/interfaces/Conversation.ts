import { CALL_TYPE, USER_STATUS } from "@/utils/constant";

export interface IConversation {
  id: string;
  conversationName: string;
  avatar: string;
  lastMessage: string | null;
  timeSend: string | null;
  senderId: number | null;
  type: string;
  isMyLastMessage: boolean | null;
  userStatus: USER_STATUS;
  privateUserId: number | null;
  callType: CALL_TYPE;
}
