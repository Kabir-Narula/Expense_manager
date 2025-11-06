
import Expense from "../models/Expense.js"

// Add Expense # EXPENSE CRUD Sprint 4
export const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date, recurring, startDate, tags } = req.body;

    if (!category || isNaN(amount) || !date) {
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
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: canonicalStart,
      tags: tagsArray,
      recurring,
      startDate: canonicalStart,
      accountId: req.account?._id,
      createdBy: req.user._id,
    });

    if (recurring) {
      const recurringExpenses = [];
      const startMonthIndex = canonicalStart.getMonth();
      const startYear = canonicalStart.getFullYear();
      const startDay = canonicalStart.getDate();
      for (let m = startMonthIndex ; m < 12 ; m++) {
        let monthDate = new Date(startYear, m, startDay);
        if (monthDate.getDate() !== startDay) {
          monthDate.setDate(0);
        }
        recurringExpenses.push({
          userId,
          icon,
          category,
          amount,
          tags: tagsArray,
          date: monthDate,
          recurring: true,
          accountId: req.account?._id,
          createdBy: req.user._id,
        });
      }
      
      await Expense.insertMany(recurringExpenses);
    } else {
      await newExpense.save();
    }
    res.status(200).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Get Expense # EXPENSE CRUD Sprint 4
export const getAllExpense = async (req, res) => {
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
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    const expenses = await Expense.find(filter).sort({ date: -1 }).populate("createdBy", "fullName email");
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Delete Expense # EXPENSE CRUD Sprint 4
export const deleteExpense = async (req, res) => {
  try {
    const doc = await Expense.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Expense not found" });

    const inAccount = req.account && doc.accountId && doc.accountId.toString() === req.account._id.toString();
    const legacyPersonal = (!doc.accountId && req.account && req.account.type === "personal" && doc.userId.toString() === req.user._id.toString());
    if (!inAccount && !legacyPersonal) return res.status(403).json({ message: "Forbidden" });

    const isOwner = req.account && req.account.owner.toString() === req.user._id.toString();
    const isCreator = (doc.createdBy && doc.createdBy.toString() === req.user._id.toString()) || legacyPersonal;
    if (!isOwner && !isCreator) return res.status(403).json({ message: "Not allowed" });

    await doc.deleteOne();
    res.status(200).json({ message: "Expense Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};

// Update Expense # EXPENSE CRUD Sprint 4
export const updateExpense = async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  try {
    const { icon, category, amount, date, tags } = req.body;

    if (!category || isNaN(amount) || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0 ) {
      return res.status(400).json({ message: "Please provide value more than 0." });
    }

    const existing = await Expense.findById(expenseId);
    if (!existing) return res.status(404).json({ message: "Expense not found" });

    const inAccount = req.account && existing.accountId && existing.accountId.toString() === req.account._id.toString();
    const legacyPersonal = (!existing.accountId && req.account && req.account.type === "personal" && existing.userId.toString() === req.user._id.toString());
    if (!inAccount && !legacyPersonal) return res.status(403).json({ message: "Forbidden" });

    const isOwner = req.account && req.account.owner.toString() === req.user._id.toString();
    const isCreator = (existing.createdBy && existing.createdBy.toString() === req.user._id.toString()) || legacyPersonal;
    if (!isOwner && !isCreator) return res.status(403).json({ message: "Not allowed" });

    // Process tags: convert comma-separated string to array, trim whitespace
    // Process tags
    const tagsArray = tags 
      ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0))
      : [];

    existing.icon = icon;
    existing.category = category;
    existing.amount = amount;
    existing.date = new Date(date);
    existing.tags = tagsArray;
    await existing.save();
    res.status(200).json(existing);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

