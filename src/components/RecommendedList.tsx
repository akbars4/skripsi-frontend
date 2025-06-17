import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GameList from "@/components/GameList";
import { Game } from "@/interfaces/Game";

export default function RecommendedList() {
  const { token, isAuthenticated } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!isAuthenticated || !token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommendations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // handle jika tidak ada data
        if (!Array.isArray(data.data) || data.data.length === 0) {
          setGames([]);
        } else {
          setGames(data.data);
        }

      } catch (err: any) {
        console.error("Failed to fetch recommendations", err);
        setError("Add a game to your diary to see recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [token]);

  if (!isAuthenticated || loading) return null;

  return (
    <div className="bg-[#11161D] p-3">
      <h1 className="text-white text-xl mb-6">Based on What You Play</h1>

      {error ? (
        <p className="text-gray-400">{error}</p>
      ) : games.length === 0 ? (
        <p className="text-gray-400">Add a game to your diary to see recommendations.</p>
      ) : (
        <GameList games={games} />
      )}
    </div>
  );
}