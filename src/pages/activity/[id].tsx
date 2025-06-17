import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DiaryComment, DiaryEntry } from '@/interfaces/api/ListsOfApiInterface'
// import { DiaryComment } from '@/interfaces/api/DiaryComment'
import { fetchDiaryComments, postDiaryComment } from 'lib/api'

export default function DiaryDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, token } = useAuth()

  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [comments, setComments] = useState<DiaryComment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || Array.isArray(id)) return
    const diaryId = parseInt(id)

    // fetch detail diary (saat ini bisa dummy hardcoded sementara)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user?.username}/diary`)
      .then(res => res.json())
      .then(json => {
        const found = json.data.find((d: DiaryEntry) => d.id === diaryId)
        setEntry(found || null)
      })

    fetchDiaryComments(diaryId).then(setComments).catch(console.error)
  }, [id, user?.username])

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

  if (!entry) return <p className="p-6">Loading diary...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-4 mb-6">
        <img
          src={entry.game.cover_url}
          alt={entry.game.name}
          className="w-32 h-48 object-cover rounded"
        />
        <div>
          <h2 className="text-xl font-bold mb-1">Review by {user?.username}</h2>
          <p className="text-yellow-400 text-lg">{'★'.repeat(entry.rating)}</p>
          <p className="italic mt-2">“{entry.review}”</p>
          <p className="mt-4 text-sm">Played on <strong>{entry.platform}</strong></p>
          <p className="text-sm">
            Completed in <strong>{entry.replay_count ?? 0 * 10 + 87}</strong> hours of gameplay
          </p>
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
          <button onClick={() => setCommentInput('')}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
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
            <p className="font-bold uppercase text-sm">{c.user.username}</p>
            <p className="text-sm">{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
