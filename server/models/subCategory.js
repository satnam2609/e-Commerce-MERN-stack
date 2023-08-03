const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [3, "Name is too short"],
      maxLength: [32, "Name is too long"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("Sub-Category", subCategorySchema);

module.exports = SubCategory;
