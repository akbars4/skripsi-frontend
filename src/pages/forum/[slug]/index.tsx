// pages/forum/[slug]/index.tsx
import { useState } from "react";
import { GetServerSideProps } from "next";
import { useAuth } from "@/context/AuthContext";
import CreateThreadModal from "@/components/CreateThreadModal";
import { getGameBySlug, fetchForumThreadsBySlug } from "lib/api";
import { ForumThread, GameLocal } from "@/interfaces/api/ListsOfApiInterface";
import Link from "next/link";

export interface ForumPageProps {
  slug: string;
  game: GameLocal;
  threads: ForumThread[];
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
}

export const getServerSideProps: GetServerSideProps<ForumPageProps> = async ({ params, query }) => {
  const slug = String(params?.slug);
  const page = parseInt(String(query.page || "1"), 10);

  try {
    const game = await getGameBySlug(slug);
    const { threads, currentPage, lastPage, nextPage } =
      await fetchForumThreadsBySlug({ slug, page });

    return { props: { slug, game, threads, currentPage, lastPage, nextPage } };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return { notFound: true };
  }
};

export default function ForumThreadsPage({ slug, game, threads, currentPage, lastPage, nextPage }: ForumPageProps) {
  const { token, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreated = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">{game.name} Discussion</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Create New Post
        </button>

        <ul className="space-y-4">
          {threads.map((t) => (
            <li key={t.id} className="p-4 bg-gray-800 rounded">
              <Link href={`/forum/${encodeURIComponent(slug)}/thread/${t.id}`}>  
                <div className="block space-y-2 hover:bg-gray-700 p-2 rounded">
                  <p className="font-semibold text-white">{t.title}</p>
                  <p className="text-sm text-gray-400 truncate">{t.content}</p>
                  <p className="text-xs text-gray-500">
                    by {t.user.username} · {t.replies_count} replies
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center space-x-4">
          {currentPage > 1 && (
            <Link href={`/forum/${slug}?page=${currentPage - 1}`}>
              <div className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">← Prev</div>
            </Link>
          )}
          <span className="px-3 py-1 bg-blue-600 rounded">{currentPage}</span>
          {nextPage && (
            <Link href={`/forum/${slug}?page=${nextPage}`}>
              <div className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Next →</div>
            </Link>
          )}
        </div>
      </div>

      <CreateThreadModal
        slug={slug}
        gameLocalId={game.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
