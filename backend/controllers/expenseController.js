
import Expense from "../models/Expense.js"

// Add Expense  SUKHMAN Sprint 4 As a user, I want to add my expenses to my dashboard, so that I can track them in the app

export const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
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
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense - As a user, I want to delete my expenses, so that I clear it when it is no longer needed.
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};

//  Sean Sprint 4 As a user, I want to view my expenses, so that I review all my expenses.

export const getAllExpense = async (req, res) => {
    const userId = req.user.id
    try {
        console.log(userId)
        const expense = await Expense.find({userId}).sort({date: -1});
        res.status(200).json(expense);

    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
}

//  Sean Sprint 4 As a user, I want to update my expenses, to correct any mistakes that I might have made when inputting my expenses

export const updateExpense = async (req, res) => {
    try{
        const result = await Expense.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(result);
    } catch (err){
        res.status(500).json({message: "Server Error"})
    }
}

