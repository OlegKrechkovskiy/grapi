'use client';

import { useState } from 'react';

import { useLogin } from '../model/useLogin';

import st from './SettingsPanel.module.css';

export function SettingsPanel() {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  const { error, isChecking, submit } = useLogin();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit({ idInstance, apiTokenInstance, apiUrl });
  };

  return (
    <div className={st.container}>
      <form className={st.form} onSubmit={handleSubmit}>
        <h1 className={st.title}>Вход в GREEN-API</h1>

        <label className={st.label}>
          idInstance
          <input
            className={st.input}
            type='text'
            placeholder='1101000001'
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value.replace(/\D/g, ''))}
          />
        </label>

        <label className={st.label}>
          apiTokenInstance
          <input
            className={st.input}
            type='password'
            placeholder='токен из кабинета GREEN-API'
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
        </label>

        <label className={st.label}>
          API-адрес (apiUrl)
          <input
            className={st.input}
            type='text'
            placeholder='https://7107.api.greenapi.com'
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </label>

        {error && <p className={st.error}>{error}</p>}

        <button className={st.button} type='submit' disabled={isChecking}>
          {isChecking ? 'Проверка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
