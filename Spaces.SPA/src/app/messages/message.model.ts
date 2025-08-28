export interface Message {
  id?: number;
  senderId: number;
  recipientId: number;
  content: string;
  sentAt?: string;
  isRead?: boolean;
}
