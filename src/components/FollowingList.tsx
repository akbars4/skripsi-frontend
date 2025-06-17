// src/components/FollowingList.tsx
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { fetchUserFollowing } from "lib/api"
import { FollowingUser } from "@/interfaces/api/ListsOfApiInterface"

export default function FollowingList() {
  const { user, token } = useAuth()
  const [list, setList]       = useState<FollowingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
  if (!user || !token) return
  const username = user.username
  const authToken = token

  async function load() {
    try {
      const data = await fetchUserFollowing(username, authToken)
      setList(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  load()
}, [user, token])

  if (!user) return null
  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error)   return <div className="p-8 text-red-500">{error}</div>

  if (list.length === 0) {
    return (
      <div className="p-8 text-gray-400">
        You’re not following anyone yet.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-700">
      {list.map((f) => {
        const avatarPath = f.profile_picture_url
          ? encodeURI(new URL(f.profile_picture_url).pathname)
          : "/avatars/default.png"

        return (
          <li
            key={f.id}
            className="flex items-center space-x-4 py-4 px-8 hover:bg-gray-800"
          >
            <img
              src={avatarPath}
              alt={f.username}
              className="w-12 h-12 rounded-full object-cover bg-gray-700"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = "/avatars/default.png"
              }}
            />
            <Link href={`/profile/${f.username}`} className="text-lg text-white hover:underline">
              {f.username}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
