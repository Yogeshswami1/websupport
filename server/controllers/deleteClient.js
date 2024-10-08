import createUser from "../models/createUserModel.js";

export const deleteClient = async (req, res) => {
  const id = req.params.clientId; // Get client ID from URL parameters

  try {
    const updatedClient = await createUser.findByIdAndDelete(id);
    res.status(200).json(updatedClient);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating client", error: e.message });
  }
};
