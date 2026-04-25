import React from "react";

type ComparisonShape = {
  title?: string;
  before_label?: string;
  after_label?: string;
  before?: string[];
  after?: string[];
  table_columns?: string[];
  table_rows?: Array<{
    label?: string;
    cells?: string[];
  }>;
};

const DEFAULT_COLUMNS = ["Thuốc Ngủ", "Thiền/Yoga", "Massage", "Liệu Pháp CES"];

const DEFAULT_ROWS = [
  {
    label: "Tốc độ hiệu quả",
    cells: ["Nhanh", "Chậm", "Nhanh/Tạm thời", "Nhanh"],
  },
  {
    label: "Nỗ lực người dùng",
    cells: [
      "Không cần",
      "Đòi hỏi sự kiên nhẫn/Tập luyện",
      "Phải đi lại/Chi phí cao",
      "Thư giãn hoàn toàn tại nhà",
    ],
  },
  {
    label: "Tác dụng phụ/Lệ thuộc",
    cells: [
      "⚠️ Cao - Lờn thuốc, mệt mỏi",
      "Không",
      "Không",
      "✅ Không phụ thuộc, 0 tác dụng phụ nguy hiểm",
    ],
  },
  {
    label: "Cơ chế tác động",
    cells: ["Ép buộc hóa học", "Tâm trí", "Ngoài da/Cơ bắp", "Tận gốc hệ thần kinh & não học não"],
  },
];

type Props = { data: Record<string, unknown> | null };

export const BeforeAfterComparison: React.FC<Props> = ({ data }) => {
  const c = (data?.comparison || {}) as ComparisonShape;
  const title =
    (c.title?.trim() ||
      "Vì sao CES khác biệt hoàn toàn với các giải pháp khác?") as string;
  const columns =
    Array.isArray(c.table_columns) && c.table_columns.length
      ? DEFAULT_COLUMNS.map((fallback, idx) => c.table_columns?.[idx] || fallback)
      : DEFAULT_COLUMNS;
  const rows =
    Array.isArray(c.table_rows) && c.table_rows.length
      ? c.table_rows
      : DEFAULT_ROWS;

  return (
    <section className="py-14 md:py-18 bg-gradient-to-br from-orange-100 via-white to-indigo-200">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 mb-8 md:mb-10">
          {title}
        </h2>
        <div className="max-w-6xl mx-auto overflow-x-auto rounded-2xl shadow-2xl border border-white/80 bg-white/90">
          <table className="w-full min-w-[760px] border-collapse text-center text-sm md:text-base">
            <thead>
              <tr>
                <th className="w-[18%] bg-white border border-gray-200 px-4 py-4" />
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={
                      idx === columns.length - 1
                        ? "bg-violet-100 border border-gray-200 px-4 py-4 font-extrabold text-violet-900"
                        : "bg-white border border-gray-200 px-4 py-4 font-extrabold text-gray-900"
                    }
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <th className="bg-white border border-gray-200 px-4 py-4 font-bold text-gray-900 text-left">
                    {row.label}
                  </th>
                  {columns.map((_, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={
                        cellIdx === columns.length - 1
                          ? "bg-violet-50 border border-gray-200 px-4 py-4 font-semibold text-violet-900"
                          : "bg-white border border-gray-200 px-4 py-4 text-gray-800"
                      }
                    >
                      {row.cells?.[cellIdx] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
