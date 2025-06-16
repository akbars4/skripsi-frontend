// pages/search.tsx
import React, { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';

import GameGrid from '@/components/GameGrid';
import FilterButton from '@/components/FilterButton';
import UserCard from '@/components/UserCard';
import ForumCard from '@/components/ForumCard';

import { searchGames, searchUsers, searchForums } from 'lib/api';
import { Game } from '@/interfaces/Game';
import { ForumThread, ProfileResponse } from '@/interfaces/api/ListsOfApiInterface';
import Image from 'next/image';
// import { Game, User, ForumThread } from '@/interfaces/ListOfApiInterface';

const SearchPage: NextPage = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'game' | 'user' | 'forum'>('game');

  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<ProfileResponse[]>([]);
  // const [threads, setThreads] = useState<ForumThread[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      if (filter === 'game') {
        const res = await searchGames(query);
        setGames(res.data);
      } else if (filter === 'user') {
        const res = await searchUsers(query);
        setUsers(res.data);
      } else {
        const res = await searchGames(query);
        console.log('forum-by-game: ',res.data )
        setGames(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-3 mb-6">
        <FilterButton label="Game" active={filter === 'game'} onClick={() => setFilter('game')} />
        <FilterButton label="User" active={filter === 'user'} onClick={() => setFilter('user')} />
        <FilterButton label="Forum" active={filter === 'forum'} onClick={() => setFilter('forum')} />
      </div>

      <p className="mb-2 font-medium">
        {filter === 'game' && 'Game Result:'}
        {filter === 'user' && 'User Result:'}
        {filter === 'forum' && 'Forum Result:'}
      </p>

      {/* GAME */}
      {filter === 'game' && <GameGrid games={games} />}

      {/* USER */}
      {filter === 'user' && (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* FORUM */}
     {filter === 'forum' && (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {games.map((game) => {
      console.log('→ forum item', game)    // ← verify that id & slug exist
      return (
        <Link
          key={game.igdb_id}
          href={{
    pathname: '/forum/[slug]',
    query: { slug: game.slug, threadId: game.igdb_id },
  }}
        >
          <div className="block bg-gray-100 rounded-lg overflow-hidden hover:shadow-md">
            <div className="relative w-full h-32">
              <Image
                src={game.cover || 'https://via.placeholder.com/264x374?text=No+Image'}
                alt={game.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-2">
              <h3 className="font-medium">{game.name}</h3>
            </div>
          </div>
        </Link>
      )
    })}
  </div>
)}
    </div>
  );
};

export default SearchPage;
