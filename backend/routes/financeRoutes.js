import express from 'express';
import {
  getYears,
  addYear,
  deleteYear,
  getIncomeByYear,
  getExpenseByYear,
  createIncome,
  updateIncome,
  deleteIncome,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/financeController.js';

const router = express.Router();

// Year management
router.get('/years', getYears);
router.post('/years', addYear);
router.delete('/years/:year', deleteYear);

// Year data
router.get('/income/:year', getIncomeByYear);
router.get('/expense/:year', getExpenseByYear);

// Month-scoped Income
router.post('/:year/:month/incomes', createIncome);
router.patch('/:year/:month/incomes/:incomeId', updateIncome);
router.delete('/:year/:month/incomes/:incomeId', deleteIncome);

// Month-scoped Expense
router.post('/:year/:month/expenses', createExpense);
router.patch('/:year/:month/expenses/:expenseId', updateExpense);
router.delete('/:year/:month/expenses/:expenseId', deleteExpense);

export default router;
