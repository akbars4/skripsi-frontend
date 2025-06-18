import { useState, useEffect, Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserListsGame, addGameToList } from "lib/api";
import { GameList } from "@/interfaces/api/ListsOfApiInterface";
import CreateListModal from "./CreateListModal";

interface Props {
  igdbId: number;
}

export default function AddToGameListButton({ igdbId }: Props) {
  const { isAuthenticated, token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState<GameList[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchLists = () => {
    if (user && token) {
      fetchUserListsGame(user.username, token)
        .then(setLists)
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLists();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!selectedSlug || !token) return;
    setLoading(true);
    try {
      await addGameToList(selectedSlug, igdbId, token);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to add to list", err);
    } finally {
      setLoading(false);
    }
  };

  const isGameInList = (list: GameList) =>
    list.items?.some((item) => item.game.igdb_id === igdbId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 rounded bg-[#5385BF] text-white hover:bg-blue-500"
      >
        Add to GameList
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
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

          {/* MODAL */}
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                    <DialogTitle as="h3" className="text-lg font-medium text-white">
                      Add to GameList
                    </DialogTitle>
                    <button onClick={() => setIsOpen(false)} className="text-white text-xl">✕</button>
                  </div>

                  {/* + New List Button */}
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full mb-3 text-left px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                  >
                    + New List...
                  </button>

                  {/* List options */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {lists.map((list) => {
                      const alreadyAdded = isGameInList(list);
                      return (
                        <button
                          key={list.slug}
                          onClick={() => setSelectedSlug(list.slug)}
                          disabled={alreadyAdded}
                          className={`w-full text-left px-4 py-2 rounded flex justify-between items-center transition ${
                            selectedSlug === list.slug
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          } ${alreadyAdded ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span>{list.name}</span>
                          {alreadyAdded && <span className="text-xs text-green-400">Added</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleAdd}
                      disabled={!selectedSlug || loading || success}
                      className={`px-4 py-2 rounded ${
                        success
                          ? "bg-green-600"
                          : loading
                          ? "bg-gray-500"
                          : "bg-blue-600 hover:bg-blue-500"
                      } text-white transition disabled:opacity-50`}
                    >
                      {success ? "Added!" : loading ? "Adding..." : "Add"}
                    </button>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* New List Modal */}
      <CreateListModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          setIsCreateOpen(false);
          fetchLists(); // reload lists after creating one
        }}
      />
    </>
  );
}
