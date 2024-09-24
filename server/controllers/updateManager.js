import createManager from "../models/createManagerModel.js";
import bcrypt from "bcryptjs";

export const updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Find the manager by id
    const manager = await createManager.findById(id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Update the fields if provided
    if (name) manager.name = name;
    if (email) manager.email = email;

    // Hash the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      manager.password = await bcrypt.hash(password, salt);
    }

    // Save the updated manager
    const updatedManager = await manager.save();
    res.status(200).json(updatedManager);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating manager", error: e.message });
  }
};
