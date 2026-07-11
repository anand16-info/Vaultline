import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Loan name is required"],
      trim: true,
      maxlength: 80,
    },
    principal: {
      type: Number,
      required: [true, "Principal amount is required"],
      min: 1,
    },
    interestRate: {
      // annual percentage
      type: Number,
      required: [true, "Interest rate is required"],
      min: 0,
    },
    tenureMonths: {
      type: Number,
      required: [true, "Tenure in months is required"],
      min: 1,
    },
    emi: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
