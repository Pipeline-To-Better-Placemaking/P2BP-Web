const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { model } = require("./surveys");

/*const area_schema = mongoose.Schema({
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
});*/

//const Areas = (module.exports = mongoose.model("Areas", area_schema));

/*module.exports.updateArea = async function (areaId, newArea) {
  return await Areas.updateOne(
    { _id: areaId },
    {
      $set: {
        title: newArea.title,
        points: newArea.points,
      },
    }
  );
};*/

module.exports.updateArea = async function(areaId, newArea) {
  try {
      const areaRef = firestore.collection('areas').where('_id', '==', areaId).get();

      // Update the area document in Firestore
      await areaRef.set(newArea);

      return true; // Return true to indicate success
  } catch (error) {
      console.error('Error updating area:', error);
      return false; // Return false if an error occurs
  }
}

//if the deReferencing results in a Reference count of 0, then the area gets deleted.  Should never reach this case
/*module.exports.removeRefrence = async function (areaId) {
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
};*/

module.exports.removeReference = async function(areaId) {
  try {
      const areaRef = firestore.collection('areas').where('_id', '==', areaId).get();
      const areaSnapshot = await areaRef.get();

      if (!areaSnapshot.exists) {
          throw new Error('Area not found');
      }

      const areaData = areaSnapshot.data();
      let newAreaData = { ...areaData };

      // Update reference count
      newAreaData.refCount = (newAreaData.refCount || 0) - 1;

      if (newAreaData.refCount <= 0) {
          // Delete the area if reference count is zero or less
          await areaRef.delete();
          return null; // Indicate deletion
      } else {
          // Update the area with the new reference count
          await areaRef.update({ refCount: newAreaData.refCount });
          return newAreaData; // Return the updated area data
      }
  } catch (error) {
      console.error('Error removing area reference:', error);
      throw error; // Rethrow error for handling in the caller function
  }
}

/*module.exports.addRefrence = async function (areaId) {
  try {
    area = await Areas.findById(areaId);
    area.refCount = area.refCount + 1;
    await area.save();
    return area;
  } catch (error) {
    console.log("ADD Area reference causing issue: -----" + error);
  }
};*/

module.exports.addReference = async function(areaId) {
  try {
      const areaRef = firestore.collection('areas').where('_id', '==', areaId).get();
      const areaSnapshot = await areaRef.get();

      if (!areaSnapshot.exists) {
          throw new Error('Area not found');
      }

      const areaData = areaSnapshot.data();
      let newAreaData = { ...areaData };

      // Update reference count
      newAreaData.refCount = (newAreaData.refCount || 0) + 1;

      // Update the area with the new reference count
      await areaRef.update({ refCount: newAreaData.refCount });

      return newAreaData; // Return the updated area data
  } catch (error) {
      console.error('Error adding area reference:', error);
      throw error; // Rethrow error for handling in the caller function
  }
}