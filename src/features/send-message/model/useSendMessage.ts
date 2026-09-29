import { useState } from 'react';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { sendMessage as sendMessageApi } from '@/shared/api/greenApi';

interface UseSendMessageResult {
  isSending: boolean;
  error: string | null;
  send(text: string): Promise<boolean>;
}

export function useSendMessage(): UseSendMessageResult {
  const instance = useChatStore((state) => state.instance);
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const addOutgoing = useChatStore((state) => state.addOutgoing);
  const setError = useChatStore((state) => state.setError);
  const logout = useChatStore((state) => state.logout);

  const [isSending, setIsSending] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const send = async (text: string): Promise<boolean> => {
    const activeChat = chats.find((c) => c.chatId === activeChatId);

    if (!text.trim() || !instance || !activeChat) {
      return false;
    }

    setIsSending(true);
    setLocalError(null);

    try {
      const response = await sendMessageApi(
        instance,
        activeChat.chatId,
        text.trim(),
      );

      addOutgoing(activeChat.chatId, text.trim(), response.idMessage);

      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Ошибка отправки';
      setLocalError(message);
      setError(message);
      if (message.includes('401')) {
        logout();
      }
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { isSending, error, send };
}
