"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CalendarDays,
  LogOut,
  Trash2,
  Plus,
  Tag,
  Sparkles,
  ListOrdered,
  Ban,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { ja } from "date-fns/locale"

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type ReservationStatus = "pending" | "confirmed" | "cancelled"

interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  date: string
  time: string
  menuName: string
  duration: string
  price: string
  status: ReservationStatus
  coupon?: string
}

interface MenuItem {
  id: string
  name: string
  duration: string
  price: string
  badge: string | null
  isActive: boolean
}

interface BlockedSlot {
  id: string
  date: string
  timeSlot: string
  reason: string
}

interface Coupon {
  id: string
  code: string
  label: string
  discountRate: string
  expiry: string
  isActive: boolean
}

/* ------------------------------------------------------------------ */
/*  Mock Data（Phase 8 でLambdaに差し替え）                             */
/* ------------------------------------------------------------------ */

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "rsv-001",
    customerName: "山田 花子",
    customerEmail: "hanako@example.com",
    date: "2026-04-10",
    time: "14:30",
    menuName: "選べるセットコース",
    duration: "90分",
    price: "¥10,000",
    status: "confirmed",
  },
  {
    id: "rsv-002",
    customerName: "佐藤 美咲",
    customerEmail: "misaki@example.com",
    date: "2026-04-20",
    time: "11:30",
    menuName: "選べるセットコース",
    duration: "120分",
    price: "¥13,000",
    status: "pending",
    coupon: "新規限定クーポン",
  },
  {
    id: "rsv-003",
    customerName: "鈴木 智子",
    customerEmail: "tomoko@example.com",
    date: "2026-03-01",
    time: "16:00",
    menuName: "選べるセットコース",
    duration: "90分",
    price: "¥10,000",
    status: "cancelled",
  },
]

const INITIAL_MENUS: MenuItem[] = [
  { id: "m1", name: "選べるセットコース", duration: "90分", price: "¥10,000", badge: "人気 No.1", isActive: true },
  { id: "m2", name: "選べるセットコース", duration: "120分", price: "¥13,000", badge: "おすすめ", isActive: true },
  { id: "m3", name: "選べるセットコース", duration: "180分", price: "¥20,000", badge: null, isActive: false },
]

const INITIAL_BLOCKS: BlockedSlot[] = [
  { id: "b1", date: "2026-04-05", timeSlot: "10:00", reason: "設備メンテナンス" },
  { id: "b2", date: "2026-04-05", timeSlot: "11:30", reason: "設備メンテナンス" },
]

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "FIRST",
    label: "新規限定 ボディケア整体 60分 6,600円→4,000円",
    discountRate: "40%",
    expiry: "2026-12-31",
    isActive: true,
  },
  {
    id: "c2",
    code: "LINE",
    label: "アロマオイルトリートメント 60分 10,000円→7,000円",
    discountRate: "30%",
    expiry: "2026-09-30",
    isActive: true,
  },
]

const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"]

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: "確定済み",
  pending: "承認待ち",
  cancelled: "キャンセル済み",
}

const STATUS_VARIANT: Record<ReservationStatus, "default" | "secondary" | "destructive"> = {
  confirmed: "default",
  pending: "secondary",
  cancelled: "destructive",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  })
}

/* ------------------------------------------------------------------ */
/*  Tab: 予約一覧                                                       */
/* ------------------------------------------------------------------ */

