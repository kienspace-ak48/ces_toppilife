import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import YoutubeEmbed from "../utils/YoutubeEmbed.jsx";
import { ASSETS_BASE } from "./assetsBase";
import { LOGO_URL } from "../constants";

export type FeedbackItem = {
  video_url?: string;
  thumbnail?: string;
  headline?: string;
  badge?: string;
  caption?: string;
  brand_label?: string;
};

type FeedbackShape = {
  title?: string;
  subtitle?: string;
  video_urls?: string[];
  items?: FeedbackItem[];
};

type Props = { data: Record<string, unknown> | null };

function resolveThumbUrl(t?: string): string | undefined {
  if (!t || !String(t).trim()) return undefined;
  const s = String(t).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return ASSETS_BASE + s.replace(/^\//, "");
}

function normalizeItems(feedback: FeedbackShape): FeedbackItem[] {
  const raw = feedback.items;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((x) => ({
      video_url: x?.video_url,
      thumbnail: x?.thumbnail,
      headline: x?.headline,
      badge: x?.badge,
      caption: x?.caption,
      brand_label: x?.brand_label,
    }));
  }
  const urls = Array.isArray(feedback.video_urls)
    ? feedback.video_urls.filter(Boolean)
    : [];
  return urls.map((video_url) => ({ video_url }));
}

function ShortVideoCard({ item }: { item: FeedbackItem }) {
  const thumb = resolveThumbUrl(item.thumbnail);
  const videoId = item.video_url || "";

  return (
    <div className="relative w-[min(260px,78vw)] sm:w-[min(280px,32vw)] lg:w-[min(300px,22vw)] max-w-[300px] rounded-2xl overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10 bg-black">
      <div className="relative">
        <YoutubeEmbed
          videoId={videoId}
          thumbnail={thumb}
          aspectClassName="aspect-[9/16]"
        />
        {/* Shorts-style overlays — pointer-events-none để click vào nút play của YoutubeEmbed */}
        <div className="absolute inset-0 pointer-events-none flex flex-col z-[5]">
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-sm pl-1 pr-3 py-1 shadow-md">
              <img
                src={LOGO_URL}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/40"
              />
              <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight">
                {item.brand_label?.trim() || "ToppiCare"}
              </span>
            </div>
          </div>

          {item.headline?.trim() ? (
            <div className="absolute top-14 left-2 right-2 px-1 text-center">
              <p className="text-[11px] sm:text-xs font-bold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {item.headline}
              </p>
            </div>
          ) : null}

          {item.badge?.trim() ? (
            <div className="absolute top-[4.25rem] left-2 right-2 flex justify-center px-1">
              <span className="bg-white text-gray-900 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg shadow-lg max-w-full text-center leading-snug">
                {item.badge}
              </span>
            </div>
          ) : null}

          {item.caption?.trim() ? (
            <div className="absolute bottom-12 left-2 right-2 text-center px-1">
              <p className="text-[10px] sm:text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] leading-snug">
                {item.caption}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const FeedbackVideoCarousel: React.FC<Props> = ({ data }) => {
  const feedback = (data?.feedback || {}) as FeedbackShape;

  const title =
    feedback.title?.trim() || "Phản hồi của khách hàng";
  const subtitle = feedback.subtitle?.trim() || "";

  const items = normalizeItems(feedback);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(220, Math.floor(el.clientWidth * 0.35));
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (items.length === 0) {
    return (
      <section className="py-14 md:py-18 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          ) : null}
          <p className="mt-8 text-gray-400 text-sm">
            Chưa có video. Thêm <code className="text-xs bg-gray-100 px-1 rounded">feedback.items</code> hoặc URL trong CMS / API.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 tracking-tight">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm md:text-base text-gray-500">{subtitle}</p>
          ) : null}
        </div>

        <div className="relative w-full max-w-[1600px] mx-auto">
          <button
            type="button"
            aria-label="Cuộn trái"
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 top-[42%] -translate-y-1/2 z-20 h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-transform pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            type="button"
            aria-label="Cuộn phải"
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 top-[42%] -translate-y-1/2 z-20 h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 text-gray-600 hover:bg-gray-50 hover:scale-105 transition-transform pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Căn giữa nhóm thẻ khi ít video; khi nhiều video → cuộn ngang trong vùng overflow */}
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x scroll-smooth scroll-px-2 sm:scroll-px-12 pb-3 pt-1 pl-2 pr-2 sm:pl-12 sm:pr-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* safe center: ít video → căn giữa; nhiều video (overflow) → căn start để scrollLeft=0 thấy full thẻ đầu (tránh cắt trái do justify-center) */}
            <div className="flex min-w-full justify-[safe_center]">
              <div className="flex w-max gap-3 sm:gap-4 md:gap-5 snap-x snap-mandatory py-1">
                {items.map((item, idx) => (
                  <div key={idx} className="snap-start shrink-0">
                    <ShortVideoCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
