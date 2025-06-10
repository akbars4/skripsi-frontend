// src/components/AddToWantToPlayButton.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { addToWantToPlay } from "lib/api";

interface Props {
  slug: string;
}

export default function AddToWantToPlayButton({ slug }: Props) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addToWantToPlay(slug);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error adding to want-to-play:", err);
      setError("Failed to add to want-to-play.");
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
           mt-2 w-full py-2 rounded 
          ${success 
            ? "bg-[#5385BF] text-white cursor-default" 
            : "bg-[#5385BF] text-white hover:bg-blue-500"}
          ${loading || success ? "opacity-50" : ""}
        `}
      >
        {loading
          ? "Adding..."
          : success
          ? "Added to Want-to-Play"
          : "Add to Want-to-Play"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}. Please try again.
        </p>
      )}
    </div>
  );
}
