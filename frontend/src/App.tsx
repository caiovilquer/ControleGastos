import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { PessoasPage } from "@/components/pessoas/PessoasPage"
import { TransacoesPage } from "@/components/transacoes/TransacoesPage"

function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Controle de Gastos Residenciais</h1>

      <Tabs defaultValue="pessoas">
        <TabsList>
          <TabsTrigger value="pessoas">Pessoas</TabsTrigger>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="totais">Totais</TabsTrigger>
        </TabsList>

        <TabsContent value="pessoas">
          <PessoasPage />
        </TabsContent>

        <TabsContent value="transacoes">
          <TransacoesPage />
        </TabsContent>

        {/* Conteúdo implementado em tarefa futura. */}
        <TabsContent value="totais">
          <p className="text-sm text-muted-foreground">Em breve.</p>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

export default App
