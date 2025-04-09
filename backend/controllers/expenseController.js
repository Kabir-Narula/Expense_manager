
import Expense from "../models/Expense.js"

// Add Expense
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

export const updateExpense = async (req, res) => {
    const id = req.user.id
    try{
        const result = await Expense.updateOne({userId: id}, {$set: req.body}, {upsert: true});
        res.status(200).json(result);
    } catch (err){
        res.status(500).json({message: "Server Error"})
    }
}

