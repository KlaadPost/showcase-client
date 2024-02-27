export type ChatMessage = {
    id: string;
    created: string;
    updated: string;
    senderName: string;
    senderId: string;
    message: string;
  };

export type User = {
  id:	string;
  userName: string;
  role:	number;
  emailConfirmed:	boolean;
  muted: boolean
  chatMessages?: ChatMessage[];
}