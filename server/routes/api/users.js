import express from 'express'
import { admin, protect } from '../../middleware/authMiddleware.js'
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../../controllers/users.js'

const router = express.Router()

// router.route('/profile')
//   .get(protect, getUserProfle)
//   .put(protect, updateUserProfile)

router.route('/:userId')
  .get(protect, admin, getUser)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)

// No POST route as this is handled in Auth flow during registration at this time
router.route('/')
  .get(protect, admin, getUsers)

export default router
