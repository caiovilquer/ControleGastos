import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTotais } from "@/hooks/useTotais"

import { TotaisTable } from "./TotaisTable"

export function TotaisPage() {
  const { totais, loading } = useTotais()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Totais</CardTitle>
      </CardHeader>
      <CardContent>
        <TotaisTable totais={totais} loading={loading} />
      </CardContent>
    </Card>
  )
}
