import type { InstanceCredentials } from '@/shared/api/greenApi';
import type { ChatMessage } from '@/entities/message/model/types';

export type InstanceSettings = InstanceCredentials;

export interface Chat {
  chatId: string;
  phone: string;
  messages: ChatMessage[];
  senderChatName: string;
  unreadCount: number;
}
