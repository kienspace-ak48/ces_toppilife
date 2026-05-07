import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Gift } from "lucide-react";
import { ASSETS_BASE, rewriteRelativeUploadUrlsInHtml } from "./assetsBase";

type GiftPromoShape = {
  title?: string;
  subtitle?: string;
  image_url?: string;
  image_desc?: string;
  offer_label?: string;
  discount_text?: string;
  countdown_until?: string;
  cta_text?: string;
};

type Props = { data: Record<string, unknown> | null };

function resolveImgUrl(raw?: string): string | undefined {
  if (!raw || !String(raw).trim()) return undefined;
  const s = String(raw).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return ASSETS_BASE + s.replace(/^\//, "");
}

function getRemaining(target?: string) {
  const targetTime = target ? new Date(target).getTime() : NaN;
  const diff = Number.isFinite(targetTime) ? targetTime - Date.now() : 0;
  const total = Math.max(0, diff);

  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1_000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export const GiftPromoSection: React.FC<Props> = ({ data }) => {
  const promo = (data?.gift_promo || {}) as GiftPromoShape;
  const customize = (data?.customize || {}) as { zalo?: string };
  const imageSrc = resolveImgUrl(promo.image_url);
  const zalo = String(customize.zalo || "").trim();
  const zaloUrl = zalo ? `https://zalo.me/${zalo}` : "#";

  const hasContent =
    promo.title?.trim() ||
    promo.subtitle?.trim() ||
    promo.image_desc?.trim() ||
    imageSrc;

  const [remaining, setRemaining] = useState(() =>
    getRemaining(promo.countdown_until),
  );

  useEffect(() => {
    setRemaining(getRemaining(promo.countdown_until));
    const timer = window.setInterval(() => {
      setRemaining(getRemaining(promo.countdown_until));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [promo.countdown_until]);

  const timeItems = useMemo(
    () => [
      { label: "Ngày", value: pad(remaining.days) },
      { label: "Giờ", value: pad(remaining.hours) },
      { label: "Phút", value: pad(remaining.minutes) },
      { label: "Giây", value: pad(remaining.seconds) },
    ],
    [remaining],
  );

  if (!hasContent) return null;

  return (
    <section className="relative isolate overflow-hidden py-14 md:py-18 bg-[linear-gradient(145deg,#ecfdf5_0%,#fff7ed_42%,#ffe4e6_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose-300/35 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-200/60 backdrop-blur-sm">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-0">
            <div className="p-5 md:p-8 bg-gradient-to-b from-white to-emerald-50/25">
              <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-emerald-100/80 bg-[linear-gradient(180deg,#ffffff_0%,#ecfeff_55%,#d1fae5_100%)] shadow-inner flex items-center justify-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="ToppiLife gift"
                    className="h-full w-full object-contain p-4"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-2xl font-bold text-rose-500">
                    hình ảnh quà tặng
                  </div>
                )}
              </div>
              <div className="mt-3 flex min-h-[120px] items-center rounded-2xl border border-cyan-100/90 bg-gradient-to-br from-sky-50 to-cyan-50/80 p-5 text-center shadow-sm">
                <div
                  className="gift-promo-image-desc w-full text-start text-sm leading-relaxed text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: rewriteRelativeUploadUrlsInHtml(
                      promo.image_desc?.trim() || "<p>text mô tả</p>",
                    ),
                  }}
                />
              </div>
            </div>

            <div className="relative flex flex-col justify-center bg-gradient-to-br from-amber-50/40 via-white to-rose-50/50 p-6 md:p-10">
              <div
                className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-amber-200/25 blur-2xl"
                aria-hidden
              />

              <h2 className="relative text-2xl font-extrabold leading-tight text-slate-900 md:text-4xl md:leading-tight">
                {promo.title ||
                  "Hãy để ToppiLife mang lại cho bạn sự thư giãn, tập trung và hiệu suất vượt trội."}
              </h2>
              {promo.subtitle ? (
                <p className="relative mt-4 text-base italic leading-relaxed text-slate-600">
                  {promo.subtitle}
                </p>
              ) : null}

              <div className="relative mt-7 max-w-md">
                <div className="rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-[2px] shadow-lg shadow-orange-500/20">
                  <div className="flex items-center gap-4 rounded-[14px] bg-white px-5 py-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-md">
                      <Gift className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="gift-promo-richtext mb-1 text-xs font-medium text-slate-500"
                        dangerouslySetInnerHTML={{
                          __html: rewriteRelativeUploadUrlsInHtml(
                            promo.offer_label ||
                              "<p>Ưu đãi đặc biệt trong tháng này</p>",
                          ),
                        }}
                      />
                      <p className="mb-0 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-xl font-black tracking-tight text-transparent md:text-2xl">
                        {promo.discount_text || "GIẢM NGAY 10%"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-8">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-800/90">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                  Thời gian còn lại
                </p>
                <div className="grid max-w-md grid-cols-4 gap-2 sm:gap-3">
                  {timeItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-orange-200/80 bg-gradient-to-b from-slate-900 to-slate-800 p-2.5 text-center shadow-md shadow-slate-900/25 sm:p-3"
                    >
                      <div className="text-xl font-black tabular-nums text-amber-400 sm:text-2xl">
                        {item.value}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-4 text-center text-base font-extrabold uppercase tracking-wide text-white shadow-[0_12px_30px_-8px_rgba(5,150,105,0.55)] ring-2 ring-white/40 transition-all hover:-translate-y-0.5 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 hover:shadow-[0_16px_36px_-8px_rgba(5,150,105,0.6)] sm:text-lg"
              >
                {promo.cta_text || "ĐẶT HÀNG NHẬN QUÀ NGAY"}
                <ArrowRight className="h-5 w-5 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
