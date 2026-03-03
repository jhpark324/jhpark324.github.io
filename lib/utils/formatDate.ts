const defaultDateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export function formatDate(
  date: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = defaultDateOptions
) {
  return new Date(date).toLocaleDateString(locale, {
    ...options,
    timeZone: 'UTC',
  })
}
