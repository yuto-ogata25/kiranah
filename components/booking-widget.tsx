"use client"

import { useState, useEffect, useCallback } from "react"
import { ja } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  Tag,
  CalendarDays,
  CreditCard,
  Mail,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MENU_ITEMS = [
  {
    id: "headspa",
    name: "選べるセットコース",
    duration: "90分",
    price: "¥10,000",
    badge: "人気 No.1",
    badgeVariant: "default" as const,
    description:
      "ボディケア整体をメインに、その日の体調に合わせてお好きなコースを組み合わせできます。(フットバスサービス付)",
  },
  {
    id: "lymph",
    name: "選べるセットコース",
    duration: "120分",
    price: "¥13,000",
    badge: "おすすめ",
    badgeVariant: "secondary" as const,
    description:
      "ボディケア整体をメインに、その日の体調に合わせてお好きなコースを組み合わせできます。(フットバスサービス付)",
  },
  {
    id: "ayurveda",
    name: "選べるセットコース",
    duration: "180分",
    price: "¥20,000",
    badge: null,
    badgeVariant: "secondary" as const,
    description:
      "ボディケア整体をメインに、その日の体調に合わせてお好きなコースを組み合わせできます。(フットバスサービス付)",
  },
]

const TIME_SLOTS = [
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
]

const COUPONS = [
  {
    id: "first",
    label: "【全身リフレッシュ♪】新規限定 ボディケア整体 60分 6,600円→4,000円",
    description: "利用条件：ご新規様・他券併用不可",
  },
  {
    id: "line",
    label: "【贅沢アロマ体験】アロマオイルトリートメント 60分 10,000円→7,000円",
    description: "利用条件:女性限定メニュー・他券併用不可",
  },
  {
    id: "none",
    label: "クーポンを使用しない",
    description: "",
  },
]

const STEPS = [
  { label: "メニュー", icon: Sparkles },
  { label: "日時", icon: CalendarDays },
  { label: "クーポン", icon: Tag },
  { label: "確認", icon: CheckCircle2 },
] as const

/* ------------------------------------------------------------------ */
/*  Animated check-mark SVG                                            */
/* ------------------------------------------------------------------ */

