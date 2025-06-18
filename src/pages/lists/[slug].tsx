import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserList } from "@/interfaces/api/ListsOfApiInterface";
import { fetchUserListDetail } from "lib/api";
import { Pencil, Trash } from "lucide-react";
import EditListModal from "@/components/EditListModal";
import DeleteListConfirmModal from "@/components/DeleteListConfirmModal";

export default function ListDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, token } = useAuth();

  const [list, setList] = useState<UserList | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadList = async () => {
    if (!slug || !user?.username || !token) return;
    try {
      const data = await fetchUserListDetail(user.username, slug as string, token);
      setList(data);
    } catch (err) {
      console.error("Failed to fetch list:", err);
      setList(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [slug, user, token]);

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (!list) return <div className="p-6 text-red-500">List not found.</div>;

  return (
    <div className="min-h-screen bg-[#11161D] text-white p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/lists")}
        className="text-sm text-blue-400 hover:underline mb-4"
      >
        ← Back to Lists
      </button>

      {/* Title & Buttons */}
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold">{list.name}</h1>
        <button title="Edit list" onClick={() => setShowEditModal(true)}>
          <Pencil size={18} className="hover:text-yellow-400" />
        </button>
        <button title="Delete list" onClick={() => setShowDeleteModal(true)}>
          <Trash size={18} className="hover:text-red-400" />
        </button>
      </div>

      {/* Description */}
      {list.description && (
        <p className="text-gray-400 mb-4">{list.description}</p>
      )}

      {/* Games */}
      <div className="flex gap-3 flex-wrap">
        {list.items.map((item) => (
          <img
            key={item.id}
            src={item.game.cover_url}
            alt={item.game.name}
            className="w-[180px] aspect-[3/4] object-cover rounded-md shadow-md"
          />
        ))}
      </div>

      {/* Edit Modal */}
      <EditListModal
        key={list.slug}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        slug={list.slug}
        initialName={list.name}
        initialDescription={list.description}
        onUpdated={async () => {
          setShowEditModal(false);
          await loadList();
          router.replace(`/lists/${list.slug}`); // slug baru kalau berubah
        }}
      />

      {/* Delete Modal */}
      <DeleteListConfirmModal
        key={list.slug}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        slug={list.slug}
        listName={list.name}
        onDeleted={() => {
          setShowDeleteModal(false);
          router.push("/lists");
        }}
      />
    </div>
  );
}
