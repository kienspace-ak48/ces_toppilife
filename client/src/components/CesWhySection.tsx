import React from "react";
import { CircleCheckBig } from "lucide-react";
import { ASSETS_BASE } from "./assetsBase";

type CesWhyShape = {
  title?: string;
  bullets?: string[];
  img_url?: string;
};

const DEFAULT_BULLETS = [
  "Không cần thay đổi thói quen quá nhiều → chỉ cần dùng 15–30 phút mỗi ngày",
  "Có thể sử dụng ngay tại nhà, chủ động thời gian",
  "Phù hợp cho người khó thư giãn trước khi ngủ",
  "Cảm giác sử dụng nhẹ, dễ chịu, không gây khó chịu",
  "Có thể kết hợp cùng các phương pháp thư giãn khác",
];

type Props = { data: Record<string, unknown> | null };

function resolveImgUrl(raw?: string): string | undefined {
  if (!raw || !String(raw).trim()) return undefined;
  const s = String(raw).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return ASSETS_BASE + s.replace(/^\//, "");
}

export const CesWhySection: React.FC<Props> = ({ data }) => {
  const c = (data?.ces_why || {}) as CesWhyShape;
  const title =
    (c.title?.trim() ||
      "Vì sao nhiều người chọn sử dụng máy kích thích điện sọ não (CES)?") as string;
  const bullets =
    Array.isArray(c.bullets) && c.bullets.length ? c.bullets : DEFAULT_BULLETS;
  const imageSrc = resolveImgUrl(c.img_url);

  const listBlock = (
    <div className="space-y-4">
      {bullets.map((text, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-200 transition-all"
        >
          <CircleCheckBig className="text-green-600 shrink-0" />
          <p className="font-medium text-gray-700">{text}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {imageSrc ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 lg:items-start">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight row-start-1 lg:col-start-2 lg:row-start-1">
              {title}
            </h2>
            <div className="row-start-2 w-full lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-center">
              <img
                src={imageSrc}
                alt=""
                className="w-full rounded-3xl shadow-2xl object-cover"
              />
            </div>
            <div className="row-start-3 lg:col-start-2 lg:row-start-2 w-full">
              {listBlock}
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {title}
              </h2>
            </div>
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
              {listBlock}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
