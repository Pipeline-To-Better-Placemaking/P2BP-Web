const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ObjectId = mongoose.Schema.Types.ObjectId;
const points_schema = mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },
  refCount: {
    type: Number,
    required: true,
    default: 1,
  },

  title: String,
});

const Standing_Points = (module.exports = mongoose.model(
  "Standing_Points",
  points_schema
));

module.exports.updatePoint = async function (pointId, newPoint) {
  return await Standing_Points.updateOne(
    { _id: pointId },
    {
      $set: {
        title: newPoint.title,
        longitude: newPoint.longitude,
        latitude: newPoint.latitude,
      },
    }
  );
};

//if the deReferencing results in a Reference count of 0, then the standing point gets deleted.  Should never reach this case
module.exports.removeRefrence = async function (pointId) {
  try {
    point = await Standing_Points.findById(pointId);
    point.refCount = point.refCount - 1;
    if (point.refCount <= 0) {
      return await Standing_Points.findByIdAndDelete(pointId);
    } else {
      let newPoint = await point.save();
      return newPoint;
    }
  } catch (error) {
    console.log("REMOVE Standing Point reference causing issue: -----" + error);
  }
};

module.exports.addRefrence = async function (pointId) {
  try {
    point = await Standing_Points.findById(pointId);
    point.refCount = point.refCount + 1;
    let newPoint = await point.save();
    return newPoint;
  } catch (error) {
    console.log("ADD Standing Point reference causing issue: -----" + error);
  }
};
