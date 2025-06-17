// src/components/AddReviewModal.tsx
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { CreateDiaryBody } from "@/interfaces/api/ListsOfApiInterface";
import { createDiaryEntry } from "lib/api";

interface AddReviewModalProps {
  igdbId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddReviewModal({
  igdbId,
  isOpen,
  onClose,
}: AddReviewModalProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const [playedAt, setPlayedAt] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [status, setStatus] = useState<"completed" | "in-progress" | "dropped">("completed");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!playedAt) {
      setError("Please choose a completion date.");
      return;
    }
    if (rating < 1) {
      setError("Please give a rating (at least ★).");
      return;
    }

    setLoading(true);
    setError(null);

    const body: CreateDiaryBody = {
      game_id: igdbId,
      platform,
      status,
      rating,
      review,
      played_at: playedAt,
      liked,
    };

    try {
      await createDiaryEntry(body, token!);
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to save review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-60"
          leave="ease-in duration-150"
          leaveFrom="opacity-60"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        {/* MODAL WRAPPER */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <DialogTitle as="h3" className="text-lg font-medium text-white">
                    Add your review
                  </DialogTitle>
                  <button onClick={onClose} className="text-white text-xl">✕</button>
                </div>

                {/* Form */}
                <div className="mt-4 space-y-4 text-white">
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
                        {["PC", "PlayStation", "Xbox", "Switch"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex-1">
                      <span className="text-sm">Status</span>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="mt-1 block w-full rounded bg-gray-700 px-3 py-2"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm">Add a review…</span>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded bg-gray-700 px-3 py-2 resize-none"
                    />
                  </label>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm mr-2">Rating</span>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(i)}
                          className={`text-2xl ${i <= rating ? "text-yellow-400" : "text-gray-400"}`}
                        >★</button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setLiked(!liked)}
                      className={`text-2xl ${liked ? "text-red-400" : "text-gray-400"}`}
                    >♥</button>
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-4 py-2 rounded ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-500"} text-white`}
                  >
                    {loading ? "Saving…" : "SAVE"}
                  </button>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
