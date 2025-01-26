// routes/visitorRoutes.js
import express from "express";
import { registerBeneficiary,processBeneficiary  } from "../controllers/visitorController.js";

const router = express.Router();

// Register Visitor
router.post("/register", registerBeneficiary);

// Confirm Visitor Token
router.post("/confirm", processBeneficiary);

export default router;
