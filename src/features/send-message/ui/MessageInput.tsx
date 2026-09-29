'use client';

import { useLayoutEffect, useRef } from 'react';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { MAX_TEXTAREA_HEIGHT_PX } from '@/shared/config/constants';
import { useSendMessage } from '../model/useSendMessage';
import st from './MessageInput.module.css';

export const MessageInput = () => {
  const activeChatId = useChatStore((store) => store.activeChatId);
  const draft = useChatStore((state) =>
    activeChatId ? (state.drafts[activeChatId] ?? '') : '',
  );
  const setDraft = useChatStore((state) => state.setDraft);
  const clearDraft = useChatStore((state) => state.clearDraft);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Авторастяжка поля по высоте (взято из другого проекта)
  // - зависимость [draft], а не событие input — высота синхронизируется
  //   с состоянием, поэтому работает и при смене чата, и при очистке
  //   черновика после отправки (input-событие там не сработало бы);
  // - useLayoutEffect — выполняется до отрисовки браузером, без «мигания»;
  // - сброс height на 'auto' обязателен: без него поле не «схлопнется»,
  //   когда текст удалили (scrollHeight считается от фактического содержимого);
  // - Math.min ограничивает высоту лимитом (7 строк), дальше — скролл внутри.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }, [draft]);

  const { isSending, error, send } = useSendMessage();

  // Отправка: при успехе очищаем черновик текущего чата
  const handleSend = async () => {
    const ok = await send(draft);
    if (ok && activeChatId) {
      clearDraft(activeChatId);
    }
  };

  // Enter отправляет сообщение (Shift+Enter — перенос строки)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
      return;
    }
  };

  return (
    <div className={st.container}>
      {error && <p className={st.error}>{error}</p>}

      <div className={st.row}>
        <textarea
          ref={textareaRef}
          className={st.input}
          rows={1}
          placeholder='Введите сообщение'
          value={draft}
          name='message'
          onChange={(e) => {
            // Черновик сохраняем только когда есть активный чат
            if (activeChatId) {
              setDraft(activeChatId, e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className={st.button}
          type='button'
          aria-label='Отправить сообщение'
          disabled={isSending || !draft.trim()}
          onClick={() => void handleSend()}
          title='Отправить сообщение'
        >
          ▶
        </button>
      </div>
    </div>
  );
};
