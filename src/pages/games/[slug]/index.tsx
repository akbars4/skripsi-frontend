// src/pages/games/[slug]/index.tsx
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AddToGameListButton from "@/components/AddToGameListButton";
import AddToFavoritesButton from "@/components/AddToFavouritesButton";
import AddToWantToPlayButton from "@/components/AddToWantToPlayButton";
import AddReviewModal from "@/components/AddReviewModal";
import { getGameBySlug } from "lib/api";

interface Game {
  id: number;               // <-- local game_id from DB
  igdb_id: number;
  slug: string;
  name: string;
  summary: string;
  cover_url: string;
  cover: string;
  genres: string[];
  platforms: string[];
  release_date: string;
  developer: string;
}

interface DetailProps {
  game: Game;
}

export const getServerSideProps: GetServerSideProps<DetailProps> = async (
  ctx
) => {
  const { slug } = ctx.params!;
  try {
    const game = await getGameBySlug(slug as string);
    return { props: { game } };
  } catch (err) {
    return { notFound: true };
  }
};

const GameDetailPage: React.FC<DetailProps> = ({ game }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const openReview = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsReviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-7">
          {/* Cover + tombol */}
          <div className="w-full h-1/2 md:w-1/3 flex flex-col items-center gap-2">
            <img
              src={game.cover}
              alt={game.name}
              className="w-full rounded-lg shadow-lg"
            />

            <div className="flex flex-col justify-between mt-2">
              <div className="flex flex-row mt-2 space-x-2">
                <AddToGameListButton slug={game.slug} />
                <AddToFavoritesButton igdbId={game.igdb_id} />
              </div>

              <button
                onClick={openReview}
                className="w-full mt-2 py-2 rounded bg-[#5385BF] hover:bg-blue-500 text-white"
              >
                Add to Review
              </button>

              <AddToWantToPlayButton slug={game.slug} />
            </div>
          </div>

          {/* Detail teks */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold">{game.name}</h1>
            <p className="text-gray-300 mt-2">
              Released on {game.release_date} by {game.developer}
            </p>
            <p className="text-gray-400 mt-1">
              Genre: {game.genres.join(", ")}
            </p>
            <p className="text-gray-400">
              Platform: {game.platforms.join(", ")}
            </p>
            <div className="mt-6 text-gray-200 leading-relaxed">
              {game.summary}
            </div>
          </div>
        </div>
      </main>

      {/* Review modal from component */}
      {isReviewOpen && (
        <AddReviewModal
          gameId={game.id} // ✅ local game_id (bukan igdb_id)
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </div>
  );
};

export default GameDetailPage;
