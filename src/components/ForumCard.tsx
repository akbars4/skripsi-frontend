// components/ForumCard.tsx
import React from 'react';
import Link from 'next/link';
import { FetchForumThreadsBySlugOpts, ForumThread, SearchForum } from '@/interfaces/api/ListsOfApiInterface';

type ForumCardprops = {
  thread: ForumThread
}
const ForumCard: React.FC<ForumCardprops> = ({ thread }) => (
  <Link href={`/forum/{threadId}`}>
    <div className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
      <h2 className="text-lg font-semibold">{thread.title}</h2>
      {/* <p className="text-sm text-gray-600">
        by {thread.user.username} • {new Date(thread.created_at).toLocaleDateString()}
      </p> */}
    </div>
  </Link>
);

export default ForumCard;