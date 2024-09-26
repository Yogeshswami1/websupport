import createUser from "../models/createUserModel.js";
import bcrypt from "bcrypt";

export const newUser = async (req, res) => {
  try {
    const { name, email, platform, enrollmentNumber, password } = req.body;
    const newUser = new createUser({
      name,
      email,
      platform,
      enrollmentNumber,
      password,
    });
    const savedUser = await newUser.save();
    res.status(200).json({ savedUser });
  } catch (error) {
    console.error("Error creating new user", error);
    res.status(500).json({ error: "Could not create new user" });
  }
};
