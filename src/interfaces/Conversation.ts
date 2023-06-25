export interface IConversation {
  id: string;
  conversationName: string;
  avatar: string;
  lastMessage: string | null;
  timeSend: string | null;
  senderId: number | null;
  type: string;
  isMyLastMessage: boolean | null;
  isOnline: boolean;
  privateUserId: number | null;
}
