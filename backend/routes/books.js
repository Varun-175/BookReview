import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { handleValidation, bookCreateRules } from '../middleware/validation.js'
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  myBooks
} from '../controllers/bookController.js'

const router = Router()

router.get('/', listBooks)
router.get('/my-books', auth, myBooks)
router.get('/:id', getBook)
router.post('/', auth, bookCreateRules, handleValidation, createBook)
router.put('/:id', auth, updateBook)
router.delete('/:id', auth, deleteBook)

export default router
