import express from "express";
import { addIncome, getAllIncome, deleteIncome, updateIncome } from "../controllers/incomeContoller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);
router.put("/:id", protect, updateIncome);


export default router;
