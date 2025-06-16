// src/components/FollowButton.tsx
import { useState } from "react"
import { followUser, unfollowUser } from "lib/api"

interface FollowButtonProps {
  userId: number
  token: string
  initialFollowing: boolean
  onChange?: (newState: boolean) => void
}

export default function FollowButton({
  userId,
  token,
  initialFollowing,
  onChange,
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(initialFollowing)

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(userId, token)
        setFollowing(false)
        onChange?.(false)
      } else {
        await followUser(userId, token)
        setFollowing(true)
        onChange?.(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={
        (following
          ? "bg-red-600 hover:bg-red-500"
          : "bg-blue-600 hover:bg-blue-700") +
        " text-white py-1 px-4 rounded ml-6"
      }
    >
      {loading ? "…" : following ? "Unfollow" : "Follow"}
    </button>
  )
}
