import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DiaryComment, DiaryEntry } from '@/interfaces/api/ListsOfApiInterface'
import { fetchDiaryComments, fetchDiaryDetail, postDiaryComment } from 'lib/api'

export default function DiaryDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, token } = useAuth()

  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [comments, setComments] = useState<DiaryComment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!router.isReady || !id || Array.isArray(id) || !user || !token) return
    const diaryId = parseInt(id)

    fetchDiaryDetail(user.username, diaryId, token)
      .then(setEntry)
      .catch((err) => {
        console.error("Gagal ambil detail diary →", err)
        setError('Gagal mengambil detail review')
      })

    fetchDiaryComments(diaryId, token)
      .then((data) => {
        console.log("✅ Comments fetched →", data)
        setComments(data)
      })
      .catch((err) => {
        console.error("Gagal ambil komentar →", err)
        setError('Gagal mengambil komentar')
      })
  }, [id, router.isReady, user, token])

  const handleSubmit = async () => {
    if (!id || !token || !commentInput.trim()) return
    const diaryId = parseInt(id as string)

    try {
      const newComment = await postDiaryComment(diaryId, commentInput, token)
      setComments([...comments, newComment])
      setCommentInput('')
    } catch (err) {
      console.error(err)
      setError('Gagal mengirim komentar')
    }
  }

  if (!entry) return <p className="p-6 text-white bg-[#11161D] min-h-screen">Loading diary...</p>

  return (
    <div className="min-h-screen bg-[#11161D] text-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4 mb-6">
          <img
            src={entry.game?.cover_url}
            alt={entry.game?.name || 'Game'}
            className="w-32 h-48 object-cover rounded"
          />
          <div>
            <h2 className="text-xl font-bold mb-1">Review by {user?.username}</h2>
            <p className="text-yellow-400 text-lg">{'★'.repeat(entry.rating)}</p>
            <p className="italic mt-2">“{entry.review}”</p>
            <p className="mt-4 text-sm">Played on <strong>{entry.platform}</strong></p>
          </div>
        </div>

        <div className="mb-6">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Comment your reply....."
            className="w-full p-3 rounded text-black"
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={() => setCommentInput('')}
              className="text-sm px-3 py-1 border rounded border-gray-500 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white text-sm"
            >
              Submit
            </button>
          </div>
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Comments :</h3>
          {comments.map((c) => (
            <div key={c.id} className="mb-4">
              <p className="font-bold uppercase text-sm">
                {c.user?.username || 'Unknown User'}
              </p>
              <p className="text-sm text-gray-300">{c.content || '(No comment)'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
