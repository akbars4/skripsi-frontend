// src/pages/forum/index.tsx
import { GetServerSideProps } from "next";
import GameGrid from "@/components/GameGrid";
import { fetchGamesPages } from "lib/api";
import { Game } from "@/interfaces/Game";

interface ForumProps {
  games: Game[];
  currentPage: number;
  perPage: number;
  nextPage: number | null;
  sortBy: string;
  sortDirection: string;
}

export const getServerSideProps: GetServerSideProps<ForumProps> = async (ctx) => {
  const page = parseInt((ctx.query.page as string) || "1", 10);
  const perPage = 30;
  const sortBy = "total_rating_count";
  const sortDirection = "desc";

  try {
    const data = await fetchGamesPages({ page, perPage, sortBy, sortDirection });
    return {
      props: {
        games: data.data,
        currentPage: data.current_page,
        nextPage: data.next_page,
        perPage: data.per_page,
        sortBy,
        sortDirection,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function ForumIndex({
  games,
  currentPage,
  nextPage,
  sortBy,
  sortDirection,
}: ForumProps) {
  return (
    <div className="min-h-screen bg-[#11161D] text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Explore Forum Discussion Games</h1>

      <GameGrid games={games} hrefPrefix="/forum" />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        {currentPage > 1 && (
          <a
            href={`/forum?page=${currentPage - 1}&sort_by=${sortBy}&sort_direction=${sortDirection}`}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            &lt; Prev
          </a>
        )}

        <span className="px-3 py-1 rounded bg-blue-600">{currentPage}</span>

        {nextPage && (
          <a
            href={`/forum?page=${nextPage}&sort_by=${sortBy}&sort_direction=${sortDirection}`}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Next &gt;
          </a>
        )}
      </div>
    </div>
  );
}
