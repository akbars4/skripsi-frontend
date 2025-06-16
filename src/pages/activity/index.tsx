// pages/diary/index.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, FileText, Edit, Trash2 } from 'lucide-react'
import { parseISO, format } from 'date-fns'
import { DiaryEntry } from '@/interfaces/api/ListsOfApiInterface'

export default function DiaryIndex() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string|null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('token')     // sesuai key-mu
    if (!token) {
      setError('Belum login')
      setLoading(false)
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diary/create`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setDiaries(json.data)
      })
      .catch(err => {
        console.error(err)
        setError('Gagal memuat diary')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading…</p>
  if (error)   return <p className="text-red-500">{error}</p>

  // sorting desc by played_at
  const sorted = [...diaries].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  )

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Diary</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* …thead sama rendering row seperti sebelumnya… */}
            <tbody>
              {sorted.map(entry => {
                const date = parseISO(entry.played_at)
                const monthYear = format(date, 'MMM yyyy').toUpperCase()
                const day       = format(date, 'dd')
                return (
                  <tr key={entry.id} className="border-b border-gray-700">
                    <td className="py-4">
                      <span className="bg-blue-800 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        {monthYear}
                      </span>
                    </td>
                    <td className="py-4 text-white font-bold text-lg">{day}</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <img
                          src={entry.game.cover_url}
                          alt={entry.game.name}
                          className="w-12 h-16 object-cover rounded mr-4"
                        />
                        <span className="text-white font-medium">
                          {entry.game.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-200">
                      {entry.game.released ?? '-'}
                    </td>
                    <td className="py-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < entry.rating
                                ? 'text-yellow-400'
                                : 'text-gray-600'
                            }
                          />
                        ))}
                      </div>
                    </td>
                    <div className='flex flex-row items-center'>
                    <td  className=" py-4">
                      <Link href={`/activity/${entry.id}`}>
                        <div className="text-gray-400 hover:text-white">
                          <FileText size={18} />
                        </div>
                      </Link>
                    </td>
                    <td className="py-4">
                      <Link href={`/activity/${entry.id}/edit`}>
                        <div className="text-gray-400 hover:text-white">
                          <Edit size={18} />
                        </div>
                      </Link>
                     
                    </td>
                    <td className='py-4'>
                         <button
                        onClick={async () => {
                          if (!confirm('Hapus entry ini?')) return
                          await fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diary/${entry.id}`,
                            {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                              },
                            }
                          )
                          window.location.reload()
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                    </div>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
