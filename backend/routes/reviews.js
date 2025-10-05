import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { handleValidation, reviewCreateRules } from '../middleware/validation.js'
import {
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews
} from '../controllers/reviewController.js'

const router = Router()

router.get('/book/:bookId', getReviewsByBook)
router.post('/book/:bookId', auth, reviewCreateRules, handleValidation, createReview)
router.put('/:id', auth, updateReview)
router.delete('/:id', auth, deleteReview)
router.get('/my', auth, getMyReviews)

export default router
