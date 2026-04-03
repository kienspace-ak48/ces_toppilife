import React from "react";
import YoutubeEmbed from "../utils/YoutubeEmbed.jsx";

const DEFAULT_TITLE =
  "CƠ CHẾ HOẠT ĐỘNG CỦA LIỆU PHÁP KÍCH THÍCH ĐIỆN SỌ NÃO";

type Props = { data: Record<string, unknown> | null };

export const MechanismSection: React.FC<Props> = ({ data }) => {
  const solution = data?.solution as
    | { video_url?: string; video_title?: string }
    | undefined;
  const videoUrl = solution?.video_url?.trim();
  if (!videoUrl) return null;

  const title = (solution?.video_title?.trim() || DEFAULT_TITLE) as string;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
            {title}
          </h2>
          <div className="mt-4 h-1 w-20 bg-green-500 rounded-full mx-auto" />
        </div>
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white p-4 md:p-6 lg:p-8">
          <YoutubeEmbed videoId={videoUrl} aspectClassName="aspect-video" />
        </div>
      </div>
    </section>
  );
};
