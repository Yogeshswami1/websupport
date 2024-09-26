import createUser from "../models/createUserModel.js";

export const getAllClients = async (req, res) => {
  try {
    const allusers = await createUser.find({});
    res.status(200).json(allusers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching users" });
  }
};
