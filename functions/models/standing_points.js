const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ObjectId = mongoose.Schema.Types.ObjectId;
/*const points_schema = mongoose.Schema({
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
});*/

/*const Standing_Points = (module.exports = mongoose.model(
  "Standing_Points",
  points_schema
));*/

//Old Mongo
/*module.exports.updatePoint = async function (pointId, newPoint) {
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
};*/

module.exports.updatePoint = async function(pointId, newPoint) {
  try {
      const pointRef = firestore.collection('standing_points').where('_id', '==', pointId).get();

      // Update the point document in Firestore
      await pointRef.update({
          title: newPoint.title,
          longitude: newPoint.longitude,
          latitude: newPoint.latitude
      });

      return true; // Return true to indicate success
  } catch (error) {
      console.error('Error updating point:', error);
      return false; // Return false if an error occurs
  }
}

//if the deReferencing results in a Reference count of 0, then the standing point gets deleted.  Should never reach this case
/*module.exports.removeRefrence = async function (pointId) {
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
};*/

module.exports.removeReference = async function(pointId) {
  try {
      const pointRef = firestore.collection('standing_points').where('_id', '==', pointId).get();
      const pointSnapshot = await pointRef.get();

      if (!pointSnapshot.exists) {
          throw new Error('Standing point not found');
      }

      const pointData = pointSnapshot.data();
      let newPointData = { ...pointData };

      // Update reference count
      newPointData.refCount = (newPointData.refCount || 0) - 1;

      if (newPointData.refCount <= 0) {
          // Delete the standing point if reference count is zero or less
          await pointRef.delete();
          return null; // Indicate deletion
      } else {
          // Update the standing point with the new reference count
          await pointRef.update({ refCount: newPointData.refCount });
          return newPointData; // Return the updated point data
      }
  } catch (error) {
      console.error('Error removing standing point reference:', error);
      throw error; // Rethrow error for handling in the caller function
  }
}

/*module.exports.addRefrence = async function (pointId) {
  try {
    point = await Standing_Points.findById(pointId);
    point.refCount = point.refCount + 1;
    let newPoint = await point.save();
    return newPoint;
  } catch (error) {
    console.log("ADD Standing Point reference causing issue: -----" + error);
  }
};*/

module.exports.addReference = async function(pointId) {
  try {
      const pointRef = firestore.collection('standing_points').where('_id', '==', pointId).get();
      const pointSnapshot = await pointRef.get();

      if (!pointSnapshot.exists) {
          throw new Error('Standing point not found');
      }

      const pointData = pointSnapshot.data();
      let newPointData = { ...pointData };

      // Update reference count
      newPointData.refCount = (newPointData.refCount || 0) + 1;

      // Update the standing point with the new reference count
      await pointRef.update({ refCount: newPointData.refCount });

      return newPointData; // Return the updated point data
  } catch (error) {
      console.error('Error adding standing point reference:', error);
      throw error; // Rethrow error for handling in the caller function
  }
}
