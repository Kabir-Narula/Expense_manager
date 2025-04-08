// expenseRoutes.js (ESM version)

import express from 'express';
import { addExpense /* , getExpenses, updateExpense, deleteExpense, downloadExpenseExcel */ } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Routes
router.post('/add', protect, addExpense);

// Future Routes:
// router.get('/', protect, getExpenses);
// router.put('/:id', protect, updateExpense);
// router.delete('/:id', protect, deleteExpense);
// router.get('/download', protect, downloadExpenseExcel);

export default router;
