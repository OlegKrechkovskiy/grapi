export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  incoming: boolean;
}
