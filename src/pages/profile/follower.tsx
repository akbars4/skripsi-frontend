import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
import FollowersList from "@/components/FollowerList"

export default function ProfileFollowersPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Guard: redirect to login if not authenticated
  if (!user) {
    if (typeof window !== "undefined") router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-[#11161D] text-gray-100">
      <h1 className="text-2xl font-semibold p-8">Followers</h1>
      <FollowersList />
    </div>
  )
}
