'use client';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { MessageInput } from '@/features/send-message/ui/MessageInput';
import { MessageList } from './MessageList';

import st from './ChatWindow.module.css';

export const ChatWindow = () => {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const removeChat = useChatStore((state) => state.removeChat);

  // Активный диалог (null, если ни один чат не открыт)
  const activeChat = chats.find((c) => c.chatId === activeChatId);

  const handleDeleteChat = () => {
    if (activeChat && window.confirm('Вы уверены, что хотите удалить чат?')) {
      removeChat(activeChat.chatId);
    }
  };

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
        <div className={st.avatar}>
          {activeChat.senderChatName
            ? activeChat.senderChatName.charAt(0)
            : activeChat.phone.charAt(0)}
        </div>
        <div className={st.info}>
          {activeChat.senderChatName && (
            <div className={st.name}>{activeChat.senderChatName}</div>
          )}
          <div className={st.phone}>{activeChat.phone}</div>
        </div>
        <button
          className={st.delete}
          onClick={handleDeleteChat}
          type='button'
          aria-label='Удалить чат'
          title='Удалить чат'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polyline points='3 6 5 6 21 6' />
            <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
            <line x1='10' y1='11' x2='10' y2='17' />
            <line x1='14' y1='11' x2='14' y2='17' />
          </svg>
        </button>
      </header>
      <MessageList messages={activeChat.messages} />
      <MessageInput />
    </section>
  );
};
