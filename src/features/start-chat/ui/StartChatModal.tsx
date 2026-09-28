'use client';

import { useState } from 'react';
import st from './StartChatModal.module.css';

interface StartChatModalProps {
  onClose: () => void;
}

export const StartChatModal = ({ onClose }: StartChatModalProps) => {
  const [phone, setPhone] = useState('');

  return (
    <div className={st.overlay}>
      <form className={st.modal}>
        <h2 className={st.title}>Новый чат</h2>
        <label className={st.label}>
          Номер собеседника
          <input
            className={st.input}
            type='tel'
            placeholder='+7 (999) 123-45-67'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
          />
        </label>
        <div className={st.actions}>
          <button className={st.cancel} type='button' onClick={onClose}>
            Отмена
          </button>
          <button className={st.submit} type='submit'>
            {'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};
