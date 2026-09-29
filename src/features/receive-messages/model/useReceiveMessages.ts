/**
 *
 * технология HTTP API GREEN-API:
 * периодически опрашивает очередь уведомлений, обрабатывает
 * входящие текстовые сообщения и удаляет уведомления из очереди.
 *
 * Каждое сообщение маршрутизируется в свой диалог по senderData.chatId;
 * диалог создаётся автоматически, если собеседник пишет впервые.
 *
 * Ключевой нюанс: полученное уведомление ОБЯЗАТЕЛЬНО нужно удалить
 * (deleteNotification), иначе оно заблокирует очередь.
 */

import { useEffect, useRef } from 'react';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { deleteNotification, receiveNotification } from '@/shared/api/greenApi';
import { POLLING_INTERVAL_MS } from '@/shared/config/constants';

const WEBHOOK_INCOMING_MESSAGE = 'incomingMessageReceived';
const MESSAGE_TYPE_TEXT = 'textMessage';

export function useReceiveMessages(): void {
  const instance = useChatStore((state) => state.instance);
  const ensureChat = useChatStore((state) => state.ensureChat);
  const addIncoming = useChatStore((state) => state.addIncoming);
  const setError = useChatStore((state) => state.setError);
  const logout = useChatStore((state) => state.logout);

  const isPollingRef = useRef(false);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!instance) {
      return;
    }

    isPollingRef.current = false;
    stopRef.current = false;

    const pollOnce = async () => {
      if (isPollingRef.current || stopRef.current) {
        return;
      }
      isPollingRef.current = true;

      try {
        for (;;) {
          const notification = await receiveNotification(instance);

          if (!notification) {
            break;
          }

          const { body, receiptId } = notification;

          const messageData = body.messageData;
          const text = messageData?.textMessageData?.textMessage;
          const senderChatId = body.senderData?.chatId;

          const isIncomingText =
            body.typeWebhook === WEBHOOK_INCOMING_MESSAGE &&
            messageData?.typeMessage === MESSAGE_TYPE_TEXT &&
            typeof text === 'string' &&
            typeof senderChatId === 'string';

          if (isIncomingText && typeof text === 'string' && senderChatId) {
            ensureChat(senderChatId);
            addIncoming(
              senderChatId,
              text,
              body.timestamp ?? Math.floor(Date.now() / 1000),
            );
          }

          try {
            await deleteNotification(instance, receiptId);
          } catch {
            break;
          }
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Ошибка получения сообщений';
        setError(message);
        if (message.includes('401')) {
          stopRef.current = true;
          logout();
        }
      } finally {
        isPollingRef.current = false;
      }
    };

    void pollOnce();
    const intervalId = setInterval(pollOnce, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [instance, ensureChat, addIncoming, setError, logout]);
}