function AnimatedCheck() {
  return (
    <div className="mx-auto flex size-24 md:size-20 items-center justify-center">
      <svg
        viewBox="0 0 80 80"
        className="size-24 md:size-20"
        aria-hidden="true"
      >
        {/* background circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="oklch(0.65 0.14 145)"
          strokeWidth="3"
          strokeDasharray="226"
          strokeDashoffset="226"
          className="animate-[circle-draw_0.6s_ease-out_forwards]"
        />
        {/* check mark */}
        <path
          d="M24 42 L34 52 L56 30"
          fill="none"
          stroke="oklch(0.65 0.14 145)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="50"
          strokeDashoffset="50"
          className="animate-[check-draw_0.4s_ease-out_0.5s_forwards]"
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Spinner / loading dots                                             */
/* ------------------------------------------------------------------ */

function LoadingDots() {
  return (
    <div className="flex flex-col items-center gap-5 py-8 md:py-6">
      <div className="flex items-center gap-3 md:gap-2">
        <span className="size-3.5 md:size-2.5 rounded-full bg-primary animate-[bounce_0.6s_ease-in-out_infinite]" />
        <span className="size-3.5 md:size-2.5 rounded-full bg-secondary animate-[bounce_0.6s_ease-in-out_0.15s_infinite]" />
        <span className="size-3.5 md:size-2.5 rounded-full bg-primary animate-[bounce_0.6s_ease-in-out_0.3s_infinite]" />
      </div>
      <p className="text-base md:text-sm text-muted-foreground animate-pulse">
        送信中...
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isActive = i === currentStep
          const isDone = i < currentStep
          return (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex size-11 md:size-10 items-center justify-center rounded-full transition-all duration-300 ${
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="size-5 md:size-4" />
                  ) : (
                    <Icon className="size-5 md:size-4" />
                  )}
                </div>
                <span
                  className={`text-xs md:text-[10px] font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : isDone
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 md:h-px flex-1 transition-colors duration-300 ${
                    isDone ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Booking Widget                                                */
/* ------------------------------------------------------------------ */

export function BookingWidget() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const menuData = MENU_ITEMS.find((m) => m.id === selectedMenu)
  const couponData = COUPONS.find((c) => c.id === selectedCoupon)

  const reset = useCallback(() => {
    setIsLoggedIn(false)
    setStep(0)
    setSelectedMenu(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setSelectedCoupon(null)
    setIsSending(false)
    setIsDone(false)
  }, [])

  function handleLogin() {
    setIsLoggedIn(true)
  }

  function handleConfirm() {
    setIsSending(true)
  }

  useEffect(() => {
    if (!isSending) return
    const timer = setTimeout(() => {
      setIsSending(false)
      setIsDone(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [isSending])

  /* ---- not logged in ---- */
  if (!isLoggedIn) {
    return (
      <div className="text-center px-4 md:px-0">
        <Button
          className="rounded-full h-14 md:h-12 px-8 text-base md:text-sm font-medium shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          onClick={handleLogin}
        >
          <svg
            className="mr-2 size-6 md:size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Googleでログインして予約する
        </Button>
        <p className="text-sm md:text-xs text-muted-foreground mt-4">
          ご予約にはGoogleアカウントが必要です
        </p>
      </div>
    )
  }

  /* ---- done ---- */
  if (isDone) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-6 shadow-sm text-center animate-[fade-in-up_0.5s_ease-out_forwards]">
          <AnimatedCheck />
          <h3 className="font-serif text-2xl md:text-xl font-bold text-card-foreground mt-6 mb-4">
            仮予約を受け付けました
          </h3>
          <div className="rounded-xl bg-accent/40 p-5 md:p-4 text-left mb-6">
            <div className="flex items-start gap-3">
              <Mail className="size-5 md:size-4 text-accent-foreground mt-0.5 shrink-0" />
              <p className="text-base md:text-sm text-accent-foreground leading-relaxed">
                現在、サロン側で空き状況を確認しております。予約が承認されましたら、ご登録のメールアドレスへ確定通知をお送りします。しばらくお待ちください。
              </p>
            </div>
          </div>
          <Separator className="mb-5" />
          <div className="text-sm md:text-xs text-muted-foreground leading-relaxed text-left flex flex-col gap-2">
            <p>
              <span className="font-medium text-foreground">メニュー：</span>
              {menuData?.name}
            </p>
            <p>
              <span className="font-medium text-foreground">日時：</span>
              {selectedDate?.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
              })}{" "}
              {selectedTime}~
            </p>
            {couponData && couponData.id !== "none" && (
              <p>
                <span className="font-medium text-foreground">クーポン：</span>
                {couponData.label}
              </p>
            )}
          </div>
          <p className="text-xs md:text-[11px] text-muted-foreground mt-5">
            ※ これはデモ予約です。実際の予約は確定されていません。
          </p>
          <Button
            variant="outline"
            className="mt-6 rounded-full h-12 md:h-10 px-6 text-base md:text-sm"
            onClick={reset}
          >
            <LogOut className="size-5 md:size-4" />
            ログアウト
          </Button>
        </div>
      </div>
    )
  }

  /* ---- sending ---- */
  if (isSending) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-8 shadow-sm">
          <LoadingDots />
        </div>
      </div>
    )
  }

  /* ---- multi-step form ---- */
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-5 shadow-sm">
        {/* user header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 md:size-8 items-center justify-center rounded-full bg-primary/15 text-primary text-sm md:text-xs font-bold">
              G
            </div>
            <div>
              <p className="text-sm md:text-xs font-medium text-card-foreground">
                ゲストユーザー
              </p>
              <p className="text-xs md:text-[10px] text-muted-foreground">
                guest@example.com
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm md:text-xs text-muted-foreground h-10 md:h-7 px-3 md:px-2"
            onClick={reset}
          >
            <LogOut className="size-4 md:size-3" />
            ログアウト
          </Button>
        </div>

        <Separator className="mb-6" />

        {/* progress bar */}
        <ProgressBar currentStep={step} />

        {/* --- Step 0 : Menu Selection --- */}
        {step === 0 && (
          <div className="animate-[fade-in-up_0.3s_ease-out_forwards]">
            <p className="text-base md:text-sm font-medium text-card-foreground mb-5 md:mb-4">
              施術メニューを選択してください
            </p>
            <div className="flex flex-col gap-4 md:gap-3">
              {MENU_ITEMS.map((item) => {
                const isSelected = selectedMenu === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMenu(item.id)}
                    className={`w-full rounded-xl border p-5 md:p-4 text-left transition-all duration-200 min-h-30 active:scale-[0.98] ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-base md:text-sm font-bold text-card-foreground leading-snug">
                        {item.name}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className="shrink-0 text-xs md:text-[10px] py-1"
                        >
                          <Sparkles className="size-3.5 md:size-3" />
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm md:text-xs text-muted-foreground leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm md:text-xs text-muted-foreground">
                        <Clock className="size-4 md:size-3" />
                        {item.duration}
                      </span>
                      <span className="text-lg md:text-base font-bold text-foreground">
                        {item.price}
                        <span className="text-xs md:text-[10px] font-normal text-muted-foreground ml-0.5">
                          (税込)
                        </span>
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <Button
              className="mt-6 w-full rounded-full h-14 md:h-12 text-base md:text-sm font-medium"
              disabled={!selectedMenu}
              onClick={() => setStep(1)}
            >
              次へ : 日時を選ぶ
              <ChevronRight className="size-5 md:size-4" />
            </Button>
          </div>
        )}

        {/* --- Step 1 : Date & Time --- */}
        {step === 1 && (
          <div className="animate-[fade-in-up_0.3s_ease-out_forwards]">
            <p className="text-base md:text-sm font-medium text-card-foreground mb-5 md:mb-4">
              ご希望の日時を選択してください
            </p>
            <div className="flex justify-center [--cell-size:--spacing(11)] md:[--cell-size:--spacing(9)]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setSelectedTime(null)
                }}
                locale={ja}
                disabled={{ before: today }}
                className="rounded-xl"
              />
            </div>

            {selectedDate && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="text-sm md:text-xs text-muted-foreground mb-4 text-center">
                  {selectedDate.toLocaleDateString("ja-JP", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                  の空き枠（90分）
                </p>
                <div className="grid grid-cols-3 gap-3 md:gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`rounded-xl h-12 md:h-10 text-base md:text-sm font-medium transition-all active:scale-[0.96] ${
                        selectedTime === time
                          ? "shadow-md scale-[1.02]"
                          : "hover:border-primary/50 hover:text-primary"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 rounded-full h-14 md:h-12 text-base md:text-sm"
                onClick={() => setStep(0)}
              >
                <ChevronLeft className="size-5 md:size-4" />
                戻る
              </Button>
              <Button
                className="flex-1 rounded-full h-14 md:h-12 text-base md:text-sm font-medium"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
              >
                次へ : クーポン
                <ChevronRight className="size-5 md:size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* --- Step 2 : Coupon --- */}
        {step === 2 && (
          <div className="animate-[fade-in-up_0.3s_ease-out_forwards]">
            <p className="text-base md:text-sm font-medium text-card-foreground mb-5 md:mb-4">
              クーポンを選択してください
            </p>
            <div className="flex flex-col gap-4 md:gap-3">
              {COUPONS.map((coupon) => {
                const isSelected = selectedCoupon === coupon.id
                return (
                  <button
                    key={coupon.id}
                    type="button"
                    onClick={() => setSelectedCoupon(coupon.id)}
                    className={`w-full rounded-xl border p-5 md:p-4 text-left transition-all duration-200 min-h-15 active:scale-[0.98] ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {coupon.id !== "none" && (
                        <Tag className="size-5 md:size-4 text-primary shrink-0" />
                      )}
                      <span className="text-base md:text-sm font-medium text-card-foreground">
                        {coupon.label}
                      </span>
                    </div>
                    {coupon.description && (
                      <p className="text-sm md:text-xs text-muted-foreground mt-2 ml-8 md:ml-7">
                        {coupon.description}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 rounded-full h-14 md:h-12 text-base md:text-sm"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="size-5 md:size-4" />
                戻る
              </Button>
              <Button
                className="flex-1 rounded-full h-14 md:h-12 text-base md:text-sm font-medium"
                disabled={!selectedCoupon}
                onClick={() => setStep(3)}
              >
                次へ : 最終確認
                <ChevronRight className="size-5 md:size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* --- Step 3 : Confirmation --- */}
        {step === 3 && (
          <div className="animate-[fade-in-up_0.3s_ease-out_forwards]">
            <p className="text-base md:text-sm font-medium text-card-foreground mb-5 md:mb-4">
              ご予約内容の確認
            </p>
            <div className="rounded-xl bg-muted/60 p-5 md:p-4 flex flex-col gap-4 md:gap-3 text-base md:text-sm">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">メニュー</span>
                <span className="font-medium text-card-foreground text-right max-w-[60%]">
                  {menuData?.name}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">施術時間</span>
                <span className="font-medium text-card-foreground">
                  {menuData?.duration}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">料金</span>
                <span className="font-bold text-foreground text-lg md:text-base">
                  {menuData?.price}
                  <span className="text-sm md:text-xs font-normal text-muted-foreground ml-0.5">
                    (税込)
                  </span>
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">日時</span>
                <span className="font-medium text-card-foreground">
                  {selectedDate?.toLocaleDateString("ja-JP", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}{" "}
                  {selectedTime}~
                </span>
              </div>
              {couponData && couponData.id !== "none" && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">クーポン</span>
                    <span className="font-medium text-primary">
                      {couponData.label}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* payment notice */}
            <div className="mt-5 rounded-xl bg-accent/40 p-4 md:p-3 flex items-start gap-3">
              <CreditCard className="size-5 md:size-4 text-accent-foreground mt-0.5 shrink-0" />
              <p className="text-sm md:text-xs text-accent-foreground leading-relaxed">
                お支払いは現地にて現金払いのみとなります
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 rounded-full h-14 md:h-12 text-base md:text-sm"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="size-5 md:size-4" />
                戻る
              </Button>
              <Button
                className="flex-1 rounded-full h-14 md:h-12 text-base md:text-sm font-medium shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                onClick={handleConfirm}
              >
                仮予約を確定する
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
