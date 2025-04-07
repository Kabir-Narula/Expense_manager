import Expense from "../models/Expense.js"

export const getAllExpense = async (req, res) => {
    const userId = req.user.id
    try {
        console.log(userId)
        console.log("e")
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);

    } catch (err) {
        res.status(500).json({message: "Server Error"});
    }
}

export const updateExpense = async (req, res) => {
    const id = req.user.id
    try{
        const result = await Expense.updateOne({userId: id}, {$set: req.body}, {upsert: true});
        res.json(result);
    } catch (err){
        res.status(500).json({message: "Server Error"})
    }


}