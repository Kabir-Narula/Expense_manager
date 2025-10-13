import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    icon: {type: String},
    category: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    // Recurring support
    recurring: { type: Boolean, default: false },
    startDate: { type: Date },
}, {timestamps: true});

const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
