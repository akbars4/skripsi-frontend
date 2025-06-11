// src/pages/lists.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { fetchUserLists, UserList } from "lib/api";
import CreateListModal from "@/components/CreateListModal";

export default function MyListsPage() {
  const { isAuthenticated, token, user } = useAuth();
  const [lists, setLists] = useState<UserList[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

   useEffect(() => {
    if (!isAuthenticated || !token || !user?.username) return;
    setLoading(true);

    fetchUserLists(user.username, token)
      .then((data) => setLists(data))
      .catch((err) => {
        console.error("Failed to load lists:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, token, user?.username]);
  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <p className="p-6">Please <a href="/login">login</a> to view your lists.</p>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-6 bg-gray-900 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Lists</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            Create New List
          </button>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          lists.map((lst) => (
            <section key={lst.id} className="mb-8">
              <h2 className="text-xl font-semibold">{lst.title}</h2>
              <p className="text-gray-400 mb-2">{lst.description}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {lst.games.map((g) => (
                  <div key={g.id} className="aspect-[4/5]">
                    <img
                      src={g.cover_url}
                      alt={g.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <CreateListModal
         isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onCreated={() => {
    setIsModalOpen(false);
    setLoading(true);
    if (user?.username && token) {
      fetchUserLists(user.username, token)
        .then((data) => {
          setLists(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }}
      />
    </>
  );
}
