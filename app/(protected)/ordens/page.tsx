import { PageHeader } from "@/components/page-header"
import { OrdersBoard } from "@/components/orders/orders-board"
import { getMotores, getOrdens } from "@/lib/server-data"
import { getSession } from "@/lib/auth"

export default async function OrdensPage() {
  const session = await getSession()
  const [ordens, motores] = await Promise.all([getOrdens(), getMotores()])

  return (
    <>
      <PageHeader
        title="Ordens de Serviço"
        description="Crie, execute e valide as ordens de manutenção dos motores."
      />
      <OrdersBoard ordens={ordens} motores={motores} role={session!.role} />
    </>
  )
}
