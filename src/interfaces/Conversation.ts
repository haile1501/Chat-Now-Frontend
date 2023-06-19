export interface IConversation {
  id: string;
  conversationName: string;
  avatar: string;
  lastMessage: string;
  timeSend: string;
  senderId: number;
  type: string;
  isMyLastMessage: boolean;
}
