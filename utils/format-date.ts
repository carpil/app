import { format } from '@formkit/tempo'

export const formatDate = (dateTime: Date) => {
  const hour = format({
    date: dateTime,
    format: 'hh:mm aa',
    tz: 'America/Costa_Rica',
  })

  const date = format({
    date: dateTime,
    format: 'short',
    locale: 'es',
    tz: 'America/Costa_Rica',
  })

  const dateText = format({
    date: dateTime,
    format: 'D MMM YYYY', // 23 ene 2023
    locale: 'es',
    tz: 'America/Costa_Rica',
  })

  return {
    date,
    hour,
    dateText,
  }
}
