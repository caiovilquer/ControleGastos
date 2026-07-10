import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "casaconta:sidebar-collapsed"

function lerPreferenciaInicial(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "1"
}

// Persiste se a sidebar está recolhida (só ícones) entre sessões.
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(lerPreferenciaInicial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
  }, [collapsed])

  const toggle = useCallback(() => setCollapsed((atual) => !atual), [])

  return { collapsed, toggle }
}