function ReservationsTab() {
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS)
  const [filter, setFilter] = useState<ReservationStatus | "all">("all")

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter)

  function handleCancel(id: string) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
    )
  }

  return (
    <div className="space-y-4">
      {/* フィルター */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "すべて" : STATUS_LABEL[s]}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>氏名</TableHead>
              <TableHead className="hidden md:table-cell">メニュー</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  該当する予約はありません
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">
                    <p className="font-medium text-sm">{formatDate(r.date)}</p>
                    <p className="text-xs text-muted-foreground">{r.time}〜</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{r.customerName}</p>
                    <p className="text-xs text-muted-foreground hidden md:block">{r.customerEmail}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {r.menuName}（{r.duration}）
                    {r.coupon && (
                      <span className="ml-2 text-xs text-muted-foreground">🎫 {r.coupon}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[r.status]}>
                      {STATUS_LABEL[r.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleCancel(r.id)}
                      >
                        <Trash2 className="size-4" />
                        <span className="hidden md:inline ml-1">キャンセル</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: ブロック設定                                                    */
/* ------------------------------------------------------------------ */

function BlocksTab() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")

  function handleAdd() {
    if (!selectedDate || !selectedTime) return
    const dateIso = selectedDate.toISOString().split("T")[0]
    const newBlock: BlockedSlot = {
      id: `b-${Date.now()}`,
      date: dateIso,
      timeSlot: selectedTime,
      reason: reason || "ブロック",
    }
    setBlocks((prev) => [...prev, newBlock])
    setSelectedTime("")
    setReason("")
  }

  function handleDelete(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* カレンダー */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">日付を選択</p>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ja}
            className="rounded-xl border border-border p-3 w-fit"
          />
        </div>

        {/* 時間・理由・追加ボタン */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>時間枠</Label>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={selectedTime === t ? "default" : "outline"}
                  onClick={() => setSelectedTime(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">理由（任意）</Label>
            <Input
              id="reason"
              placeholder="例：設備メンテナンス"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!selectedDate || !selectedTime}
            className="w-full"
          >
            <Plus className="size-4 mr-1.5" />
            ブロックを追加
          </Button>
        </div>
      </div>

      <Separator />

      {/* ブロック一覧 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">設定済みブロック</p>
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">ブロックはありません</p>
        ) : (
          blocks.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Ban className="size-4 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium">{formatDate(b.date)} {b.timeSlot}</p>
                  <p className="text-xs text-muted-foreground">{b.reason}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(b.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: メニュー編集                                                    */
/* ------------------------------------------------------------------ */

function MenusTab() {
  const [menus, setMenus] = useState(INITIAL_MENUS)

  function toggleActive(id: string) {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    )
  }

  return (
    <div className="space-y-3">
      {menus.map((m) => (
        <div
          key={m.id}
          className={`rounded-xl border px-5 py-4 flex items-center justify-between gap-4 transition-colors ${
            m.isActive ? "border-border bg-card" : "border-border/50 bg-muted/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className={`size-4 shrink-0 ${m.isActive ? "text-primary" : "text-muted-foreground"}`} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${m.isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {m.name}
                </p>
                {m.badge && <Badge variant="secondary" className="text-xs">{m.badge}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {m.duration}｜{m.price}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">{m.isActive ? "公開中" : "非公開"}</span>
            <Switch
              checked={m.isActive}
              onCheckedChange={() => toggleActive(m.id)}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground pt-2">
        ※ メニュー内容の編集（名前・価格）は Phase 8 で実装予定です。
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: クーポン管理                                                    */
/* ------------------------------------------------------------------ */

function CouponsTab() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS)
  const [newCode, setNewCode] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newDiscount, setNewDiscount] = useState("")
  const [newExpiry, setNewExpiry] = useState("")

  function toggleActive(id: string) {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
  }

  function handleAdd() {
    if (!newCode || !newLabel) return
    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: newCode.toUpperCase(),
      label: newLabel,
      discountRate: newDiscount || "—",
      expiry: newExpiry || "—",
      isActive: true,
    }
    setCoupons((prev) => [...prev, newCoupon])
    setNewCode("")
    setNewLabel("")
    setNewDiscount("")
    setNewExpiry("")
  }

  function handleDelete(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* クーポン一覧 */}
      <div className="space-y-3">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`rounded-xl border px-5 py-4 transition-colors ${
              c.isActive ? "border-border bg-card" : "border-border/50 bg-muted/30"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Tag className={`size-4 mt-0.5 shrink-0 ${c.isActive ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-muted px-1.5 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-xs text-muted-foreground">割引率 {c.discountRate}</span>
                    <span className="text-xs text-muted-foreground">有効期限 {c.expiry}</span>
                  </div>
                  <p className={`text-sm mt-1 ${c.isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {c.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground hidden md:block">
                  {c.isActive ? "有効" : "無効"}
                </span>
                <Switch checked={c.isActive} onCheckedChange={() => toggleActive(c.id)} />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* 新規追加フォーム */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">新規クーポンを追加</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="code">クーポンコード</Label>
            <Input
              id="code"
              placeholder="例：SUMMER2026"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discount">割引率</Label>
            <Input
              id="discount"
              placeholder="例：20%"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clabel">クーポン説明</Label>
          <Input
            id="clabel"
            placeholder="例：夏季限定 アロマ 10,000円→8,000円"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expiry">有効期限</Label>
          <Input
            id="expiry"
            type="date"
            value={newExpiry}
            onChange={(e) => setNewExpiry(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={!newCode || !newLabel}
          className="w-full"
        >
          <Plus className="size-4 mr-1.5" />
          クーポンを追加
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">管理者</p>
            <p className="text-sm font-medium text-foreground">
              {session?.user?.name ?? "Admin"}
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-6">
          管理画面
        </h1>

        <Tabs defaultValue="reservations">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="reservations" className="flex items-center gap-1.5 text-xs md:text-sm">
              <ListOrdered className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">予約一覧</span>
              <span className="sm:hidden">予約</span>
            </TabsTrigger>
            <TabsTrigger value="blocks" className="flex items-center gap-1.5 text-xs md:text-sm">
              <Ban className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">ブロック設定</span>
              <span className="sm:hidden">ブロック</span>
            </TabsTrigger>
            <TabsTrigger value="menus" className="flex items-center gap-1.5 text-xs md:text-sm">
              <Sparkles className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">メニュー編集</span>
              <span className="sm:hidden">メニュー</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-1.5 text-xs md:text-sm">
              <Tag className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">クーポン管理</span>
              <span className="sm:hidden">クーポン</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <ReservationsTab />
          </TabsContent>
          <TabsContent value="blocks">
            <BlocksTab />
          </TabsContent>
          <TabsContent value="menus">
            <MenusTab />
          </TabsContent>
          <TabsContent value="coupons">
            <CouponsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
