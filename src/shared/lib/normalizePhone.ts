const DIGITS_ONLY = /\D/g;

const PHONE_LENGTH = 11;

/**
 * Нормализует номер телефона.
 *
 * @param raw - строка, введённая пользователем.
 * @returns чистый номер вида "79991234567".
 * @throws Error, если номер не удалось распознать.
 */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(DIGITS_ONLY, '');

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.length !== PHONE_LENGTH) {
    throw new Error(
      `Номер должен содержать ${PHONE_LENGTH} цифр в формате 7XXXXXXXXXX, получено: "${raw}"`,
    );
  }

  return digits;
}
