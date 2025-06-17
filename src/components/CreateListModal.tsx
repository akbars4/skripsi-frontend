// src/components/CreateListModal.tsx

import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { searchGames, createUserList } from "lib/api";
import type { Game } from "@/interfaces/Game";
import type { CreateListBody, UserList } from "@/interfaces/api/ListsOfApiInterface";

interface SelectedGame {
  id: number;
  name: string;
}

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateListModal({
  isOpen,
  onClose,
  onCreated,
}: CreateListModalProps) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [fetching, setFetching] = useState(false);
  const [games, setGames] = useState<SelectedGame[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced game search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setFetching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchGames(searchQuery);
        setSuggestions(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add game from search
  const addGame = useCallback(
    (g: Game) => {
      const sg: SelectedGame = {
        id: Number(g.id), // ✅ FIXED: Use local backend ID
        name: g.name,
      };
      if (games.some((x) => x.id === sg.id)) return;
      setGames((prev) => [...prev, sg]);
      setSearchQuery("");
      setSuggestions([]);
    },
    [games]
  );

  const removeGame = useCallback((id: number) => {
    setGames((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!name.trim() || games.length === 0) {
      setError("Name and at least one game are required");
      return;
    }

    const game_ids = games.map((x) => Number(x.id));
    const body: CreateListBody = {
      name,
      description,
      game_ids,
    };

    console.log("🧾 games:", games);
    console.log("📦 game_ids:", game_ids);
    console.log("🚀 SUBMIT body:", body);

    setLoading(true);
    setError(null);

    try {
      const created: UserList = await createUserList(body, token!);
      onCreated();
      onClose();
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl text-left">
                <Dialog.Title className="text-xl font-semibold text-white mb-4">
                  Create New List
                </Dialog.Title>

                <input
                  type="text"
                  placeholder="List Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                />

                <textarea
                  rows={3}
                  placeholder="Description…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                />

                {/* Search Game */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search games…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white p-2 rounded"
                  />
                  {fetching && (
                    <span className="absolute right-2 top-2 text-gray-400">⏳</span>
                  )}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-gray-700 rounded mt-1 max-h-40 overflow-auto">
                      {suggestions.map((g) => (
                        <li
                          key={g.id}
                          className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white"
                          onClick={() => addGame(g)}
                        >
                          {g.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Selected Games */}
                <ul className="mb-4 space-y-2 text-gray-200">
                  {games.map((g) => (
                    <li
                      key={g.id}
                      className="flex justify-between items-center bg-gray-700 p-2 rounded"
                    >
                      {g.name}
                      <button
                        onClick={() => removeGame(g.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                {error && <p className="text-red-500 mb-2">{error}</p>}

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
