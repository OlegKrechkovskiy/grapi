import { useState } from 'react';

import { useChatStore } from '@/entities/chat/model/chatStore';
import type { InstanceSettings } from '@/entities/chat/model/types';
import { getStateInstance } from '@/shared/api/greenApi';

interface LoginForm {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

interface UseLoginResult {
  error: string | null;
  isChecking: boolean;
  submit(form: LoginForm): Promise<void>;
}

export function useLogin(): UseLoginResult {
  const login = useChatStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const submit = async (form: LoginForm) => {
    if (
      !form.idInstance.trim() ||
      !form.apiTokenInstance.trim() ||
      !form.apiUrl.trim()
    ) {
      setError('Заполните все поля');
      return;
    }

    const instance: InstanceSettings = {
      idInstance: form.idInstance.trim(),
      apiTokenInstance: form.apiTokenInstance.trim(),
      apiUrl: form.apiUrl.trim().replace(/\/+$/, ''),
    };

    setIsChecking(true);
    setError(null);

    try {
      await getStateInstance(instance);
      login(instance);
    } catch (e) {
      if (e instanceof TypeError) {
        // fetch упал на уровне сети: нет соединения, неверный apiUrl или CORS
        setError(
          'Не удалось подключиться к GREEN-API. ' +
            'Проверьте адрес (apiUrl) и интернет-соединение.',
        );
        return;
      }

      const message = e instanceof Error ? e.message : 'Не удалось войти';

      if (message.includes('404')) {
        setError('Инстанс не найден. Проверьте idInstance и apiUrl');
      } else if (message.includes('401')) {
        setError('Неверные учётные данные (idInstance / apiTokenInstance)');
      } else if (message.includes('429')) {
        setError('Слишком много запросов. Попробуйте позже');
      } else {
        setError(message + `   Проверьте apiUrl или Попробуйте позже`);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return { error, isChecking, submit };
}
