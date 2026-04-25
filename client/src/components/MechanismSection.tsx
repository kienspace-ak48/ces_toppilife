import React from "react";
import YoutubeEmbed from "../utils/YoutubeEmbed.jsx";

const DEFAULT_TITLE =
  "CƠ CHẾ HOẠT ĐỘNG CỦA LIỆU PHÁP KÍCH THÍCH ĐIỆN SỌ NÃO";

type DebunkBox = {
  title?: string;
  content?: string;
};

const DEFAULT_DEBUNK_BOXES: DebunkBox[] = [
  {
    title: "Sự thật lầm tưởng",
    content:
      "<p><strong>Không phải là sốc điện!</strong></p><p>Nhiều người e ngại dòng điện sẽ gây giật, đau đớn hoặc tổn thương thần kinh.</p>",
  },
  {
    title: "Sự thật khoa học",
    content:
      '<p>Máy CES sử dụng dòng điện siêu vi mô ở mức dưới <strong>1mA</strong>, chưa tới một phần nghìn Ampere. Dòng điện này rất nhỏ, gần với tín hiệu điện sinh học tự nhiên trong cơ thể, giúp hỗ trợ cân bằng hoạt động thần kinh một cách êm ái và không gây giật cục bộ.</p>',
  },
];

type Props = { data: Record<string, unknown> | null };

export const MechanismSection: React.FC<Props> = ({ data }) => {
  const solution = data?.solution as
    | {
        video_url?: string;
        video_title?: string;
        debunk_title?: string;
        debunk_boxes?: DebunkBox[];
      }
    | undefined;
  const videoUrl = solution?.video_url?.trim();
  if (!videoUrl) return null;

  const title = (solution?.video_title?.trim() || DEFAULT_TITLE) as string;
  const debunkTitle =
    solution?.debunk_title?.trim() || "Điện lên não có đáng sợ không?";
  const debunkBoxes =
    Array.isArray(solution?.debunk_boxes) && solution.debunk_boxes.length
      ? solution.debunk_boxes
      : DEFAULT_DEBUNK_BOXES;

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

        <div className="max-w-6xl mx-auto mt-12 md:mt-16">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {debunkTitle}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {debunkBoxes.map((box, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8 text-center"
              >
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {box.title}
                </h4>
                <div
                  className="text-left text-gray-600 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_strong]:text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: box.content || "",
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
