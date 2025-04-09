export default router;
import express from "express"
import {
    getAllExpense,
    updateExpense,
    addExpense
} from "../controllers/expenseController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/add', protect, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/put", protect, updateExpense);

export default router;

