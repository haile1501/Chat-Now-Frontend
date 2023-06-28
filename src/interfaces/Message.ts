export interface IMessage {
  messageId: number;
  content: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string;
  isMine: boolean;
}
