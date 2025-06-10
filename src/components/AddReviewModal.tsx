import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { createDiaryEntry, CreateDiaryBody } from "lib/api";
import { useRouter } from "next/router";

interface AddReviewModalProps {
  gameId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddReviewModal({
  gameId,
  isOpen,
  onClose,
}: AddReviewModalProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  // form state
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
    setLoading(true);
    setError(null);

    const body: CreateDiaryBody = {
      game_id: gameId,
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
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        {/* backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-60"
          leave="ease-in duration-150"
          leaveFrom="opacity-60"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black" />
        </TransitionChild>

        {/* centering trick */}
        <div className="min-h-screen px-4 text-center">
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          {/* panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 rounded-lg shadow-xl">
              <DialogTitle as="h3" className="flex justify-between text-lg font-medium text-white">
                <span>Add your review</span>
                <button onClick={onClose} className="text-white text-xl leading-none">
                  ✕
                </button>
              </DialogTitle>

              {/* form fields */}
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

                {/* …platform/status selects, textarea, stars, heart as before… */}

                {error && <p className="text-sm text-red-400">{error}</p>}
              </div>

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
      </Dialog>
    </Transition>
  );
}
