// src/pages/forum/[slug]/thread/[threadId].tsx
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  getGameBySlug,
  fetchThreadById,
  createForumReply,
} from "lib/api";
import { ForumThread, Reply } from "@/interfaces/api/ListsOfApiInterface";

interface Game {
  slug: string;
  name: string;
  cover: string;
}

interface Props {
  game: Game;
  thread: ForumThread & { replies: Reply[] };
}

export const getServerSideProps: GetServerSideProps<Props, { slug: string; threadId: string }> = async ({ params }) => {
  if (!params) return { notFound: true };

  const { slug, threadId } = params;
  const tid = parseInt(threadId, 10);
  if (isNaN(tid)) return { notFound: true };

  try {
    // Load game data
    const game = await getGameBySlug(slug);
    // Fetch thread detail using correct slug + ID
    const thread = await fetchThreadById(slug, tid);
    return { props: { game, thread } };
  } catch (error) {
    console.error("Error loading thread detail:", error);
    return { notFound: true };
  }
};

export default function ThreadReplyPage({ game, thread }: Props) {
  const router = useRouter();
  const { isAuthenticated, token, loading: authLoading } = useAuth();

  const [replies, setReplies] = useState<Reply[]>(thread.replies || []);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newReply = await createForumReply(thread.id, { content }, token!);
      setReplies((prev) => [...prev, newReply]);
      setContent("");
    } catch (e: any) {
      setError(e.message || "Failed to post reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto p-4 flex gap-6">
        {/* Left column */}
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold">Discussion</h1>

          {/* Original thread */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{thread.title}</h2>
            <p className="mt-2 text-gray-200">{thread.content}</p>
          </div>

          {/* Replies */}
          <div className="space-y-4">
            {replies.length === 0 && <p className="text-gray-400">No replies yet.</p>}
            {replies.map((r) => (
              <div key={r.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={r.user.profile_picture_url}
                    alt={r.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">{r.user.username}</p>
                    <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-200">{r.content}</p>
              </div>
            ))}
          </div>

          {/* Reply form */}
          <textarea
            rows={4}
            className="w-full bg-gray-700 text-white p-3 rounded-md resize-none"
            placeholder="Comment your reply…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => router.back()}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || authLoading}
              className={`px-4 py-2 rounded text-white ${
                loading || authLoading
                  ? "bg-gray-500"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {loading ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>

        {/* Right column: cover */}
        <div className="hidden lg:block w-1/4">
          <img src={game.cover} alt={game.name} className="rounded-lg shadow-lg" />
        </div>
      </main>
    </div>
  );
}
