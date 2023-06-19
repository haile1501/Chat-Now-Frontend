export interface IMessage {
  content: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  isMine: boolean;
}
