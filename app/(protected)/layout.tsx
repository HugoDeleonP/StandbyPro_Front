import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { getSession } from '@/lib/auth'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (session === null) {
    redirect('/login')
  }

  return (
    <AppShell name={session.nome} role={session.role}>
      {children}
    </AppShell>
  )
}
