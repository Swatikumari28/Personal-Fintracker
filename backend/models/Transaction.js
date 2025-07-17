const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
