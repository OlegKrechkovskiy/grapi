import st from './ChatList.module.css';

export function ChatList() {
  return (
    <aside className={st.sidebar}>
      <header className={st.header}>
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
    </aside>
  );
}
