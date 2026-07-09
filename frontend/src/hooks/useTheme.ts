import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "controle-gastos:theme"

function lerPreferenciaInicial(): boolean {
  const salvo = localStorage.getItem(STORAGE_KEY)
  if (salvo) return salvo === "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

// Hook de UI puro (não é regra de negócio nem chama a API): controla a
// classe "dark" no <html>, exigida pelo esquema de cores do shadcn, e
// persiste a preferência do usuário entre sessões.
export function useTheme() {
  const [dark, setDark] = useState(lerPreferenciaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light")
  }, [dark])

  const toggle = useCallback(() => setDark((atual) => !atual), [])

  return { dark, toggle }
}
