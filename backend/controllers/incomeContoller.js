import User from "../models/User.js";
import Income from "../models/Income.js";
import { json } from "express";

// Add Income # CRIS SPRINT 4
export const addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date, recurring, startDate } = req.body;


    if (!source || isNaN(amount) || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0 ) {
      return res.status(400).json({ message: "Please provide value more than 0." });
    }
    const dateStr = (startDate && String(startDate)) || String(date);
    const ymd = dateStr.slice(0,10).split("-").map(n => Number(n));
    const [yy, mm, dd] = ymd; 
    
    if (ymd.length < 3 || isNaN(yy) || isNaN(mm) || isNaN(dd)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }
    
    const canonicalStart = new Date(yy, mm - 1, dd);

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: canonicalStart,
      recurring,
      startDate: canonicalStart
    });

    if (recurring) {

      const recurringIncomes = [];   
      const startMonthIndex = canonicalStart.getMonth();
      const startYear = canonicalStart.getFullYear();
      const startDay = canonicalStart.getDate();


      for (let m = startMonthIndex ; m < 12 ; m++ ) {
        let monthDate = new Date(startYear, m, startDay);
        if (monthDate.getDate() !== startDay) {
          monthDate.setDate(0);
        }
        recurringIncomes.push({
          userId, 
          icon,
          source, 
          amount, 
          date: monthDate,
          recurring: true,
        })
      }
      await Income.insertMany(recurringIncomes);
    } else {
      await newIncome.save();
    }
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Get Income # CRIS SPRINT
export const getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Delete Income # CRIS SPRINT 4
export const deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
// Update Income # SUKHMAN Sprint 4
export const updateIncome = async (req, res) => {
  const userId = req.user.id;
  const incomeId = req.params.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || isNaN(amount) || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0 ) {
      return res.status(400).json({ message: "Please provide value more than 0." });
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      incomeId,
      {
        icon,
        source,
        amount,
        date: new Date(date),
      },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
