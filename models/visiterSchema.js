import mongoose from "mongoose";

const tokenHistorySchema = new mongoose.Schema({
  token: { type: String, required: true },
  department: { type: String, required: true },
  purposeOfVisit: { type: String, required: true },
  visitDate: { type: Date, required: true },
  remarks: { type: String },
});

const beneficiarySchema = new mongoose.Schema(
  {
    cnic: { type: String, unique: true, required: true },
    name: { type: String, required: true },

    address: { type: String, required: true },
    purposeOfVisit: { type: String, required: true },
    department: { type: String, required: true },
    token: { type: String, required: true },
    lastVisitedAt: { type: Date, default: Date.now },
    tokenHistory: [tokenHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiary", beneficiarySchema);
