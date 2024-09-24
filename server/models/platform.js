import mongoose from "mongoose";

const { Schema, model } = mongoose;

const managerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const platformSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    managers: {
      type: [managerSchema],
      validate: {
        validator: function (managers) {
          // Check for unique manager names within the managers array
          const managerNames = managers.map((manager) => manager.name);
          return managerNames.length === new Set(managerNames).size;
        },
        message: "Manager names must be unique within the platform.",
      },
    },
  },
  { timestamps: true }
);

const Platform = model("Platform", platformSchema);

export default Platform;
