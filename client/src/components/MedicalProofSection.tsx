import React from "react";
import { Award } from "lucide-react";
import { ASSETS_BASE, rewriteRelativeUploadUrlsInHtml } from "./assetsBase";

type MedicalProofBox = {
  title?: string;
  content?: string;
};

type MedicalProofShape = {
  title?: string;
  img_url?: string;
  boxes?: MedicalProofBox[];
};

type Props = { data: Record<string, unknown> | null };

const DEFAULT_BOXES: MedicalProofBox[] = [
  {
    title: "Lịch sử chứng minh",
    content:
      "Liệu pháp CES đã được FDA công nhận và ứng dụng trong chăm sóc sức khỏe tinh thần.",
  },
  {
    title: "Không gây nghiện",
    content:
      "Không có sử dụng hóa học hay thuốc, chỉ hỗ trợ bằng xung điện nhẹ có kiểm soát.",
  },
  {
    title: "Bền bỉ & An toàn",
    content:
      "Thiết bị đạt chuẩn an toàn, phù hợp sử dụng tại nhà theo hướng dẫn.",
  },
];

function resolveImgUrl(raw?: string): string | undefined {
  if (!raw || !String(raw).trim()) return undefined;
  const s = String(raw).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return ASSETS_BASE + s.replace(/^\//, "");
}

export const MedicalProofSection: React.FC<Props> = ({ data }) => {
  const proof = (data?.medical_proof || {}) as MedicalProofShape;
  const title =
    proof.title?.trim() || "An tâm tuyệt đối: Bảo chứng từ khoa học y khoa";
  const imageSrc = resolveImgUrl(proof.img_url);
  const boxes =
    Array.isArray(proof.boxes) && proof.boxes.length
      ? proof.boxes
      : DEFAULT_BOXES;

  if (!title && !imageSrc && boxes.length === 0) return null;

  return (
    <section className="py-14 md:py-18 bg-gradient-to-br from-indigo-100 via-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-3xl bg-white/45 backdrop-blur-sm border border-white/70 shadow-xl p-6 md:p-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-950">
              {title}
            </h2>
          </div>

          {imageSrc && (
            <div className="-mx-6 md:-mx-10 mb-8 md:mb-10">
              <img
                src={imageSrc}
                alt=""
                className="w-full h-auto max-h-[min(28rem,70vh)] object-contain object-center bg-white/60 border-y border-gray-100/90"
              />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {boxes.map((box, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/80 border border-white shadow-sm p-5 md:p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-gray-950 mb-3">
                  {box.title}
                </h3>
                <div
                  className="medical-proof-richtext text-sm leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: rewriteRelativeUploadUrlsInHtml(box.content || ""),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
