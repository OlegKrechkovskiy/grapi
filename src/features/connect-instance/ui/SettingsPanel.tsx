'use client';

import { useState } from 'react';

import { useLogin } from '../model/useLogin';

import st from './SettingsPanel.module.css';

export function SettingsPanel() {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const { error, isChecking, submit } = useLogin();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit({ idInstance, apiTokenInstance, apiUrl });
  };

  return (
    <div className={st.container}>
      <form className={st.form} onSubmit={handleSubmit}>

          <div className={`${st.info} ${showInfo ? st.infoShow : st.infoHide}`}>
            <h5 className={st.infoTitle}>Для работы с сервисом GREEN&#8209;API необходимо зарегистрироваться и получить данные:</h5>
            <ol className={st.infoList}>
              <li>
                <div className={`${st.infoColumn}`}>
                  <span>
                    Перейдите (зарегистрируйтесь) в кабинете{' '}
                    <b>GREEN&#8209;API</b>
                  </span>
                  <span>
                    <a
                      href='https://console.green-api.com/auth'
                      aria-label='GREEN-API'
                      title='Переход в GREEN-API'
                      target='_blank'
                    >
                      https://console.green-api.com/auth
                    </a>
                  </span>
                </div>
              </li>
              <li>
                В разделе <strong>"Инстансы"</strong> создать новый инстанс{' '}
                <strong>Whatsapp</strong>
              </li>
              <li>
                <div>
                  <p>
                    После создания инстанса будут доступны необходимые параметры:
                  </p>
                  <ul className={st.list}>
                    <li><strong>idInstance</strong> - <span className={st.listText}>идентификатор вашего аккаунта GREEN&#8209;API</span></li>
                    <li><strong>apiTokenInstance</strong> - <span className={st.listText}>токен из кабинета GREEN&#8209;API</span></li>
                    <li><strong>apiUrl</strong> - <span className={st.listText}>адрес сервиса GREEN&#8209;API</span></li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>

        <div
          className={st.buttonInfo}
          onClick={() => setShowInfo(!showInfo)}
          aria-label={showInfo ? 'Скрыть информацию' : 'Показать информацию'}
          title={showInfo ? 'Скрыть информацию' : 'Показать информацию'}>
          {showInfo ? 'i' : '?'}
        </div>
        <h1 className={st.title}>Вход в GREEN&#8209;API</h1>

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
