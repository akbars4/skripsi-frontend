// src/pages/profile/edit.tsx
import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
import EditProfileForm from "@/components/EditProfileForm"

export default function EditProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()

  // if not logged in, send to login
  if (!user || !token) {
    if (typeof window !== "undefined") router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 max-w-lg mx-auto">
      <h1 className="text-2xl mb-6">Edit Profile</h1>
      <EditProfileForm
        username={user.username}
        token={token}
        onSaved={() => {
          router.push("/profile")
        }}
      />
    </div>
  )
}
