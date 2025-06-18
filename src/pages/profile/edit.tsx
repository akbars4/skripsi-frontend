// src/pages/profile/edit.tsx
import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
import EditProfileForm from "@/components/EditProfileForm"

export default function EditProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  if (!user || !token) {
    if (typeof window !== "undefined") router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-[#11161D] text-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

        <EditProfileForm
          username={user.username}
          token={token}
          onSaved={() => {
            router.push("/profile")
          }}
        />
      </div>
    </div>
  )
}
