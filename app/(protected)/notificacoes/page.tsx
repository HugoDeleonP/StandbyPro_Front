import { PageHeader } from "@/components/page-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { getNotificacoes } from "@/lib/server-data"

export default async function NotificacoesPage() {
  const notificacoes = await getNotificacoes()

  return (
    <>
      <PageHeader
        title="Notificações"
        description="Eventos recentes do sistema: motores, ordens de serviço e usuários."
      />
      <NotificationsList notificacoes={notificacoes} />
    </>
  )
}
