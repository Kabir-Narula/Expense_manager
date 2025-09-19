
import Expense from "../models/Expense.js"

// Add Expense # EXPENSE CRUD Sprint 4
export const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || isNaN(amount) || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0 ) {
      return res.status(400).json({ message: "Please provide value more than 0." });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Get Expense # EXPENSE CRUD Sprint 4
export const getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Delete Expense # EXPENSE CRUD Sprint 4
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Update Expense # EXPENSE CRUD Sprint 4
export const updateExpense = async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || isNaN(amount) || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0 ) {
      return res.status(400).json({ message: "Please provide value more than 0." });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        icon,
        category,
        amount,
        date: new Date(date),
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

