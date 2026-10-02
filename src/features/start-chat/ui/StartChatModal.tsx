'use client';

import { useState } from 'react';
import st from './StartChatModal.module.css';
import { useStartChat } from '../model/useStartChat';

interface StartChatModalProps {
  onClose(): void;
}

export const StartChatModal = ({ onClose }: StartChatModalProps) => {
  const [phone, setPhone] = useState('');
  const { isChecking, error, start } = useStartChat();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = await start(phone);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className={st.overlay} onClick={onClose}>
      <form
        className={st.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={st.title}>Новый чат</h2>

        <label className={st.label}>
          Номер собеседника
          <input
            className={st.input}
            type='tel'
            placeholder='+7(999)123-45-67'
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+()\-]/g, ''))}
            autoFocus
          />
        </label>

        {error && <p className={st.error}>{error}</p>}

        <div className={st.actions}>
          <button
            className={st.cancel}
            type='button'
            onClick={onClose}
            disabled={isChecking}
          >
            Отмена
          </button>
          <button
            className={st.submit}
            type='submit'
            disabled={isChecking || !phone.trim()}
          >
            {isChecking ? 'Проверка...' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};
