import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  accent = "amber",
}) {
  if (totalPages <= 1) return null;

  const isEmerald = accent === "emerald";

  const activeBtn = isEmerald
    ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
    : "bg-amber-800 text-white border-amber-800 shadow-xs";

  const idleBtn = isEmerald
    ? "bg-white text-stone-700 border-emerald-200 hover:bg-emerald-50"
    : "bg-white text-stone-700 border-amber-200 hover:bg-amber-50";

  const handleSelect = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }
    onPageChange(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-7 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs font-medium text-stone-500">
        Halaman <span className="font-bold text-stone-800">{currentPage}</span>{" "}
        dari <span className="font-bold text-stone-800">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleSelect(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${idleBtn}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => handleSelect(pageNum)}
              className={`h-9 min-w-9 cursor-pointer rounded-xl border px-2.5 text-xs font-bold transition ${
                pageNum === currentPage ? activeBtn : idleBtn
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSelect(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${idleBtn}`}
        >
          <span>Berikutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}