// src/pages/forum/[slug]/index.tsx
import { GetServerSideProps } from "next";
import Navbar from "@/components/Navbar";
import GameGrid from "@/components/GameGrid";
import { fetchGamesPages } from "lib/api";
import { Game } from "@/interfaces/Game";

interface ForumProps {
  games: Game[];
  currentPage: number;
  perPage: number;
  nextPage: number | null;
}

export const getServerSideProps: GetServerSideProps<ForumProps> = async (ctx) => {
  const page = parseInt((ctx.query.page as string) || "1", 10);
  const perPage = 30;
  const sortBy = "total_rating_count";
  const sortDirection = "desc";

  const data = await fetchGamesPages({ page, perPage, sortBy, sortDirection });
  return {
    props: {
      games: data.data,            // ← this is your Game[] array
      currentPage: data.current_page,
      nextPage: data.next_page,
      perPage: data.per_page,
    },
  };
};

export default function ForumIndex({
  games,
  currentPage,
  nextPage,
}: ForumProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#11161D] text-white px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">
          Explore Forum Discussion Games
        </h1>

        {/* ← pass the actual `games` variable, not the Game type */}
        <GameGrid games={games} hrefPrefix="/forum" />

        <div className="flex justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <a
              href={`/forum?page=${currentPage - 1}`}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              &lt; Prev
            </a>
          )}
          <span className="px-3 py-1 bg-blue-600 rounded">{currentPage}</span>
          {nextPage && (
            <a
              href={`/forum?page=${nextPage}`}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              Next &gt;
            </a>
          )}
        </div>
      </main>
    </>
  );
}
