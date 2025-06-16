// src/pages/profile/[username].tsx
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import GameGrid from "@/components/GameGrid"
import FollowButton from "@/components/FollowButton"
import {
  fetchUserProfile,
  fetchUserFollowing,
  // ProfileResponse,
} from "lib/api"
import { ProfileResponse } from "@/interfaces/api/ListsOfApiInterface"

export default function OtherProfilePage() {
  const router = useRouter()
  const { username: targetUsername } = router.query as { username: string }
  const { user, token } = useAuth()

  const [profile, setProfile]     = useState<ProfileResponse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!targetUsername || !token) return
    setLoading(true)

    // 1) load target’s profile
    fetchUserProfile(targetUsername, token)
      .then((data) => {
        setProfile(data)

        // 2) if I'm not viewing my own, check follow-state
        if (user && user.username !== targetUsername) {
          fetchUserFollowing(user.username, token).then((list) => {
            setIsFollowing(list.some((u) => u.id === data.id))
          })
        }
      })
      .catch((err) => {
        console.error(err)
        router.replace("/404")
      })
      .finally(() => setLoading(false))
  }, [targetUsername, token, user, router])

  if (loading) return <div className="p-8 text-white">Loading…</div>
  if (!profile) return null

  const avatarUrl = profile.profile_picture_url
    ? encodeURI(new URL(profile.profile_picture_url).pathname)
    : null

  // reuse your mapToGame from before
  const mapToGame = (item: {
    id: number
    name: string
    slug: string
    cover: string
  }) => ({
    igdb_id:     item.id,
    name:        item.name,
    slug:        item.slug,
    cover:       item.cover,
    href:        `/games/${item.slug}`,
    rating_count: 0,
  })

  const isOwn = user?.username === profile.username

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex justify-between">
      {/* HEADER */}
      <div className="flex items-center space-x-6 mb-12">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden" >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              📷
            </div>
          )}
        </div>

        {/* Username + Edit/Follow */}
        <div>
          <div className="text-2xl font-semibold flex items-center">
            {profile.username}

            {isOwn ? (
              <button
                onClick={() => router.push("/profile/edit")}
                className="ml-4 text-gray-400 hover:text-white"
              >
                ✏️
              </button>
            ) : (
              <FollowButton
                userId={profile.id}
                token={token!}
                initialFollowing={isFollowing}
                onChange={(v) =>
                  setProfile((p) =>
                    p
                      ? { ...p, follower_count: p.follower_count + (v ? 1 : -1) }
                      : p
                  )
                }
              />
            )}
          </div>

          <p className="mt-2 text-gray-400 max-w-md">{profile.bio || ""}</p>
        </div>
      </div>
       {/* Stats */}
          <div className="flex space-x-8 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.played_game_count}</div>
              <div className="text-sm text-gray-400">Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.diary_count}</div>
              <div className="text-sm text-gray-400">Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.following_count}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.follower_count}</div>
              <div className="text-sm text-gray-400">Follower</div>
            </div>
          </div>
      </div>
      {/* SECTIONS */}
      <h2 className="text-lg font-semibold mb-4">FAVOURITES GAMES</h2>
      <GameGrid games={profile.favorites.map(mapToGame)} />

      <h2 className="text-lg font-semibold mb-4 mt-12">
        RECENTLY PLAYED
      </h2>
      <GameGrid games={profile.recently_played.map(mapToGame)} />
    </div>
  )
}
