import type { Locale } from "@/lib/i18n/dictionaries"

function getIntlLocale(locale: Locale) {
  return locale === "ar" ? "ar-BH" : "en-US"
}

export function formatLocalizedDate(
  value: string | number | Date,
  locale: Locale
) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return locale === "ar"
      ? "وقت غير معروف"
      : "Unknown time"
  }

  return new Intl.DateTimeFormat(
    getIntlLocale(locale),
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date)
}

export function formatLocalizedRelativeTime(
  value: string | number | Date,
  locale: Locale
) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const seconds = Math.round(
    (date.getTime() - Date.now()) / 1000
  )

  const formatter =
    new Intl.RelativeTimeFormat(
      getIntlLocale(locale),
      {
        numeric: "auto",
      }
    )

  if (Math.abs(seconds) < 60) {
    return formatter.format(
      seconds,
      "second"
    )
  }

  const minutes = Math.round(
    seconds / 60
  )

  if (Math.abs(minutes) < 60) {
    return formatter.format(
      minutes,
      "minute"
    )
  }

  const hours = Math.round(
    minutes / 60
  )

  if (Math.abs(hours) < 24) {
    return formatter.format(
      hours,
      "hour"
    )
  }

  const days = Math.round(
    hours / 24
  )

  if (Math.abs(days) < 30) {
    return formatter.format(
      days,
      "day"
    )
  }

  const months = Math.round(
    days / 30
  )

  if (Math.abs(months) < 12) {
    return formatter.format(
      months,
      "month"
    )
  }

  const years = Math.round(
    months / 12
  )

  return formatter.format(
    years,
    "year"
  )
}

export function formatLocalizedNumber(
  value: number,
  locale: Locale
) {
  return new Intl.NumberFormat(
    getIntlLocale(locale)
  ).format(value)
}