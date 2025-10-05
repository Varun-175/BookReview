import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import BookCard from './BookCard'

export default function BookList() {
  const { token } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/books', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setBooks(res.data.data.books || [])
      } catch (err) {
        console.error(err)
        setError('Failed to fetch books')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [token])

  if (loading) return <p>Loading…</p>
  if (error) return <p>{error}</p>
  if (!books.length) return <p>No books found.</p>

  return (
    <div className="grid gap-4">
      {books.map((book, idx) => (
  <BookCard key={book._id || book.id || idx} book={book} />
))}
    </div>
  )
}
