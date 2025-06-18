// components/UserCard.tsx
import React from 'react';
import Link from 'next/link';
import { ProfileResponse } from '@/interfaces/api/ListsOfApiInterface';
const UserCard: React.FC<{ user: ProfileResponse }> = ({ user }) => (
  <Link href={`/profile/${user.username}`}>
    <div className="flex items-center space-x-4 p-3 bg-transparent rounded-lg hover:bg-[#1b2a3d] gap-5">
      <div className='rounded-full bg-slate-200'>
      <img
        src={user.profile_picture_url ?? "/default-profile.png"}
        alt={user.username}
        className="w-12 h-12 rounded-full"
      />
      </div>
      <div>
        <p className="font-medium">{user.username}</p>
        {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}
      </div>
    </div>
  </Link>
);

export default UserCard;