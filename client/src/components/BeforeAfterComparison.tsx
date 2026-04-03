import React from "react";

type ComparisonShape = {
  title?: string;
  before_label?: string;
  after_label?: string;
  before?: string[];
  after?: string[];
};

const DEFAULT_BEFORE = [
  "Khó ngủ, trằn trọc",
  "Đầu óc căng thẳng",
  "Suy nghĩ liên tục",
  "Mệt mỏi sau khi thức dậy",
];

const DEFAULT_AFTER = [
  "Dễ thư giãn hơn trước khi ngủ",
  "Đầu óc nhẹ, dễ chịu hơn",
  "Giấc ngủ ổn định hơn",
  "Cơ thể thả lỏng hơn",
];

type Props = { data: Record<string, unknown> | null };

export const BeforeAfterComparison: React.FC<Props> = ({ data }) => {
  const c = (data?.comparison || {}) as ComparisonShape;
  const title = (c.title?.trim() || "SO SÁNH HIỆU QUẢ") as string;
  const beforeLabel = (c.before_label?.trim() || "TRƯỚC KHI DÙNG") as string;
  const afterLabel = (c.after_label?.trim() || "SAU KHI DÙNG") as string;
  const beforeList =
    Array.isArray(c.before) && c.before.length ? c.before : DEFAULT_BEFORE;
  const afterList =
    Array.isArray(c.after) && c.after.length ? c.after : DEFAULT_AFTER;

  return (
    <section className="py-14 md:py-16 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide mb-10 md:mb-12">
          {title}
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 shadow-lg">
            <h3 className="text-red-400 font-bold text-sm md:text-base mb-6 tracking-wide">
              {beforeLabel}
            </h3>
            <ul className="space-y-4 text-slate-200 text-sm md:text-base leading-relaxed">
              {beforeList.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/40 p-6 md:p-8 shadow-lg">
            <h3 className="text-emerald-400 font-bold text-sm md:text-base mb-6 tracking-wide">
              {afterLabel}
            </h3>
            <ul className="space-y-4 text-slate-200 text-sm md:text-base leading-relaxed">
              {afterList.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-emerald-400 font-bold mt-1">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
