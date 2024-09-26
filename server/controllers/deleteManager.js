import createManager from "../models/createManagerModel.js";
import Platform from "../models/platform.js";

export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the manager by ID from the `createManager` collection
    const manager = await createManager.findByIdAndDelete(id);

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const updatedPlatform = await Platform.updateOne(
      { "managers.name": manager.name },
      { $pull: { managers: { name: manager.name } } }
    );

    if (updatedPlatform.modifiedCount === 0) {
      return res.status(404).json({ message: "Manager not found in Platform" });
    }

    res.status(200).json({ message: "Manager deleted successfully", manager });
  } catch (error) {
    console.error("Error deleting manager:", error);
    res.status(500).json({ message: "Error deleting manager" });
  }
};
