const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { model } = require("./surveys");

const area_schema = mongoose.Schema({
  title: String,
  points: [
    {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  ],
  refCount: {
    type: Number,
    required: true,
    default: 1,
  },
});

const Areas = (module.exports = mongoose.model("Areas", area_schema));

module.exports.updateArea = async function (areaId, newArea) {
  return await Areas.updateOne(
    { _id: areaId },
    {
      $set: {
        title: newArea.title,
        points: newArea.points,
      },
    }
  );
};

//if the deReferencing results in a Reference count of 0, then the area gets deleted.  Should never reach this case
module.exports.removeRefrence = async function (areaId) {
  try {
    area = await Areas.findById(areaId);
    area.refCount = area.refCount - 1;

    if (area.refCount <= 0) {
      return await Areas.findByIdAndDelete(areaId);
    } else {
      return await area.save();
    }
  } catch (error) {
    console.log("REMOVE Area reference causing issue: -----" + error);
  }
};

module.exports.addRefrence = async function (areaId) {
  try {
    area = await Areas.findById(areaId);
    area.refCount = area.refCount + 1;
    await area.save();
    return area;
  } catch (error) {
    console.log("ADD Area reference causing issue: -----" + error);
  }
};
