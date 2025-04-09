import express from "express";
import { addIncome, getAllIncome, deleteIncome } from "../controllers/incomeContoller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);


export default router;
