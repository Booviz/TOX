"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  dictionaries,
  type Locale,
} from "@/lib/i18n/dictionaries"

type LocaleContextValue = {
  locale: Locale
  dir: "ltr"
  setLocale: (locale: Locale) => void
  toggle: () => void
  t: (key: string) => string
}

const LocaleContext =
  createContext<LocaleContextValue | null>(
    null
  )

const STORAGE_KEY = "tox-locale"

export function LocaleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [locale, setLocaleState] =
    useState<Locale>("en")

  useEffect(() => {
    const storedLocale =
      window.localStorage.getItem(
        STORAGE_KEY
      )

    if (
      storedLocale === "en" ||
      storedLocale === "ar"
    ) {
      setLocaleState(storedLocale)
    }
  }, [])

  useEffect(() => {
    /*
     * الواجهة تبقى ثابتة دائمًا.
     * اللغة تتغير، لكن السايدبار والهيدر
     * واتجاه توزيع العناصر لا ينقلب.
     */
    document.documentElement.setAttribute(
      "dir",
      "ltr"
    )

    document.documentElement.setAttribute(
      "lang",
      locale
    )

    window.localStorage.setItem(
      STORAGE_KEY,
      locale
    )
  }, [locale])

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale)
    },
    []
  )

  const toggle = useCallback(() => {
    setLocaleState((currentLocale) =>
      currentLocale === "en"
        ? "ar"
        : "en"
    )
  }, [])

  const t = useCallback(
    (key: string) => {
      return (
        dictionaries[locale][key] ??
        dictionaries.en[key] ??
        key
      )
    },
    [locale]
  )

  const value =
    useMemo<LocaleContextValue>(
      () => ({
        locale,
        dir: "ltr",
        setLocale,
        toggle,
        t,
      }),
      [locale, setLocale, toggle, t]
    )

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context =
    useContext(LocaleContext)

  if (!context) {
    throw new Error(
      "useLocale must be used within LocaleProvider"
    )
  }

  return context
}