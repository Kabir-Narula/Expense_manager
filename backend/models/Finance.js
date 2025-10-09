import mongoose from "mongoose";

const FinanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    years: [{ type: mongoose.Schema.Types.ObjectId, ref: "Year" }],
  },
  { timestamps: true }
);

export default mongoose.model("Finance", FinanceSchema);