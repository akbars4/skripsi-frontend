// // src/pages/profile/following.tsx
// import { useRouter } from "next/router"
// import { useAuth } from "@/context/AuthContext"
// import FollowerList from "@/components/FollowerList"

// export default function ProfileFollowerPage() {
//   const { user } = useAuth()
//   const router   = useRouter()

//   // guard: redirect to login if not authenticated
//   if (!user) {
//     if (typeof window !== "undefined") router.push("/login")
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <h1 className="text-2xl font-semibold p-8">Followers</h1>
//       <FollowerList />
//     </div>
//   )
// }
