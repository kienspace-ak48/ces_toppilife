import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { rewriteRelativeUploadUrlsInHtml } from "./assetsBase";

type SafetyBox = {
  title?: string;
  content?: string;
};

type SafetyNoticeShape = {
  title?: string;
  boxes?: SafetyBox[];
};

type Props = { data: Record<string, unknown> | null };

const DEFAULT_BOXES: SafetyBox[] = [
  {
    title: "TUYỆT ĐỐI KHÔNG SỬ DỤNG CHO",
    content:
      "<ul><li>Người mang máy tạo nhịp tim (Pacemaker) hoặc các thiết bị điện tử cấy ghép.</li><li>Phụ nữ mang thai.</li><li>Người có dị vật kim loại cấy ghép quanh vùng đầu.</li></ul>",
  },
  {
    title: "Lưu ý khi vận hành",
    content:
      "<ul><li>Không dùng cùng lúc với thiết bị phát tần số toàn thân.</li><li>Không đặt thiết bị lên vết thương hở.</li><li>Không dùng máy khi đang sạc pin.</li></ul>",
  },
];

export const SafetyNoticeSection: React.FC<Props> = ({ data }) => {
  const safety = (data?.safety_notice || {}) as SafetyNoticeShape;
  const title =
    safety.title?.trim() || "Lưu ý An toàn & Chống chỉ định (Quan trọng)";
  const boxes =
    Array.isArray(safety.boxes) && safety.boxes.length
      ? safety.boxes
      : DEFAULT_BOXES;

  if (!title && boxes.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10">
            {title}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {boxes.map((box, idx) => {
              const isPrimary = true
              //  idx === 0;

              return (
                <div
                  key={idx}
                  className={
                    isPrimary
                      ? "rounded-2xl border-2 border-orange-400 bg-slate-900/80 p-6 md:p-8 shadow-xl"
                      : "rounded-2xl border-2 border-orange-300 bg-white text-gray-800 p-6 md:p-8 shadow-xl"
                  }
                >
                  <div
                    className={
                      isPrimary
                        ? "mb-6 rounded-lg bg-white text-slate-900 px-4 py-3 text-center font-extrabold"
                        : "mb-6 rounded-lg bg-slate-50 text-slate-900 px-4 py-3 text-center font-extrabold"
                    }
                  >
                    {box.title}
                  </div>

                  <div className="flex gap-4">
                    <div
                      className={
                        isPrimary
                          ? "hidden sm:flex shrink-0 h-12 w-12 items-center justify-center rounded-xl text-orange-300"
                          : "hidden sm:flex shrink-0 h-12 w-12 items-center justify-center rounded-xl text-orange-500 bg-orange-50"
                      }
                    >
                      {isPrimary ? (
                        <ShieldAlert className="h-8 w-8" />
                      ) : (
                        <AlertTriangle className="h-8 w-8" />
                      )}
                    </div>
                    <div
                      className={
                        isPrimary
                          ? "safety-richtext text-slate-100"
                          : "safety-richtext text-gray-700"
                      }
                      dangerouslySetInnerHTML={{
                        __html: rewriteRelativeUploadUrlsInHtml(
                          box.content || "",
                        ),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
