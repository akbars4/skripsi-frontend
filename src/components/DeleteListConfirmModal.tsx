import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { deleteUserList } from "lib/api";

interface DeleteListConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  listName: string;
  onDeleted: () => void;
}

export default function DeleteListConfirmModal({
  isOpen,
  onClose,
  slug,
  listName,
  onDeleted,
}: DeleteListConfirmModalProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await deleteUserList(slug, token);
      onDeleted();
    } catch (e: any) {
      setError(e.message || "Failed to delete list.");
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
                  Delete "{listName}"?
                </Dialog.Title>

                <p className="text-gray-300 mb-4">
                  Are you sure you want to permanently delete this game list? This action
                  cannot be undone.
                </p>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-50"
                  >
                    {loading ? "Deleting…" : "Delete"}
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
