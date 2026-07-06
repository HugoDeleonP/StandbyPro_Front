"use client"

import { useEffect } from "react"
import { ServerCrash } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="flex max-w-md flex-col items-center gap-3 p-8 text-center">
        <ServerCrash className="size-8 text-muted-foreground" />
        <p className="font-medium">Não foi possível carregar os dados</p>
        <p className="text-sm text-muted-foreground">
          {error.message || "Verifique se o backend (standbypro-backend) está no ar e tente novamente."}
        </p>
        <Button onClick={reset}>Tentar novamente</Button>
      </Card>
    </div>
  )
}
