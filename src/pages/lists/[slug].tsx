import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserList } from "@/interfaces/api/ListsOfApiInterface";
import { fetchUserListDetail } from "lib/api";
import Link from "next/link";

export default function ListDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, token } = useAuth();

  const [list, setList] = useState<UserList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !user?.username || !token) return;
    fetchUserListDetail(user.username, slug as string, token)
      .then(setList)
      .finally(() => setLoading(false));
  }, [slug, user, token]);
  console.log({ slug, user, token });

  const handleDelete = async () => {
    if (!list || !token) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this list?"
    );
    if (!confirm) return;

    // try {
    //   await deleteUserList(list.id, token);
    //   router.push("/lists");
    // } catch (err) {
    //   alert("Failed to delete list.");
    // }
  };

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (!list) return <div className="p-6 text-red-500">List not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="w-1/4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">{list.username}</h1>
          <div className="space-x-2">
            <button
              className="hover:text-yellow-400"
              title="Edit list"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="hover:text-red-500"
              title="Delete list"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <p className="text-gray-400 mb-4">{list.description}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {list.items.map((item) => (
          <Link
            key={item.id}
            href={`/games/${item.game.slug ?? item.game.id}`} // ✅ pastikan game punya slug
          >
            <img
              src={item.game.cover_url}
              alt={item.game.name}
              className="rounded w-full aspect-[2/3] object-cover hover:opacity-90 transition"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
