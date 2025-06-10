// File: src/components/AddToFavoritesButton.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { addToFavorites } from "lib/api";

interface AddToFavoritesButtonProps {
  igdbId: number;
  // (opsional) kalau kamu juga mau menampilkan nama game: name: string;
}

export default function AddToFavoritesButton({ igdbId }: AddToFavoritesButtonProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      // Jika user belum login, redirect ke halaman login
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Panggil helper API: addToFavorites
      await addToFavorites(igdbId, token!);
      setSuccess(true);

      // Setelah berhasil, langsung redirect ke halaman favorite list
      // (misal route-nya: /favorites)
      router.push("/favorites");
    } catch (err: any) {
      console.error("Error adding to favorites:", err);
      setError(err.message || "Failed to add to favorites.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-1">
      <button
        onClick={handleClick}
        disabled={loading || success}
        className={`
          mt-2 rounded flex items-center justify-between space-x-2 
          ${
            success
              ? "bg-[#5385BF] text-white cursor-default"
              : "bg-[#5385BF] text-white hover:bg-blue-500"
          }
          ${loading || success ? "opacity-50" : ""}
        `}
      >
        {/* Kamu bisa mengganti icon ♥ di samping teks sesuai selera */}
        <span className="text-xl">{success ? "💖" : "🤍"}</span>
        {/* <span className="font-medium">
          {loading
            ? "Adding..."
            : success
            ? "Favorited"
            : "Add to Favorites"}
        </span> */}
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
