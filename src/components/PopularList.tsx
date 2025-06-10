import { useEffect, useState } from "react";
import GameList from "@/components/GameList";
import { Game } from "@/interfaces/Game";
import { fetchPopularGame } from "lib/api";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchGames = async () => {
  try {
    const data = await fetchPopularGame(); // 🎉 pakai dari lib/api.ts
    setGames(data);
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  fetchGames();
}, []);


  if (loading) return <p className="text-white p-8">Loading games...</p>;
  if (error) return <p className="text-red-500 p-8">Error: {error}</p>;

  return (
    <div className="bg-[#11161D] p-3">
      <h1 className="text-white text-xl mb-6">Popular This Year</h1>
      <GameList games={games} />
    </div>
  );
}
