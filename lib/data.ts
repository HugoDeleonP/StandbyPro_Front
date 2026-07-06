// Tipos e helpers de exibicao alinhados ao contrato real da API
// (standbypro-backend). Os dados em si vem de lib/server-data.ts - este
// arquivo so define formatos e traducoes para a UI.

export type StatusMotor = "OPERANTE" | "EM_MANUTENCAO" | "INATIVO"
export type StatusOrdemServico = "ABERTA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA"
export type TipoManutencao = "PREVENTIVA" | "CORRETIVA" | "PREDITIVA"
export type Role = "TECNICO" | "SUPERVISOR" | "ADMIN"

export interface Motor {
  id: number
  modelo: string
  numeroSerie: string
  potenciaKw: number
  localizacao: string
  setor: string
  dataFabricacao: string | null
  status: StatusMotor
}

export interface OrdemServico {
  id: number
  motorId: number
  motorNumeroSerie: string
  tecnicoResponsavel: string
  tipo: TipoManutencao
  status: StatusOrdemServico
  descricao: string
  observacaoValidacao: string | null
  dataAbertura: string
  dataConclusao: string | null
}

export interface Usuario {
  id: number
  nome: string
  email: string
  role: Role
  setor: string | null
  ativo: boolean
  criadoEm: string
}

export interface Setor {
  id: number
  nome: string
  responsavel: string
  motores: number
  ordensAbertas: number
}

export interface Notificacao {
  id: number
  tipo: string
  mensagem: string
  entidade: string
  entidadeId: number | null
  lida: boolean
  criadaEm: string
}

export const labels = {
  statusMotor: {
    OPERANTE: "Operante",
    EM_MANUTENCAO: "Em manutenção",
    INATIVO: "Inativo",
  } as Record<StatusMotor, string>,
  statusOrdemServico: {
    ABERTA: "Aberta",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
  } as Record<StatusOrdemServico, string>,
  tipoManutencao: {
    PREVENTIVA: "Preventiva",
    CORRETIVA: "Corretiva",
    PREDITIVA: "Preditiva",
  } as Record<TipoManutencao, string>,
  role: {
    TECNICO: "Técnico",
    SUPERVISOR: "Supervisor",
    ADMIN: "Administrador",
  } as Record<Role, string>,
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const [y, m, d] = iso.slice(0, 10).split("-")
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}
