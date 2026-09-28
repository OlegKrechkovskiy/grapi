'use client';

import { MAX_TEXTAREA_HEIGHT_PX } from '@/shared/config/constants';
import { useEffect, useLayoutEffect, useRef } from 'react';
import st from './MessageInput.module.css';

export const MessageInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const inputHandler = (e: React.InputEvent<HTMLTextAreaElement>) => {
    const el = e.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
    if (textareaRef.current) {
      textareaRef.current.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
    }
  };

  return (
    <div className={st.container}>
      <div className={st.row}>
        <textarea
          ref={textareaRef}
          className={st.input}
          rows={1}
          name='message'
          placeholder='Введите сообщение'
          onInput={(e) => inputHandler(e)}
          onBlur={(e) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
          }}
        />
        <button
          className={st.button}
          type='button'
          aria-label='Отправить сообщение'
          title='Отправить сообщение'
        >
          ▶
        </button>
      </div>
    </div>
  );
};
