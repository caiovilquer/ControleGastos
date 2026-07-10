import { useState } from "react"

import { Header } from "@/components/layout/Header"
import { Sidebar, type Pagina } from "@/components/layout/Sidebar"
import { PessoasPage } from "@/components/pessoas/PessoasPage"
import { TotaisPage } from "@/components/totais/TotaisPage"
import { TransacoesPage } from "@/components/transacoes/TransacoesPage"
import { Toaster } from "@/components/ui/sonner"
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed"
import { useTheme } from "@/hooks/useTheme"

const TITULOS: Record<Pagina, { titulo: string; subtitulo: string }> = {
  totais: { titulo: "Totais", subtitulo: "Visão geral das contas da casa" },
  pessoas: { titulo: "Pessoas", subtitulo: "Cadastro e gestão dos membros da casa" },
  transacoes: { titulo: "Transações", subtitulo: "Lançamentos de receitas e despesas" },
}

function App() {
  const [pagina, setPagina] = useState<Pagina>("totais")
  const { dark, toggle } = useTheme()
  const { collapsed, toggle: toggleSidebar } = useSidebarCollapsed()
  const { titulo, subtitulo } = TITULOS[pagina]

  return (
    <div className="flex min-h-svh">
      <Sidebar
        paginaAtiva={pagina}
        onNavegar={setPagina}
        collapsed={collapsed}
        onToggleCollapsed={toggleSidebar}
      />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <Header titulo={titulo} subtitulo={subtitulo} dark={dark} onToggleDark={toggle} />

        {/* mx-auto equilibra o espaço nas laterais; max-w maior em telas
            largas evita coluna estreita com vazio só à direita. */}
        <div
          key={pagina}
          className="mx-auto w-full max-w-[1280px] animate-page-in px-6 pt-7 pb-12 sm:px-8 xl:max-w-[1480px] xl:px-10"
        >
          {/* Cada página é montada/desmontada ao trocar de navegação — os
              hooks de dados (usePessoas/useTransacoes/useTotais) recarregam
              no mount, então a tela sempre reflete mudanças feitas alhures. */}
          {pagina === "totais" && <TotaisPage onNavegarParaTransacoes={() => setPagina("transacoes")} />}
          {pagina === "pessoas" && <PessoasPage />}
          {pagina === "transacoes" && <TransacoesPage />}
        </div>
      </main>

      <Toaster />
    </div>
  )
}

export default App
