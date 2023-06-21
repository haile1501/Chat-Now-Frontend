export interface IMessage {
  content: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string;
  isMine: boolean;
}
