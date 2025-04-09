
import express from "express"
import {
    getAllExpense,
    updateExpense,
    addExpense,
    deleteExpense
} from "../controllers/expenseController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/add', protect, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/:id", protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

export default router;

