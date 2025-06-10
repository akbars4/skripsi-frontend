// src/pages/games/[slug]/index.tsx
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AddToGameListButton from "@/components/AddToGameListButton";
import AddToFavoritesButton from "@/components/AddToFavouritesButton";
import AddToWantToPlayButton from "@/components/AddToWantToPlayButton";
import AddReviewModal from "@/components/AddReviewModal";
import { CreateDiaryBody, createDiaryEntry, getGameBySlug } from "lib/api";

interface Game {
  id: number;
  slug: string;
  name: string;
  summary: string;
  cover_url: string;
  cover: string;
  genres: string[];
  platforms: string[];
  release_date: string;
  developer: string;
  // if your modal needs igdb_id instead of game.id, add it here
  igdb_id?: number;
}

interface DetailProps {
  game: Game;
}

export const getServerSideProps: GetServerSideProps<DetailProps> = async (
  ctx
) => {
  const { slug } = ctx.params!; // e.g. "the-witcher-3-wild-hunt"
  try {
    const game = await getGameBySlug(slug as string);
    return { props: { game } };
  } catch (err) {
    return { notFound: true };
  }
};

const GameDetailPage: React.FC<DetailProps> = ({ game }) => {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  // <-- NEW: state to track whether the review modal is open
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // <-- NEW: handler for your "Add to Review" button
  const openReview = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsReviewOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const body: CreateDiaryBody = {
      game_id: game.id,
      platform,
      status,
      rating,
      review,
      played_at: playedAt,
      liked,
    };

    try {
      await createDiaryEntry(body, token!);
      setIsReviewOpen(false);
      // Optionally: router.push("/diary") or show a toast
    } catch (err: any) {
      setError(err.message || "Failed to save review");
    } finally {
      setLoading(false);
    }
  };

  

  const [playedAt, setPlayedAt] = useState("");
  const [platform, setPlatform] = useState(game.platforms[0] || "");
  const [status, setStatus] = useState<"completed" | "in-progress" | "dropped">("completed");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  

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
                <AddToFavoritesButton igdbId={game.id} />
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

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Reviews From Other Users</h2>
          <p className="text-gray-400 text-sm mt-1">
            <a
              href={`/games/${game.slug}/reviews`}
              className="text-blue-400 hover:underline"
            >
              &gt;&gt; Lihat Semua Review
            </a>
          </p>
        </section>
      </main>

      {/* <-- NEW: controlled review modal */}
      {isReviewOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/60 p-4
          "
        >
          <div className="bg-gray-800 rounded-lg overflow-hidden w-full max-w-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-white text-xl">Add your review</h2>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 text-white">
              <label className="block">
                <span className="text-sm">Finished on</span>
                <input
                  type="date"
                  value={playedAt}
                  onChange={(e) => setPlayedAt(e.target.value)}
                  className="mt-1 block w-full rounded bg-gray-700 px-3 py-2"
                />
              </label>

              <div className="flex gap-4">
                <label className="flex-1">
                  <span className="text-sm">Platform</span>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="mt-1 block w-full rounded bg-gray-700 px-3 py-2"
                  >
                    {game.platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex-1">
                  <span className="text-sm">Status</span>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as any)
                    }
                    className="mt-1 block w-full rounded bg-gray-700 px-3 py-2"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </label>
              </div>

              <label>
                <span className="text-sm">Add a review…</span>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded bg-gray-700 px-3 py-2 resize-none"
                />
              </label>

              <div className="flex items-center justify-between">
                {/* Rating stars */}
                <div className="flex items-center space-x-1">
                  <span className="text-sm mr-2">Rating</span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      className={`text-2xl ${
                        i <= rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {/* Liked heart */}
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`text-2xl ${
                    liked ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  ♥
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`
                  px-4 py-2 rounded
                  ${loading
                    ? "bg-gray-500"
                    : "bg-blue-600 hover:bg-blue-500"}
                  text-white
                `}
              >
                {loading ? "Saving…" : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default GameDetailPage;
