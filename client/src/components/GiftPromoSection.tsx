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
    <section className="py-14 md:py-18 bg-gradient-to-br from-white via-green-50/70 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-3xl bg-white/80 shadow-xl border border-green-100 overflow-hidden">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-0">
            <div className="p-5 md:p-8 bg-white">
              <div className="relative rounded-2xl bg-gradient-to-b from-white to-cyan-50/60 min-h-[260px] flex items-center justify-center overflow-hidden">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="ToppiLife gift"
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-red-500 text-2xl font-bold">
                    hình ảnh quà tặng
                  </div>
                )}
              </div>
              <div className="mt-3 rounded-2xl bg-cyan-50/60 p-5 min-h-[120px] flex items-center justify-center text-center">
                <div
                  className="gift-promo-image-desc text-gray-600 leading-relaxed w-full text-sm text-start"
                  dangerouslySetInnerHTML={{
                    __html: rewriteRelativeUploadUrlsInHtml(
                      promo.image_desc?.trim() || "<p>text mô tả</p>",
                    ),
                  }}
                />
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col justify-center">
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {promo.title ||
                  "Hãy để ToppiLife mang lại cho bạn sự thư giãn, tập trung và hiệu suất vượt trội."}
              </h2>
              {promo.subtitle ? (
                <p className="mt-4 italic text-gray-600 leading-relaxed">
                  {promo.subtitle}
                </p>
              ) : null}

              <div className="mt-7 max-w-md rounded-full bg-white shadow-lg border border-gray-100 px-5 py-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                  <Gift className="w-7 h-7" />
                </div>
                <div>
                  <div
                    className="gift-promo-richtext text-xs text-gray-500 mb-1"
                    dangerouslySetInnerHTML={{
                      __html: rewriteRelativeUploadUrlsInHtml(
                        promo.offer_label ||
                          "<p>Ưu đãi đặc biệt trong tháng này</p>",
                      ),
                    }}
                  />
                  <p className="text-red-500 font-extrabold text-lg mb-0">
                    {promo.discount_text || "GIẢM NGAY 10%"}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-500 italic mb-4">
                  Thời gian còn lại
                </p>
                <div className="grid grid-cols-4 gap-3 max-w-md">
                  {timeItems.map((item) => (
                    <div
                      key={item.label}
                      className="bg-white rounded-xl shadow-md border border-gray-100 p-3 text-center"
                    >
                      <div className="text-2xl font-extrabold text-red-500">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 font-extrabold shadow-xl transition-all hover:-translate-y-0.5"
              >
                {promo.cta_text || "ĐẶT HÀNG NHẬN QUÀ NGAY"}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
