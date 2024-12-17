import { format } from '@formkit/tempo'

export const formatDate = (dateTime: Date) => {
  const hour = format({
    date: dateTime,
    format: 'hh:mm a',
    tz: 'America/Costa_Rica',
  })
  const date = format({
    date: dateTime,
    format: 'short',
    locale: 'es',
    tz: 'America/Costa_Rica',
  })

  return {
    date,
    hour,
  }
}
