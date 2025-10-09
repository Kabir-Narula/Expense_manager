import Finance from "../models/Finance.js";
import Year from "../models/Year.js";
import Month from "../models/Month.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

// NOTE: These are skeleton handlers. Implement logic in Step 3+.
// Expect req.user.id from auth middleware (or replace with explicit userId param during local testing).

// ----- Years -----
export const getYears = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const finance = await Finance.findOne({ userId }).populate({
      path: "years",
      select: "year",
      options: { sort: { year: 1 } },
    });

    if (!finance) return res.json({ years: [] });
    const years = finance.years.map((y) => y.year);
    return res.json({ years });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addYear = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId;
    const { year } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    if (!year || Number.isNaN(parseInt(year))) return res.status(400).json({ message: "Invalid year" });

    let finance = await Finance.findOne({ userId });
    if (!finance) {
      finance = await Finance.create({ userId, years: [] });
    }

    // Check if year already exists for this user
    const existingYear = await Year.findOne({ _id: { $in: finance.years }, year: parseInt(year) });
    if (existingYear) {
      return res.status(200).json({ message: "Year already exists", year: existingYear.year, id: existingYear._id });
    }

    // Create 12 months (0-11)
    const months = await Month.insertMany(
      Array.from({ length: 12 }, (_, idx) => ({ index: idx }))
    );

    const newYear = await Year.create({ year: parseInt(year), months: months.map((m) => m._id) });
    finance.years.push(newYear._id);
    await finance.save();

    return res.status(201).json({ message: "Year created", year: newYear.year, id: newYear._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteYear = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId || req.query.userId;
    const { year } = req.params;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    if (!year || Number.isNaN(parseInt(year))) return res.status(400).json({ message: "Invalid year" });

    const finance = await Finance.findOne({ userId });
    if (!finance) return res.status(404).json({ message: "Finance not found" });

    const yearDoc = await Year.findOne({ _id: { $in: finance.years }, year: parseInt(year) });
    if (!yearDoc) return res.status(404).json({ message: "Year not found" });

    // Delete months and pull references
    if (yearDoc.months?.length) {
      await Month.deleteMany({ _id: { $in: yearDoc.months } });
    }

    finance.years = finance.years.filter((id) => id.toString() !== yearDoc._id.toString());
    await finance.save();

    await Year.deleteOne({ _id: yearDoc._id });

    return res.json({ message: "Year deleted", year: parseInt(year) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ----- Year data (income/expense by year) -----
export const getIncomeByYear = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.query.userId || req.body.userId;
    const { year } = req.params;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    if (!year || Number.isNaN(parseInt(year))) return res.status(400).json({ message: "Invalid year" });

    const finance = await Finance.findOne({ userId });
    if (!finance) return res.json({});

    const yearDoc = await Year.findOne({ _id: { $in: finance.years }, year: parseInt(year) })
      .populate({ path: "months", populate: { path: "incomes" } })
      .lean();

    if (!yearDoc) return res.json({});

    const MONTHS = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const result = {};
    for (const m of yearDoc.months || []) {
      const name = MONTHS[m.index] ?? `M${m.index}`;
      const arr = Array.isArray(m.incomes) ? m.incomes : [];
      // Include both keys for frontend compatibility
      result[name] = { income: arr, expenses: [] };
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getExpenseByYear = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.query.userId || req.body.userId;
    const { year } = req.params;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    if (!year || Number.isNaN(parseInt(year))) return res.status(400).json({ message: "Invalid year" });

    const finance = await Finance.findOne({ userId });
    if (!finance) return res.json({});

    const yearDoc = await Year.findOne({ _id: { $in: finance.years }, year: parseInt(year) })
      .populate({ path: "months", populate: { path: "expenses" } })
      .lean();

    if (!yearDoc) return res.json({});

    const MONTHS = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const result = {};
    for (const m of yearDoc.months || []) {
      const name = MONTHS[m.index] ?? `M${m.index}`;
      const arr = Array.isArray(m.expenses) ? m.expenses : [];
      // Include both keys; 'income' for current ExpenseByYear.jsx compatibility
      result[name] = { income: arr, expenses: arr };
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ----- Month-scoped Income CRUD -----
export const createIncome = async (req, res) => {
  try {
    // TODO: create Income, push into Month.incomes
    return res.status(501).json({ message: "Not implemented: createIncome" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    // TODO: update Income by id
    return res.status(501).json({ message: "Not implemented: updateIncome" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    // TODO: delete Income, pull from Month.incomes
    return res.status(501).json({ message: "Not implemented: deleteIncome" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ----- Month-scoped Expense CRUD -----
export const createExpense = async (req, res) => {
  try {
    // TODO: create Expense, push into Month.expenses
    return res.status(501).json({ message: "Not implemented: createExpense" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    // TODO: update Expense by id
    return res.status(501).json({ message: "Not implemented: updateExpense" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    // TODO: delete Expense, pull from Month.expenses
    return res.status(501).json({ message: "Not implemented: deleteExpense" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
