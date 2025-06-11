// src/components/CreateListModal.tsx
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { CreateListBody, createUserList } from "lib/api";
import { getGameBySlug } from "lib/api";
import { useRouter } from "next/router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateListModal({ isOpen, onClose, onCreated }: Props) {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameSlug, setGameSlug] = useState("");
  const [games, setGames] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addGame() {
    try {
      const g = await getGameBySlug(gameSlug);
      setGames((prev) => [...prev, { id: g.id, name: g.name }]);
      setGameSlug("");
    } catch {
      setError("Game not found");
    }
  }

  async function handleSubmit() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!title.trim() || games.length === 0) {
      setError("Title and at least one game required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
        const body: CreateListBody = {
      name:        title,                         // use your modal’s title
      description,                               // description unchanged
      data: games.map((g) => ({ id: g.id }))  // id array format
    };
      await createUserList(body,
        token!
      );
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to create list");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* BACKDROP */}
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

        {/* CENTERING TRICK */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* PANEL */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-white mb-4"
                >
                  Create New List
                </Dialog.Title>

                {/* FORM FIELDS */}
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-200 text-gray-900 p-2 rounded mb-4"
                />
                <textarea
                  rows={3}
                  placeholder="Description…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-200 text-gray-900 p-2 rounded mb-4"
                />

                {/* ADD GAMES BY SLUG */}
                <div className="flex mb-2 space-x-2">
                  <input
                    type="text"
                    placeholder="Enter a game slug…"
                    value={gameSlug}
                    onChange={(e) => setGameSlug(e.target.value)}
                    className="flex-1 bg-gray-200 text-gray-900 p-2 rounded"
                  />
                  <button
                    onClick={addGame}
                    className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                <ul className="mb-4 text-gray-200">
                  {games.map((g) => (
                    <li key={g.id} className="flex justify-between">
                      {g.name}
                      <button
                        onClick={() =>
                          setGames((s) => s.filter((x) => x.id !== g.id))
                        }
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>

                {error && <p className="text-red-400 mb-2">{error}</p>}

                {/* ACTIONS */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {loading ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
