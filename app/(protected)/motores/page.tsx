import { PageHeader } from "@/components/page-header"
import { MotorsList } from "@/components/motors/motors-list"
import { getMotores } from "@/lib/server-data"

export default async function MotoresPage() {
  const motores = await getMotores()

  return (
    <>
      <PageHeader
        title="Motores WEG"
        description="Cadastro e monitoramento dos motores instalados no setor piloto."
      />
      <MotorsList motors={motores} />
    </>
  )
}
