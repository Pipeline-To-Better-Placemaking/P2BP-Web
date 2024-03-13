//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
module.exports.createMaps = async function(req, MapName, CollectionName) {
    //collect user, project, collection, timeSlots, authorized boolean
    console.log("IN MOVING_MAPS ROUTE!");
    const user = await req.user;
    const projectId = req.body.project;
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const collectionId = req.body.collection;
    const timeSlots = await req.body.timeSlots;
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    //check if admin, else error
    if(authorized) {
        //if there are time slots
            //for each timeslot
                //create a map object
                //map = basicDBfoos.addObj (newMap, ___MAPS)
                //arrayDBfoos.addArrayElement(collection id, arrayName, collectionName, entryID)
                //add reference for each standingPoint in the model
                //serverResponse - Created & json of collection made; res.status(201).json(await basicDBfoos.getObj(req.body.collection, MOVING_COLS));
        if(timeSlots && timeSlots.length > 0) {
            console.log("true")
            for(let i = 0; i < timeSlots.length; i++){
                let slot = timeSlots[i]

                let newMap = {
                    _id: basicDBfoos.createId(),
                    title: slot.title,
                    standingPoints: slot.standingPoints._id,
                    researchers: slot.researchers,
                    project: projectId,
                    sharedData: collectionId,
                    date: slot.date,
                    maxResearchers: slot.maxResearchers,
                    maps: [],
                    data: [],
                }

                //create new map with method from _map models and add ref to its parent collection.
                const map = await basicDBfoos.addObj(newMap, MapName);
                await arrayDBfoos.addArrayElement(collectionId, "maps", CollectionName, newMap._id);

                //add references of points used in Points model.
                for (j = 0; j < map.standingPoints.length; j++) {
                    await refDBfoos.addReference(map.standingPoints[j]._id, STANDING_POINTS);
                }
                console.log("test");
                res.status(201).json(await basicDBfoos.getObj(collectionId, CollectionName));
            }
        }
        else {
            //no time slots
            //create standingpoints[]
            //create newMap
            //add newMap
            //add newMap to collection array
            //add reference for each standing point
            //serverResponse - created & json of newMap
            let standingPoints = new Array(req.body.standingPoints.length);
            for (let i = 0; i < req.body.standingPoints.length; i++) {
                standingPoints[i] = req.body.standingPoints[i]._id;
            }
            const newMap = {
                _id: basicDBfoos.createId(),
                title: req.body.title,
                standingPoints: standingPoints,
                researchers: req.body.researchers,
                project: req.body.project,
                sharedData: req.body.collection,
                date: req.body.date,
                maxResearchers: req.body.maxResearchers,
                maps: [],
                data: [],
            }

            const map = await basicDBfoos.addObj(newMap, MapName);
            // console.log(collectionId);
            await arrayDBfoos.addArrayElement(collectionId, "maps", MapName, newMap._id);
            // await Moving_Collection.addActivity(req.body.collection,map._id)
            for (i = 0; i < newMap.standingPoints.length; i ++){
                await refDBfoos.addReference(newMap.standingPoints[i], STANDING_POINTS);
            }
            console.log("end");
            res.status(201).json(map)

        }
        //break out and respond that it was made & empty json
        res.status(201).json();
    }
    else{
        throw new Error('You do not have permision to perform this operation');
    }
}
//route gets all map data, including any collection data.
module.exports.getMapData = async function(input) {
}
//route signs team member up to a time slot.
module.exports.assignTimeSlot = async function(input) {
}
//route reverses sign up to a time slot.
module.exports.clearTimeSlot = async function(input) {
}
//route edits time slot information when updating a map
module.exports.editTimeSlot = async function(input) {
}
//route deletes a map from a test collection
module.exports.deleteMap = async function(input) {
}
//route adds test data to its relevant time slot
module.exports.addTestData = async function(input) {
}
//route edits any already created tested time slots.  Essentially redoing a test run for a time slot
module.exports.editTestedTimeSlot = async function(input) {
}
//route deletes an individual time slot from a map
module.exports.deleteTimeSlot = async function(input) {
}