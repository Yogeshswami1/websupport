import createUser from "../models/createUserModel.js";

export const updateClient = async (req, res) => {
  try {
    const id = req.params.editingClient; // Get client ID from URL parameters
    const { name, email, password } = req.body; // Extract fields from the request body

    // Ensure all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update the client document
    const updatedClient = await createUser.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password,
      },
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Send the updated client back as the response
    res.status(200).json(updatedClient);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating client", error: e.message });
  }
};
