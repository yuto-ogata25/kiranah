"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"

export default function ApprovePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }
    // 後でLambda呼び出しに差し替え
    // 今はトークンがあればsuccessにする（テスト用）
    setTimeout(() => setStatus("success"), 1000)
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="size-16 rounded-full bg-primary/10 animate-pulse" />
            </div>
            <p className="text-muted-foreground">承認処理中...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="size-16 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
              予約を承認しました
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              お客様への確定通知が送信されました。
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="size-16 text-destructive mx-auto mb-6" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
              承認に失敗しました
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              URLが無効か、すでに処理済みの予約です。
            </p>
          </>
        )}
      </div>
    </div>
  )
}