'use client';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { StartChatModal } from '@/features/start-chat/ui/StartChatModal';
import { useState } from 'react';
import st from './ChatList.module.css';

export function ChatList() {
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const logout = useChatStore((state) => state.logout);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isOpen = isSidebarOpen || !activeChatId;

  const handleSelectChat = (chatid: string) => {
    setActiveChat(chatid);
    setIsSidebarOpen(false);
  };

  const handleExit = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
    }
  };

  return (
    <>
      <aside className={`${st.sidebar} ${isOpen ? st.open : ''}`}>
        <header className={st.header}>
          <span className={st.icon}></span>
          <span className={st.title}>Чаты</span>
          <div className={st.actions}>
            <button
              className={st.iconButton}
              type='button'
              aria-label='Новый чат'
              title='Новый чат'
              onClick={() => {
                setIsModalOpen(true);
                setIsSidebarOpen(false);
              }}
            >
              +
            </button>
            <button
              className={st.iconButton}
              type='button'
              onClick={handleExit}
              aria-label='Выйти'
              title='Выйти'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'
                />
              </svg>
            </button>
          </div>
        </header>
        <div className={st.list}>
          {chats.length === 0 && (
            <p className={st.empty}>Нажмите «+», чтобы начать чат</p>
          )}
          {chats.map((chat) => (
            <button
              key={chat.chatId}
              className={`${st.chatItem} ${chat.chatId === activeChatId && st.active}`}
              type='button'
              onClick={() => handleSelectChat(chat.chatId)}
            >
              <div className={st.avatar}>{chat.senderChatName ? chat.senderChatName.charAt(0) : chat.phone.charAt(0)}</div>
              {/* <div className={st.avatar}>{chat.phone.charAt(0)}</div> */}
              <div className={st.info}>
                {chat.senderChatName && <div className={st.name}>{chat.senderChatName}</div>}
                <div className={st.phone}>{chat.phone}</div>
                <div className={st.preview}>
                  {chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].text
                    : 'Нет сообщений'}
                </div>
                {chat.unreadCount > 0 && (
                  <div className={st.badge} title={`Новых сообщений: ${chat.unreadCount}`} aria-label={`Новых сообщений: ${chat.unreadCount}`}>{chat.unreadCount}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>
      {activeChatId && (
        <button
          type='button'
          className={`${st.toggleButton} ${isOpen ? st.open : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={
            isSidebarOpen ? 'Скрыть список чатов' : 'Показать список чатов'
          }
          title={
            isSidebarOpen ? 'Скрыть список чатов' : 'Показать список чатов'
          }
        >
          {isSidebarOpen ? '<' : 'Чаты'}
        </button>
      )}

      {isModalOpen && <StartChatModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
