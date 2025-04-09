import User from "../models/User.js";
import Income from "../models/Income.js";
import { json } from "express";

// Add Income
export const addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount) {
      return res.status(400).json({ message: " All field are required" });
    }

    const newIncome = new Income({ userId, icon, source, amount, date: new Date(date) });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Get Income
export const getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Delete Income
export const deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
