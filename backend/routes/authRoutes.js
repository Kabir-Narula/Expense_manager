import express from 'express'
import { getUserInfo } from '../controllers/authController.js'; // Named imports

const router = express.Router();

router.get("/:id", getUserInfo);

export default router
