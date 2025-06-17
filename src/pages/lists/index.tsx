import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserLists } from "lib/api";
import { UserList } from "@/interfaces/api/ListsOfApiInterface";
import Link from "next/link";
import CreateListModal from "@/components/CreateListModal";

export default function ListIndexPage() {
  const { user, token } = useAuth();
  const [lists, setLists] = useState<UserList[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadLists = () => {
    if (!user || !token) return;
    fetchUserLists(user.username, token).then(setLists);
  };

  useEffect(() => {
    loadLists();
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Lists</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New List
        </button>
      </div>

      {lists.length === 0 ? (
        <p className="text-gray-400">You don't have any lists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lists.map((lst) => {
            const firstGame = lst.items[0]?.game;

            return (
              <Link
                href={`/lists/${lst.slug}`}
                key={lst.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition"
              >
                <div className="aspect-[2/3] w-full relative">
                  <img
                    src={
                      firstGame?.cover_url ||
                      "https://via.placeholder.com/264x374?text=No+Image"
                    }
                    alt={firstGame?.name || "No game"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-lg font-semibold line-clamp-1">
                    {lst.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {lst.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lst.items.length} games
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <CreateListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          setShowModal(false);
          loadLists(); // Refresh after create
        }}
      />
    </div>
  );
}
