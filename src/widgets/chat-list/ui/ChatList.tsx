'use client';

import { useState } from 'react';
import st from './ChatList.module.css';
// fixme: временный мок .
const mockChats = [
  //chatId, phone, messages, unreadCount
  {
    chatId: 1,
    phone: '79897776655',
    messages: [
      { id: 1, text: 'Привет' },
      { id: 2, text: 'Как дела?' },
    ],
    unreadCount: 0,
  },
  { chatId: 2, phone: '89897776632', messages: [], unreadCount: 0 },
  {
    chatId: 3,
    phone: '89897336655',
    messages: [{ id: 1, text: 'Отправляй' }],
    unreadCount: 0,
  },
];

export function ChatList() {
  const [active, setActive] = useState(mockChats[0].chatId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isOpen = isSidebarOpen || !active;

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
            >
              +
            </button>
            <button
              className={st.iconButton}
              type='button'
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
          {mockChats.length === 0 && (
            <p className={st.empty}>Нажмите «+», чтобы начать чат</p>
          )}
          {mockChats.map((chat) => (
            <button
              key={chat.chatId}
              className={`${st.chatItem} ${chat.chatId === active && st.active}`}
              type='button'
              onClick={() => (setActive(chat.chatId), setIsSidebarOpen(true))}
            >
              <div className={st.avatar}>{chat.phone.charAt(0)}</div>
              <div className={st.info}>
                <div className={st.phone}>{chat.phone}</div>
                <div className={st.preview}>
                  {chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].text
                    : 'Нет сообщений'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
      {active && (
        <button
          type='button'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={st.toggleButton}
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
    </>
  );
}
