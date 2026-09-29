export interface InstanceCredentials {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export interface IncomingNotification {
  receiptId: number;
  body: {
    typeWebhook: string;
    senderData?: {
      chatId?: string;
      senderName?: string;
    };
    messageData?: {
      typeMessage?: string;
      textMessageData?: { textMessage?: string };
    };
    timestamp?: number;
  };
}

interface SendMessageResponse {
  idMessage: string;
}

/**
 * Собирает полный URL метода GREEN-API.
 *
 * @param credentials - учётные данные инстанса.
 * @param method - имя метода ("sendMessage", "receiveNotification"...).
 * @param extraPath - дополнительный путь (например, "/12345" для deleteNotification).
 */
function buildUrl(
  credentials: InstanceCredentials,
  method: string,
  extraPath = '',
): string {
  const { idInstance, apiTokenInstance, apiUrl } = credentials;
  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}${extraPath}`;
}

/**
 * Обёртка над fetch: выполняет запрос, проверяет HTTP-статус, возвращает JSON.
 *
 * @throws Error - при HTTP-ошибке (401 = неверные учётные данные и т.п.).
 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`GREEN-API error ${res.status}: ${res.statusText}`);
  }

  return (await res.json()) as T;
}

/**
 * Отправляет текстовое сообщение (метод SendMessage).
 *
 * @param credentials - учётные данные инстанса.
 * @param chatId - получатель вида "79991234567@c.us".
 * @param message - текст сообщения.
 */
export function sendMessage(
  credentials: InstanceCredentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const url = buildUrl(credentials, 'sendMessage');

  return request<SendMessageResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
}

/**
 * Забирает одно уведомление из очереди.
 *
 * @returns уведомление, либо null, если очередь пуста.
 */
export function receiveNotification(
  credentials: InstanceCredentials,
): Promise<IncomingNotification | null> {
  const url = buildUrl(credentials, 'receiveNotification');
  return request<IncomingNotification | null>(url);
}

/**
 * Подтверждает обработку уведомления и удаляет его из очереди.
 * Обязательный шаг: без него очередь блокируется и новые уведомления не приходят.
 *
 * @param credentials - учётные данные инстанса.
 * @param receiptId - идентификатор уведомления из receiveNotification.
 */
export function deleteNotification(
  credentials: InstanceCredentials,
  receiptId: number,
): Promise<unknown> {
  const url = buildUrl(credentials, 'deleteNotification', `/${receiptId}`);
  return request<unknown>(url, { method: 'DELETE' });
}

/** Ответ метода checkWhatsapp. */
interface CheckWhatsappResponse {
  existsWhatsapp: boolean;
  chatId?: string;
}


/**
 * Проверяет, зарегистрирован ли номер в WhatsApp (метод checkWhatsapp).
 *
 * @param credentials - учётные данные инстанса.
 * @param phone - номер в формате "79991234567" (без суффикса @c.us).
 * @returns объект с флагом existsWhatsapp.
 */
export function checkWhatsapp(
  credentials: InstanceCredentials,
  phone: string,
): Promise<CheckWhatsappResponse> {
  const url = buildUrl(credentials, 'checkWhatsapp');

  return request<CheckWhatsappResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber: Number(phone),
      force: false,
    }),
  });
}
