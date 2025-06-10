// src/components/AddToGameListButton.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { addToGameList } from "lib/api";

interface Props {
  slug: string;
}

export default function AddToGameListButton({ slug }: Props) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      // Kalau belum login, redirect ke /login
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Panggil API untuk menambahkan ke game list
      // Pastikan addToGameList memakai token di header
      await addToGameList(slug);
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to add to your list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={loading || success}
        className={`
           w-full py-2 rounded 
          ${success 
            ? "bg-[#5385BF] text-white cursor-default" 
            : "bg-[#5385BF] text-white hover:bg-blue-500"}
          ${loading || success ? "opacity-50" : ""}
        `}
      >
        {loading
          ? "Adding..."
          : success
          ? "Added to GameList"
          : "Add to GameList"}
      </button>

      {/* Jika ada error, tampilkan di bawah tombol */}
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}. Please try again.
        </p>
      )}
    </div>
  );
}
