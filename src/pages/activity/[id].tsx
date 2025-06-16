// pages/activity/[id].tsx
import { useState, useEffect } from 'react'
import { useRouter }            from 'next/router'
import { parseISO, format }     from 'date-fns'
import { Star }                 from 'lucide-react'
import { useAuth }              from '@/context/AuthContext'
import { ActivityDetail }       from '@/interfaces/api/ListsOfApiInterface'

export default function ActivityPage() {
  const router = useRouter()
  const { id } = router.query as { id?: string }
  const { user, token, loading: authLoading } = useAuth()

  const [activity, setActivity]   = useState<ActivityDetail | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    // tunggu sampai auth siap & id tersedia
    if (authLoading || !id) return

    // kalau belum login, redirect
    if (!user || !token) {
      router.push('/login')
      return
    }

    setLoading(true)
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${encodeURIComponent(user.username)}/diary/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:        'application/json',
        },
      }
    )
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(json => {
        setActivity(json.data)
        setError(null)
      })
      .catch(err => {
        console.error('Fetch activity detail error:', err)
        setError(err.message || 'Gagal memuat data.')
      })
      .finally(() => setLoading(false))
  }, [authLoading, user, token, id, router])

  if (authLoading || loading) {
    return <div className="p-8 text-white">Loading…</div>
  }
  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }
  if (!activity) {
    return <div className="p-8 text-white">Data tidak ditemukan.</div>
  }

  const playedDate = parseISO(activity.played_at)

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-start">
          <img
            src={activity.game.cover_url}
            alt={activity.game.name}
            className="w-32 h-48 object-cover rounded-lg mr-6"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              {activity.game.name}
            </h1>
            <p className="text-gray-400 mb-4">
              Played on {activity.platform} — {format(playedDate, 'dd MMM yyyy')}
            </p>

            {/* Rating */}
            <div className="flex mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < activity.rating ? 'text-yellow-400' : 'text-gray-600'
                  }
                />
              ))}
            </div>

            {/* Review */}
            {activity.review ? (
              <p className="text-gray-200 italic mb-6">{activity.review}</p>
            ) : (
              <p className="text-gray-500 italic mb-6">
                No review provided.
              </p>
            )}
          </div>
        </div>

        {/* Comments */}
        {activity.comments.length > 0 && (
          <div className="mt-10">
            <h3 className="text-white font-semibold mb-4">Comments:</h3>
            <div className="space-y-6">
              {activity.comments.map(c => (
                <div key={c.id}>
                  <p className="text-white font-bold">{c.user.username}</p>
                  <p className="text-gray-300">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
