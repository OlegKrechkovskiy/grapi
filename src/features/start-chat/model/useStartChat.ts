/**
 * Фича "Новый чат" (слой features).
 *
 * Сценарий добавления диалога: нормализация номера,
 * проверка наличия WhatsApp (checkWhatsapp) и сохранение чата в стор.
 */

import { useState } from 'react';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { checkWhatsapp } from '@/shared/api/greenApi';
import { normalizePhone } from '@/shared/lib/normalizePhone';
import { CHAT_ID_SUFFIX } from '@/shared/config/constants';

/** Результат хука создания чата. */
interface UseStartChatResult {
  isChecking: boolean;
  error: string | null;
  start(phoneInput: string): Promise<boolean>;
}

export function useStartChat(): UseStartChatResult {
  const instance = useChatStore((state) => state.instance);
  const addChat = useChatStore((state) => state.addChat);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const setError = useChatStore((state) => state.setError);
  const logout = useChatStore((state) => state.logout);

  const [isChecking, setIsChecking] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const start = async (phoneInput: string): Promise<boolean> => {
    if (!instance) {
      return false;
    }

    setIsChecking(true);
    setLocalError(null);

    try {
      const phone = normalizePhone(phoneInput);

      const { existsWhatsapp } = await checkWhatsapp(instance, phone);

      if (!existsWhatsapp) {
        setLocalError('Номер не зарегистрирован в WhatsApp');
        return false;
      }

      const targetChatId = `${phone}${CHAT_ID_SUFFIX}`;

      addChat(targetChatId, phone);
      setActiveChat(targetChatId);

      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Ошибка проверки номера';
      setLocalError(message);
      setError(message);
      if (message.includes('401')) {
        logout();
      }
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return { isChecking, error, start };
}
