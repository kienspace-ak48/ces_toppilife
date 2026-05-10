import React from "react";
import YoutubeEmbed from "../utils/YoutubeEmbed.jsx";
import { rewriteRelativeUploadUrlsInHtml } from "./assetsBase";

type DebunkBox = {
  title?: string;
  content?: string;
};

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

  const title = (solution?.video_title ?? "").trim();
  const debunkTitle = (solution?.debunk_title ?? "").trim();
  const debunkBoxes = Array.isArray(solution?.debunk_boxes)
    ? solution.debunk_boxes
    : [];

  const showDebunkBlock = Boolean(debunkTitle) || debunkBoxes.length > 0;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {title ? (
          <div className="w-full text-center mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
              {title}
            </h2>
            <div className="mt-4 h-1 w-20 bg-green-500 rounded-full mx-auto" />
          </div>
        ) : null}
        <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white p-4 md:p-6 lg:p-8">
          <YoutubeEmbed videoId={videoUrl} aspectClassName="aspect-video" />
        </div>

        {showDebunkBlock ? (
          <div className="w-full mt-12 md:mt-16">
            {debunkTitle ? (
              <div className="text-center w-full mb-8 md:mb-10 px-2">
                <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {debunkTitle}
                </h3>
              </div>
            ) : null}

            {debunkBoxes.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {debunkBoxes.map((box, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-slate-200/80 bg-slate-50 shadow-lg p-6 md:p-8 text-center"
                  >
                    {(box.title ?? "").trim() ? (
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                        {box.title}
                      </h4>
                    ) : null}
                    <div
                      className="mechanism-debunk-richtext text-left text-gray-600 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_strong]:text-gray-800 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto [&_img]:block"
                      dangerouslySetInnerHTML={{
                        __html: rewriteRelativeUploadUrlsInHtml(
                          box.content ?? "",
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};
