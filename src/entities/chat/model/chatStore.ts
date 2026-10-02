import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEY } from '@/shared/config/constants';
import type { Chat, InstanceSettings } from './types';
import type { ChatMessage } from '@/entities/message/model/types';

/** Состояние и экшены стора чата. */
interface ChatState {
  instance: InstanceSettings | null;
  lastInstanceId: string | null;
  chats: Chat[];
  drafts: Record<string, string>;
  activeChatId: string | null;
  error: string | null;

  login(instance: InstanceSettings): void;
  logout(): void;
  addChat(
    chatId: string,
    phone: string,
    messages?: ChatMessage[],
    senderChatName?: string,
    avatar?: string,
  ): void;
  removeChat(chatId: string): void;
  setActiveChat(chatId: string | null): void;
  setDraft(chatId: string, text: string): void;
  clearDraft(chatId: string): void;
  addOutgoing(chatId: string, text: string, idMessage: string): void;
  addIncoming(
    chatId: string,
    text: string,
    timestampSec: number,
    senderChatName?: string,
  ): void;
  ensureChat(chatId: string): void;
  setError(error: string | null): void;
}

function makeLocalId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function phoneFromChatId(chatId: string): string {
  return chatId.replace('@c.us', '');
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      instance: null,
      lastInstanceId: null,
      chats: [],
      activeChatId: null,
      error: null,
      drafts: {},

      login: (instance) =>
        set((state) => {
          const sameInstance = state.lastInstanceId === instance.idInstance;

          return {
            instance,
            lastInstanceId: instance.idInstance,
            activeChatId: null,
            error: null,
            chats: sameInstance ? state.chats : [],
            drafts: sameInstance ? state.drafts : {},
          };
        }),

      logout: () => set({ instance: null, activeChatId: null, error: null }),

      addChat: (
        chatId,
        phone,
        messages = [],
        senderChatName = '',
        avatar = '',
      ) =>
        set((state) => {
          if (state.chats.some((c) => c.chatId === chatId)) return state;
          return {
            chats: [
              ...state.chats,
              {
                chatId,
                phone,
                messages,
                senderChatName,
                avatar,
                unreadCount: 0,
              },
            ],
          };
        }),

      removeChat: (chatId) =>
        set((state) => {
          const drafts = { ...state.drafts };
          delete drafts[chatId];
          return {
            chats: state.chats.filter((c) => c.chatId !== chatId),
            activeChatId:
              state.activeChatId === chatId ? null : state.activeChatId,
            drafts,
          };
        }),

      setActiveChat: (chatId) =>
        set((state) => ({
          activeChatId: chatId,
          chats: state.chats.map((c) =>
            c.chatId === chatId ? { ...c, unreadCount: 0 } : c,
          ),
        })),

      setDraft: (chatId, text) =>
        set((state) => ({
          drafts: { ...state.drafts, [chatId]: text },
        })),

      clearDraft: (chatId) =>
        set((state) => {
          const drafts = { ...state.drafts };
          delete drafts[chatId];
          return { drafts };
        }),

      addOutgoing: (chatId, text, idMessage) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.chatId === chatId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: idMessage || makeLocalId(),
                      text,
                      timestamp: Date.now(),
                      incoming: false,
                    },
                  ],
                }
              : c,
          ),
        })),

      addIncoming: (chatId, text, timestampSec, senderChatName) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.chatId === chatId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: makeLocalId(),
                      text,
                      timestamp: timestampSec * 1000,
                      incoming: true,
                    },
                  ],
                  senderChatName: senderChatName || '',
                  unreadCount:
                    c.chatId === state.activeChatId
                      ? c.unreadCount
                      : c.unreadCount + 1,
                }
              : c,
          ),
        })),

      ensureChat: (chatId) =>
        set((state) => {
          if (state.chats.some((c) => c.chatId === chatId)) {
            return state;
          }
          return {
            chats: [
              ...state.chats,
              {
                chatId,
                phone: phoneFromChatId(chatId),
                messages: [],
                senderChatName: '',
                avatar: '',
                unreadCount: 0,
              },
            ],
          };
        }),

      setError: (error) => set({ error }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        instance: state.instance,
        lastInstanceId: state.lastInstanceId,
        chats: state.chats,
        drafts: state.drafts,
      }),
    },
  ),
);
