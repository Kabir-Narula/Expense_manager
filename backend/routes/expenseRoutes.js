import express from "express"
import {
    getAllExpense,
    updateExpense
} from "../controllers/expenseController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/get", protect, getAllExpense);
router.put("/put", protect, updateExpense);

export default router;