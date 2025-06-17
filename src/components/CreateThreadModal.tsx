// src/components/CreateThreadModal.tsx
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAuth } from "@/context/AuthContext";
// import { createForumThread, CreateThreadBody } from "lib/api";
import { useRouter } from "next/router";
import { createForumThread } from "lib/api";

interface CreateThreadModalProps {
  slug: string;      
  gameLocalId: number;           // the game slug (so you can derive local ID)
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

export default function CreateThreadModal({
  slug,
  gameLocalId,
  isOpen,
  onClose,
  onCreated,
}: CreateThreadModalProps) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  // you’ll still need a way to turn slug → numeric game_local_id
  // e.g. if you loaded it in getServerSideProps, pass it instead of slug
  // or call an API that fetches gameLocalId by slug:
  // const gameLocalId = await fetchGameLocalIdBySlug(slug);

  const handleSubmit = async () => {
    // 1) force-login if not authed
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }

    // 2) required fields
    if (!title.trim() || !content.trim()) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 3) here token is now guaranteed non-null
      await createForumThread(
        slug,
        gameLocalId,
        { title, content },
        token
      );

      onCreated();  // e.g. refetch parent list
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to create thread");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-75"
          leave="transition-opacity ease-in duration-150"
          leaveFrom="opacity-75"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-black" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="transition-transform ease-out duration-200"
          enterFrom="scale-95"
          enterTo="scale-100"
          leave="transition-transform ease-in duration-150"
          leaveFrom="scale-100"
          leaveTo="scale-95"
        >
          <DialogPanel className="bg-gray-800 p-6 rounded-lg w-full max-w-md z-10">
            <DialogTitle className="text-xl font-semibold text-white mb-4">
              Create New Post
            </DialogTitle>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-gray-200 text-gray-900 p-2 rounded mb-4"
            />

            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Description..."
              className="w-full bg-gray-200 text-gray-900 p-2 rounded mb-4 resize-none"
            />

            {error && <p className="text-red-400 mb-2">{error}</p>}

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
