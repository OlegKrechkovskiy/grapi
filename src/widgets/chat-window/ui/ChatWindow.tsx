'use client';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { MessageInput } from '@/features/send-message/ui/MessageInput';
import { MessageList } from './MessageList';

import st from './ChatWindow.module.css';

export const ChatWindow = () => {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);

  // Активный диалог (null, если ни один чат не открыт)
  const activeChat = chats.find((c) => c.chatId === activeChatId);

  // Нет активного чата — заглушка
  if (!activeChat) {
    return (
      <section className={st.window}>
        <div className={st.placeholder}>
          <p className={st.text}>Выберите чат, чтобы начать общение</p>
        </div>
      </section>
    );
  }

  return (
    <section className={st.window}>
      <header className={st.header}>
        <div className={st.avatar}>{activeChat.senderChatName ? activeChat.senderChatName.charAt(0) : activeChat.phone.charAt(0)}</div>
        <div className={st.info}>
          {activeChat.senderChatName && <div className={st.name}>{activeChat.senderChatName}</div>}
          <div className={st.phone}>{activeChat.phone}</div>
        </div>
      </header>
      <MessageList messages={activeChat.messages} />
      <MessageInput />
    </section>
  );
};
