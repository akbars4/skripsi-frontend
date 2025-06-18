import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AddToFavoritesButton from "@/components/AddToFavouritesButton";
import AddToWantToPlayButton from "@/components/AddToWantToPlayButton";
import AddReviewModal from "@/components/AddReviewModal";
import AddToGameListButton from "@/components/AddToGameListButton";
import { getGameBySlug } from "lib/api";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

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
  screenshots: string[];
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

  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

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
    <div className="min-h-screen text-white relative bg-[#11161D]">
      {/* Background Screenshot + Fade */}
      {game.screenshots?.[0] && (
        <div className="absolute top-0 left-0 w-full h-[40vh] z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${game.screenshots[0]})` }}
          />
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-[#11161D]" />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-[25vh] pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-7">
            {/* Cover & Buttons */}
            <div className="w-full lg:w-1/4 flex flex-col items-center gap-2">
              <img
                src={game.cover}
                alt={game.name}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="flex flex-col justify-between mt-2 w-full">
                <div className="flex flex-row mt-2 space-x-2">
                  <AddToGameListButton igdbId={game.igdb_id} />
                  <AddToFavoritesButton igdbId={game.igdb_id} />
                </div>
                <button
                  onClick={openReview}
                  className="w-full mt-2 py-2 rounded bg-[#5385BF] hover:bg-blue-500 text-white"
                >
                  Add to Review
                </button>
                  <AddToWantToPlayButton igdbId={game.igdb_id} />
              </div>
            </div>

            {/* Detail + Screenshots */}
            <div className="w-full lg:w-2/4">
              <h1 className="text-4xl font-bold">{game.name}</h1>
              <p className="text-gray-300 mt-2">
                Released on {game.release_date || "Unknown"} by {game.developer || "Unknown"}
              </p>
              <p className="text-gray-400 mt-1">
                Platform: {game.platforms?.join(", ") || "Unknown"}
              </p>
              <p className="text-gray-400 mb-2">
                Genre: {game.genres?.join(", ") || "Unknown"}
              </p>

              {/* Screenshots Carousel */}
              {game.screenshots && game.screenshots.length > 0 && (
                <div className="mt-4">
                  <div
                    ref={sliderRef}
                    className="keen-slider rounded overflow-hidden"
                  >
                    {game.screenshots.map((url, idx) => (
                      <div key={idx} className="keen-slider__slide">
                        <img
                          src={url}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 text-gray-200 leading-relaxed">
                {game.summary || "No summary available."}
              </div>
            </div>

            {/* Recommendations */}
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
        </div>
      </main>

      {/* Review Modal */}
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
