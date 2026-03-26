"use client"

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Clock,
  Sparkles,
  LogOut,
  XCircle,
  AlertCircle,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                   */
/* ------------------------------------------------------------------ */

type ReservationStatus = "confirmed" | "pending" | "cancelled"

interface Reservation {
  id: string
  menuName: string
  duration: string
  price: string
  date: string        // ISO string: "2026-04-10"
  time: string        // "14:30"
  status: ReservationStatus
  coupon?: string
}

// Phase 8 でLambda（GET /reservations?userId=...）に差し替え
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "rsv-001",
    menuName: "選べるセットコース",
    duration: "90分",
    price: "¥10,000",
    date: "2026-04-10",
    time: "14:30",
    status: "confirmed",
  },
  {
    id: "rsv-002",
    menuName: "選べるセットコース",
    duration: "120分",
    price: "¥13,000",
    date: "2026-04-20",
    time: "11:30",
    status: "pending",
    coupon: "新規限定クーポン",
  },
  {
    id: "rsv-003",
    menuName: "選べるセットコース",
    duration: "90分",
    price: "¥10,000",
    date: "2026-03-01",
    time: "16:00",
    status: "cancelled",
  },
]

const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: "確定済み",
  pending: "承認待ち",
  cancelled: "キャンセル済み",
}

const STATUS_VARIANT: Record<
  ReservationStatus,
  "default" | "secondary" | "destructive"
> = {
  confirmed: "default",
  pending: "secondary",
  cancelled: "destructive",
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  })
}

/** 前日以降はキャンセル不可（当日・翌日以降はOK、前日は不可） */
function canCancel(dateIso: string, status: ReservationStatus) {
  if (status === "cancelled") return false
  const reservationDate = new Date(dateIso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  reservationDate.setHours(0, 0, 0, 0)
  const diffDays = Math.floor(
    (reservationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diffDays >= 2 // 2日以上先のみキャンセル可
}

/* ------------------------------------------------------------------ */
/*  Reservation Card                                                    */
/* ------------------------------------------------------------------ */

function ReservationCard({
  reservation,
  onCancel,
  cancelling,
}: {
  reservation: Reservation
  onCancel: (id: string) => void
  cancelling: string | null
}) {
  const cancelable = canCancel(reservation.date, reservation.status)
  const isCancelling = cancelling === reservation.id

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">{reservation.menuName}</span>
          <span className="text-sm text-muted-foreground">({reservation.duration})</span>
        </div>
        <Badge variant={STATUS_VARIANT[reservation.status]}>
          {STATUS_LABEL[reservation.status]}
        </Badge>
      </div>

      {/* Date & Time */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" />
          {formatDate(reservation.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" />
          {reservation.time}〜
        </span>
      </div>

      {/* Price & Coupon */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-medium text-foreground">{reservation.price}</span>
        {reservation.coupon && (
          <Badge variant="outline" className="text-xs">
            {reservation.coupon}
          </Badge>
        )}
      </div>

      {/* Cancel */}
      {reservation.status !== "cancelled" && (
        <div className="pt-1">
          {cancelable ? (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
              disabled={isCancelling}
              onClick={() => onCancel(reservation.id)}
            >
              <XCircle className="size-4 mr-1.5" />
              {isCancelling ? "キャンセル中..." : "予約をキャンセルする"}
            </Button>
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertCircle className="size-3.5 shrink-0" />
              前日までのキャンセルはお電話にてご連絡ください
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function MyPage() {
  const { data: session } = useSession()
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS)
  const [cancelling, setCancelling] = useState<string | null>(null)

  // Phase 8 でLambda（POST /reservations/cancel）に差し替え
  async function handleCancel(id: string) {
    setCancelling(id)
    await new Promise((r) => setTimeout(r, 800)) // テスト用ディレイ
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
    )
    setCancelling(null)
  }

  const upcoming = reservations.filter(
    (r) => r.status !== "cancelled" && new Date(r.date) >= new Date()
  )
  const past = reservations.filter(
    (r) => r.status === "cancelled" || new Date(r.date) < new Date()
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">ログイン中</p>
            <p className="text-sm font-medium text-foreground">
              {session?.user?.name ?? "ゲスト"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-4 mr-1.5" />
            ログアウト
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          マイページ
        </h1>

        {/* Upcoming */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            予定の予約
          </h2>
          {upcoming.length > 0 ? (
            upcoming.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onCancel={handleCancel}
                cancelling={cancelling}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
              予約はありません
            </div>
          )}
        </section>

        {/* Past / Cancelled */}
        {past.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              過去の予約
            </h2>
            {past.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onCancel={handleCancel}
                cancelling={cancelling}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
