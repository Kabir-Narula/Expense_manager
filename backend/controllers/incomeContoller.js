import User from "../models/User.js";
import Income from "../models/Income.js";
import { json } from "express";
import Account from "../models/Account.js";

// Add Income # CRIS SPRINT 4
export const addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date, recurring, startDate, tags } = req.body;


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

    // Process tags: convert comma-separated string to array, trim whitespace
    const tagsArray = tags 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: canonicalStart,
      tags: tagsArray,
      recurring,
      startDate: canonicalStart,
      accountId: req.account?._id,
      createdBy: req.user._id,
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
          tags: tagsArray,
          date: monthDate,
          recurring: true,
          accountId: req.account?._id,
          createdBy: req.user._id,
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
    const accountId = req.account?._id;
    const { createdBy, tags } = req.query;
    const query = [];
    if (accountId) {
      query.push({ accountId });
    }
    // Legacy: include personal legacy records for personal context
    if (!accountId || (req.account && req.account.type === "personal")) {
      query.push({ accountId: { $exists: false }, userId: req.user._id });
    }
    const filter = query.length ? { $or: query } : {};
    if (createdBy) {
      filter.createdBy = createdBy;
    }
    // Add tag filtering
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    const incomes = await Income.find(filter).sort({ date: -1 }).populate("createdBy", "fullName email");
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Delete Income # CRIS SPRINT 4
export const deleteIncome = async (req, res) => {
  try {
    const doc = await Income.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Income not found" });

    // Check account ownership: record must belong to current account (or legacy personal)
    const inAccount = req.account && doc.accountId && doc.accountId.toString() === req.account._id.toString();
    const legacyPersonal = (!doc.accountId && req.account && req.account.type === "personal" && doc.userId.toString() === req.user._id.toString());
    if (!inAccount && !legacyPersonal) return res.status(403).json({ message: "Forbidden" });

    // Permission: owner can delete any; member can delete own only
    const isOwner = req.account && req.account.owner.toString() === req.user._id.toString();
    const isCreator = (doc.createdBy && doc.createdBy.toString() === req.user._id.toString()) || (legacyPersonal);
    if (!isOwner && !isCreator) return res.status(403).json({ message: "Not allowed" });

    await doc.deleteOne();
    res.status(200).json({ message: "Income Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};
// Update Income # SUKHMAN Sprint 4
export const updateIncome = async (req, res) => {
  const userId = req.user.id;
  const incomeId = req.params.id;

  try {
    const { icon, source, amount, date, tags } = req.body;

    if (!source || isNaN(amount) || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0 ) {
      return res.status(400).json({ message: "Please provide value more than 0." });
    }

    const existing = await Income.findById(incomeId);
    if (!existing) return res.status(404).json({ message: "Income not found" });

    // Check account membership and scope
    const inAccount = req.account && existing.accountId && existing.accountId.toString() === req.account._id.toString();
    const legacyPersonal = (!existing.accountId && req.account && req.account.type === "personal" && existing.userId.toString() === req.user._id.toString());
    if (!inAccount && !legacyPersonal) return res.status(403).json({ message: "Forbidden" });

    // Permission: owner can edit any; member can edit own
    const isOwner = req.account && req.account.owner.toString() === req.user._id.toString();
    const isCreator = (existing.createdBy && existing.createdBy.toString() === req.user._id.toString()) || legacyPersonal;
    if (!isOwner && !isCreator) return res.status(403).json({ message: "Not allowed" });

    // Process tags: convert comma-separated string to array, trim whitespace
    const tagsArray = tags 
      ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0))
      : [];

    existing.icon = icon;
    existing.source = source;
    existing.amount = amount;
    existing.date = new Date(date);
    existing.tags = tagsArray;
    await existing.save();
    res.status(200).json(existing);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
