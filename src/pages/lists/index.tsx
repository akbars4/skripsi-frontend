import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserLists, fetchUserWishlist } from "lib/api";
import { UserList } from "@/interfaces/api/ListsOfApiInterface";
import Link from "next/link";
import CreateListModal from "@/components/CreateListModal";
import EditListModal from "@/components/EditListModal";
import DeleteListConfirmModal from "@/components/DeleteListConfirmModal";
import { Pencil, Trash } from "lucide-react";

export default function ListIndexPage() {
  const { user, token } = useAuth();
  const [lists, setLists] = useState<UserList[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editList, setEditList] = useState<UserList | null>(null);
  const [deleteList, setDeleteList] = useState<UserList | null>(null);

  const loadLists = async () => {
    if (!user || !token) return;
    const [userLists, wishlistData] = await Promise.all([
      fetchUserLists(user.username, token),
      fetchUserWishlist(user.username, token),
    ]);
    setLists(userLists);
    setWishlist(wishlistData);
  };

  useEffect(() => {
    loadLists();
  }, [user, token]);

  return (
    <div className="min-h-screen bg-[#11161D] text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">GAMELIST</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
        >
          Create New List
        </button>
      </div>

      {/* Wishlist Section */}
      {wishlist.length > 0 && (
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-xl font-bold">Wishlist</h2>
          <div className="flex gap-2 flex-wrap">
            {wishlist.map((game, i) => (
              <img
                key={i}
                src={game.cover_url}
                alt={game.name}
                className="w-[200px] aspect-[3/4] object-cover rounded-md shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Lists Section */}
      {lists.length === 0 ? (
        <p className="text-gray-400">You don't have any lists yet.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {lists.map((lst) => (
            <div key={lst.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Link href={`/lists/${lst.slug}`}>
                  <h2 className="text-xl font-bold hover:text-blue-400 cursor-pointer">
                    {lst.name}
                  </h2>
                </Link>
                <button onClick={() => setEditList(lst)}>
                  <Pencil size={18} className="hover:text-yellow-400 cursor-pointer" />
                </button>
                <button onClick={() => setDeleteList(lst)}>
                  <Trash size={18} className="hover:text-red-400 cursor-pointer" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {lst.items.map((item) => (
                  <img
                    key={item.id}
                    src={item.game.cover_url}
                    alt={item.game.name}
                    className="w-[200px] aspect-[3/4] object-cover rounded-md shadow-md"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={loadLists}
      />

      {/* Edit Modal */}
      {editList && (
        <EditListModal
          key={editList.slug}
          isOpen={!!editList}
          onClose={() => setEditList(null)}
          slug={editList.slug}
          initialName={editList.name}
          initialDescription={editList.description}
          onUpdated={() => {
            setEditList(null);
            loadLists();
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteList && (
        <DeleteListConfirmModal
          key={deleteList.slug}
          isOpen={!!deleteList}
          onClose={() => setDeleteList(null)}
          slug={deleteList.slug}
          listName={deleteList.name}
          onDeleted={() => {
            setDeleteList(null);
            loadLists();
          }}
        />
      )}
    </div>
  );
}
