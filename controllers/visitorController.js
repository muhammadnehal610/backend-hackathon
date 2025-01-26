import Beneficiary from "../models/visiterSchema.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { sendEmail } from "../utils/sendsms.js";

// Register Beneficiary at Reception
export const registerBeneficiary = async (req, res) => {
  const { cnic, name, address, purposeOfVisit, department, email } = req.body;

  // Validate input fields
  if (!cnic || !name || !address || !purposeOfVisit || !department || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if beneficiary already exists
    let beneficiary = await Beneficiary.findOne({ cnic });

    if (beneficiary) {
      // Update existing beneficiary
      const oldToken = beneficiary.token;
      const newToken = generateToken();

      beneficiary.token = newToken;
      beneficiary.tokenHistory.push({
        token: oldToken,
        department: beneficiary.department,
        purposeOfVisit: beneficiary.purposeOfVisit,
        visitDate: new Date(),
      });

      beneficiary.purposeOfVisit = purposeOfVisit;
      beneficiary.department = department;
      beneficiary.lastVisitedAt = new Date();

      await beneficiary.save();

      // Send Email with the updated token
      const message = `Dear ${name}, your new token is: ${newToken}. Please visit the ${department} department.`;
      sendEmail(email, "Your Updated Token", message);

      return res.status(200).json({
        message: "Beneficiary details updated successfully.",
        token: newToken,
      });
    } else {
      // Register a new beneficiary
      const token = generateToken();
      beneficiary = new Beneficiary({
        cnic,
        name,
        address,
        purposeOfVisit,
        department,
        token,
        lastVisitedAt: new Date(),
      });

      await beneficiary.save();

      // Send Email with the new token
      const message = `Dear ${name}, your token is: ${token}. Please visit the ${department} department.`;
      sendEmail(email, "Your Registration Token", message);

      return res.status(201).json({
        message: "Beneficiary registered successfully.",
        token,
      });
    }
  } catch (error) {
    console.error("Error in registerBeneficiary:", error);
    res.status(500).json({ message: "Error registering beneficiary.", error: error.message });
  }
};

// Process Beneficiary in Department
export const processBeneficiary = async (req, res) => {
  const { token, departmentName, remarks } = req.body;

  // Validate input fields
  if (!token || !departmentName) {
    return res.status(400).json({ message: "Token and department name are required." });
  }

  try {
    const beneficiary = await Beneficiary.findOne({ token });

    if (!beneficiary) {
      return res.status(404).json({ message: "Invalid token or beneficiary not found." });
    }

    // Log department visit and update status
    beneficiary.tokenHistory.push({
      token,
      department: departmentName,
      purposeOfVisit: beneficiary.purposeOfVisit,
      visitDate: new Date(),
      remarks: remarks || "No remarks provided",
    });

    beneficiary.department = departmentName;
    beneficiary.lastVisitedAt = new Date();

    await beneficiary.save();

    res.status(200).json({
      message: "Beneficiary processed successfully in department.",
      beneficiary: {
        name: beneficiary.name,
        address: beneficiary.address,
        purposeOfVisit: beneficiary.purposeOfVisit,
        department: beneficiary.department,
        tokenHistory: beneficiary.tokenHistory,
        lastVisitedAt: beneficiary.lastVisitedAt,
      },
    });
  } catch (error) {
    console.error("Error in processBeneficiary:", error);
    res.status(500).json({ message: "Error processing beneficiary.", error: error.message });
  }
};
