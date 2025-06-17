// src/components/EditProfileForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import Image from "next/image"
import { fetchUserProfile, updateUserProfile } from "lib/api"

export interface EditProfileFormProps {
  username: string
  token: string
  onSaved?: () => void
}

export default function EditProfileForm({
  username,
  token,
  onSaved,
}: EditProfileFormProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // form fields
  const [firstName, setFirstName] = useState("")
  const [lastName,  setLastName]  = useState("")
  const [email,     setEmail]     = useState("")
  const [bio,       setBio]       = useState("")
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")

  // username is editable
  const [newUsername, setNewUsername] = useState(username)

  // avatar
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(null)
  const [avatarFile,    setAvatarFile]    = useState<File | null>(null)
  const [avatarDeleted, setAvatarDeleted] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await fetchUserProfile(username, token)
        setFirstName(p.firstname)
        setLastName(p.lastname)
        setNewUsername(p.username)
        setEmail(p.email ?? "")
        setBio(p.bio ?? "")
        setAvatarUrl(
          p.profile_picture
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${p.profile_picture}`
            : null
        )
      } catch (e) {
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [username, token])

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setAvatarFile(file)
    setAvatarDeleted(false)
    if (file) setAvatarUrl(URL.createObjectURL(file))
  }
  const onDeleteAvatar = () => {
    setAvatarFile(null)
    setAvatarUrl(null)
    setAvatarDeleted(true)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password && password !== confirm) {
      setError("Password and Confirm must match")
      return
    }

    const form = new FormData()
    form.append("firstname", firstName)
    form.append("lastname",  lastName)
    form.append("username",  newUsername)
    form.append("email",     email)
    form.append("bio",       bio)
    if (password) form.append("password", password)
    if (avatarFile) {
      form.append("profile_picture", avatarFile)
    }
    if (avatarDeleted) {
      form.append("delete_profile_picture", "1")
    }

    try {
      await updateUserProfile(form, token)
      if (onSaved) onSaved()
    } catch (err: any) {
      setError(err.message || "Update failed")
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>
      )}

      {/* Avatar */}
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              📷
            </div>
          )}
        </div>
        <div className="space-x-2">
          <label className="cursor-pointer bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </label>
          <button
            type="button"
            onClick={onDeleteAvatar}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete Photo
          </button>
        </div>
      </div>

      {/* Text fields */}
      <Input
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        label="Username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div>
        <label className="block text-sm mb-1">Bio</label>
        <textarea
          className="w-full p-2 rounded bg-gray-200 text-black"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="(leave blank if unchanged)"
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Save
      </button>
    </form>
  )
}

function Input(props: {
  label: string
  type?: string
  value: string
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="block text-sm mb-1">{props.label}</label>
      <input
        type={props.type ?? "text"}
        className="w-full p-2 rounded bg-gray-200 text-black"
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  )
}
