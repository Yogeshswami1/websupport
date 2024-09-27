import createManager from "../models/createManagerModel.js"; // Assuming createManager is a Mongoose model
import bcrypt from "bcrypt";
import Platform from "../models/platform.js";

export const newManager = async (req, res) => {
  try {
    const { name, email, platform, password } = req.body;

    const plat = await Platform.findOne({ platform });
    console.log(plat);
    plat.managers.push({ name });
    await plat.save();

    const manager = new createManager({
      name,
      email,
      platform,
      password,
    });

    const savedManager = await manager.save();
    res.status(200).json({ savedManager });
  } catch (error) {
    console.error("Caught error while creating new manager:", error);
    res.status(400).json({ message: "Error in creating new manager", error });
  }
};
