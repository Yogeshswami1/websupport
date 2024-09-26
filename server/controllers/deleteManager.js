import createManager from "../models/createManagerModel.js";
export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = await createManager.findByIdAndDelete(id);
    res.status(200).json({ manager });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};
