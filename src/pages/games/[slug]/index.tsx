// src/pages/games/[slug]/index.tsx
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AddToGameListButton from "@/components/AddToGameListButton";
import AddToFavoritesButton from "@/components/AddToFavouritesButton";
import AddToWantToPlayButton from "@/components/AddToWantToPlayButton";
import AddReviewModal from "@/components/AddReviewModal";
import { getGameBySlug } from "lib/api";

interface Game {
  id: number;
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

interface RecommendedGame {
  id: number;
  slug: string;
  name: string;
  cover: string;
}

interface DetailProps {
  game: Game;
}

export const getServerSideProps: GetServerSideProps<DetailProps> = async (ctx) => {
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

  // === You Might Like ===
  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/games/${game.igdb_id}/you-might-like`,
          {
            headers: {
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
            },
          }
        );
        const data = await res.json();
        setRecommendations(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setRecommendations([]);
      } finally {
        setRecLoading(false);
      }
    };

    fetchRecommendations();
  }, [game.igdb_id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* Cover + tombol */}
          <div className="w-full lg:w-1/4 flex flex-col items-center gap-2">
            <img
              src={game.cover}
              alt={game.name}
              className="w-full rounded-lg shadow-lg"
            />
            <div className="flex flex-col justify-between mt-2 w-full">
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
          <div className="w-full lg:w-2/4">
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

          {/* Rekomendasi */}
          <div className="w-full lg:w-1/4">
            <h2 className="text-xl font-semibold mb-2">You Might Also Like</h2>
            {recLoading ? (
              <p className="text-gray-400">Loading…</p>
            ) : recommendations.length === 0 ? (
              <p className="text-gray-500">No recommendations found.</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <a
                    key={rec.id}
                    href={`/games/${rec.slug}`}
                    className="flex items-center space-x-3 bg-gray-800 p-2 rounded hover:bg-gray-700"
                  >
                    <img
                      src={rec.cover}
                      alt={rec.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <span className="text-sm text-white">{rec.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isReviewOpen && (
        <AddReviewModal
          igdbId={game.igdb_id}
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </div>
  );
};

export default GameDetailPage;
