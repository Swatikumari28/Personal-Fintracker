const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
  try {
    const { amount, description, type } = req.body;
    const userId = req.user.id;

    const newTransaction = new Transaction({
      amount,
      description,
      type,
      user: userId,
    });

    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Create Transaction Error:", error.message);
    res.status(500).json({ message: "Error creating transaction" });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error.message);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getSummary,
};
