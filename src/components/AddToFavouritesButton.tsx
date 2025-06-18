import React, { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "lib/api";
import { Dialog, Transition } from "@headlessui/react";

interface AddToFavoritesButtonProps {
  igdbId: number;
}

export default function AddToFavoritesButton({ igdbId }: AddToFavoritesButtonProps) {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitPopup, setLimitPopup] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !token || !user) return;
      try {
        const favorites = await fetchFavorites(user.username, token);
        setIsFavorited(favorites.some((g) => g.igdb_id === igdbId));
      } catch (err) {
        console.error("Failed to check favorites", err);
      }
    };
    checkFavorite();
  }, [igdbId, isAuthenticated, token, user]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isFavorited) {
        await removeFromFavorites(igdbId, token!);
        setIsFavorited(false);
      } else {
        await addToFavorites(igdbId, token!);
        setIsFavorited(true);
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("Favorites list can only contain up to 4 games")) {
        setLimitPopup(true);
      } else {
        setError(msg || "Failed to toggle favorite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-1">
        <button
          onClick={handleClick}
          disabled={loading}
          className={`mt-2 rounded flex items-center justify-between space-x-2 
            bg-[#5385BF] text-white hover:bg-blue-500 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="text-xl">{isFavorited ? "💖" : "🤍"}</span>
        </button>

        {error && (
          <p className="mt-1 text-sm text-red-400 text-center">{error}</p>
        )}
      </div>

      {/* Popup Modal */}
      <Transition appear show={limitPopup} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setLimitPopup(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-75"
            leave="ease-in duration-150"
            leaveFrom="opacity-75"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm rounded bg-gray-800 p-6 text-white shadow-xl">
                  <Dialog.Title className="text-lg font-semibold mb-2">
                    Favorites Limit Reached
                  </Dialog.Title>
                  <p className="text-sm mb-4">
                    You already have 4 games in your favorites. Please remove one first before adding a new one.
                  </p>
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
                      onClick={() => setLimitPopup(false)}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
