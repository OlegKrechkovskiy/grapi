'use client';

import { useOnlineStatus } from '@/shared/lib/useOnlineStatus';

import styles from './OfflineBanner.module.css';

// Предупреждение о недоступности интернета
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.banner} role='status'>
      Нет подключения к интернету
    </div>
  );
}
