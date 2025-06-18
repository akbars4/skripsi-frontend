import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import {
  addToWantToPlay,
  fetchUserWishlist,
  removeFromWantToPlay,
} from "lib/api";

interface Props {
  igdbId: number;
}

export default function AddToWantToPlayButton({ igdbId }: Props) {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const checkIfInWishlist = async () => {
      if (!token || !user) return;
      try {
        const wishlist = await fetchUserWishlist(user.username, token);
        const found = wishlist.some((game: any) => game.igdb_id === igdbId);
        setAdded(found);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };
    checkIfInWishlist();
  }, [igdbId, token, user]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (added) {
        await removeFromWantToPlay(igdbId, token!);
        setAdded(false);
      } else {
        await addToWantToPlay(igdbId, token!);
        setAdded(true);
      }
    } catch (err: any) {
      console.error("Wishlist toggle failed:", err);
      setError("Failed to update wishlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`mt-2 w-full py-2 rounded
          ${added ? "bg-[#5385BF]" : "bg-[#5385BF] hover:bg-blue-500"}
          text-white ${loading ? "opacity-50" : ""}
        `}
      >
        {loading
          ? "Updating..."
          : added
          ? "Remove from Wishlist"
          : "Add to Want-to-Play"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">
          {error}. Please try again.
        </p>
      )}
    </div>
  );
}
