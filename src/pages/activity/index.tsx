
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DiaryEntry } from '@/interfaces/api/ListsOfApiInterface';
import { fetchUserDiary } from 'lib/api';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

export default function DiaryPage() {
  const { user, token } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()


  useEffect(() => {
    if (!user || !token) return;

    fetchUserDiary(user.username, token)
      .then(setEntries)
      .catch(() => setError('Gagal memuat diary'));
  }, [user, token]);

  if (!user || !token) return <p>Belum login</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (entries === null) return <p>Loading…</p>;
  if (entries.length === 0) return <p>Belum ada entri diary.</p>;

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Diary</h1>
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-gray-400 uppercase text-sm border-b border-gray-700">
            <th className="py-2">Month</th>
            <th>Day</th>
            <th>Games</th>
            <th>Released</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const playedDate = new Date(entry.played_at);
            return (
              <tr key={entry.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="py-3 font-bold text-blue-200">
                  {format(playedDate, 'LLL').toUpperCase()}<br />
                  <span className="text-xs">{format(playedDate, 'yyyy')}</span>
                </td>
                <td>{format(playedDate, 'dd')}</td>
                <td className="flex items-center gap-2 py-2">
                  <img src={entry.game.cover_url} alt={entry.game.name} className="w-10 h-10 rounded object-cover" />
                  <span>{entry.game.name}</span>
                </td>
                <td>{entry.game.released || '-'}</td>
                <td>{'★'.repeat(entry.rating)}</td>
                <td>
                  <button title="Lihat review" className="hover:text-blue-400 " onClick={() => router.push(`/activity/${entry.id}`)}>
                    📝
                  </button>
                </td>
                <td>
                  <button className="mr-2 hover:text-yellow-400">✏️</button>
                  <button className="hover:text-red-500">🗑️</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
