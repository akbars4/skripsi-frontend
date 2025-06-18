// src/components/EditListModal.tsx
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { updateUserList } from "lib/api";

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  initialName: string;
  initialDescription: string;
  onUpdated: () => void;
}

export default function EditListModal({
  isOpen,
  onClose,
  slug,
  initialName,
  initialDescription,
  onUpdated,
}: EditListModalProps) {
  const { token } = useAuth();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  const handleSubmit = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await updateUserList(slug, { name, description }, token);
      onUpdated();
    } catch (e: any) {
      setError(e.message || "Failed to update list");
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
                  Edit Game List
                </Dialog.Title>

                <input
                  type="text"
                  placeholder="List Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                />

                <textarea
                  rows={3}
                  placeholder="Description…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                />

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {loading ? "Saving…" : "Save"}
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
