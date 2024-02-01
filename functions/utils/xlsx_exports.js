const XLSX = require('xlsx')


//takes in data from projects route and receives objects from helper functions.  
//converts those into xlsx and returns them to projects
projectExport = function(stationaryData, movingData, soundData, natureData, lightData, orderData, accessData,
                        boundariesData, programData, sectionData){

    var stationary = []
    var moving = []
    var order = []
    var boundaries = []
    var lighting = []
    var nature = []
    var sound = []
    var access = []
    var program = []
    var section = []
    var workbook = XLSX.utils.book_new();


        
        stationary = stationToXLSX(stationaryData)
        var worksheetstat = XLSX.utils.json_to_sheet(stationary);
        XLSX.utils.book_append_sheet(workbook, worksheetstat, 'PeopleInPlace');

        moving = movingToXLSX(movingData)
        var worksheetmov = XLSX.utils.json_to_sheet(moving)
        XLSX.utils.book_append_sheet(workbook, worksheetmov, 'PeopleInMotion');

        sound = soundToXLSX(soundData)
        var worksheetsound = XLSX.utils.json_to_sheet(sound)
        XLSX.utils.book_append_sheet(workbook, worksheetsound, 'AcousticalProfile');

        nature = natureToXLSX(natureData)
        var worksheetnat = XLSX.utils.json_to_sheet(nature)
        XLSX.utils.book_append_sheet(workbook, worksheetnat, 'NaturePrevalence');

        lighting = lightToXLSX(lightData)
        var worksheetlight = XLSX.utils.json_to_sheet(lighting)
        XLSX.utils.book_append_sheet(workbook, worksheetlight, 'LightingProfile');

        order = orderToXLSX(orderData)
        var worksheetord = XLSX.utils.json_to_sheet(order)
        XLSX.utils.book_append_sheet(workbook, worksheetord, 'AbsenceOfOrder');

        boundaries = boundToXLSX(boundariesData)
        var worksheetbounds = XLSX.utils.json_to_sheet(boundaries);
        XLSX.utils.book_append_sheet(workbook, worksheetbounds, 'SpatialBoundaries');
        
        program = programToXLSX(programData)
        var worksheetprograms = XLSX.utils.json_to_sheet(program);
        XLSX.utils.book_append_sheet(workbook, worksheetprograms, 'IdentifyingProgram');

        access = accessToXLSX(accessData)
        var worksheetaccess = XLSX.utils.json_to_sheet(access)
        XLSX.utils.book_append_sheet(workbook, worksheetaccess, 'IdentifyingAccess');

        section = sectionToXLSX(sectionData)
        var worksheetsection = XLSX.utils.json_to_sheet(section);
        XLSX.utils.book_append_sheet(workbook, worksheetsection, 'SectionCutter');


    // Excel Format
    const xlsx_file = XLSX.write(workbook,{ bookType: "xlsx", type: "buffer" });
    return xlsx_file

}

function stationToXLSX(data){

    try{

        var stationary = []
        var obj = {}

        for(var i = 0; i < data.stationaryCollections.length; i++){
            var collection = data.stationaryCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                            for(var k = 0; k < map.data.length; k++){
                                var entry = map.data[k]

                                obj = { Category: `${collection.title}(${j})`, 
                                        Date: map.date, 
                                        Time: getDigitalTime(entry.time), 
                                        Point: k, 
                                        Posture: entry.posture, 
                                        Age: entry.age, 
                                        Gender: entry.gender, 
                                        Activity: entry.activity
                            }

                        }
                    }
                }
            }
        }

        return stationary
    }catch(error){
        console.log("stationary fails " + error)
    }
}


function movingToXLSX(data){

    try{
        var moving = []
        var obj = {}

        for(var i = 0; i < data.movingCollections.length; i++){
            var collection = data.movingCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            obj = { Category: `${collection.title}(${j})`, 
                                    Date: map.date, 
                                    Time: getDigitalTime(entry.time), 
                                    Point: k, 
                                    Mode: entry.mode
                        }
                    }

                        moving.push(obj)
                        }
                }
            }
        }


        return moving
    }catch(error){
        console.log("moving fails " + error)
    }
}

function soundToXLSX(data){

    try{
        var sound = []
        var obj = {}


        for(var i = 0; i < data.soundCollections.length; i++){
            var collection = data.soundCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            obj = { Category: `${collection.title}(${j})`, 
                                    Date: map.date, 
                                    Time: getDigitalTime(entry.time), 
                                    Point: k, 
                                    'Average (dB)': entry.average,
                                    'Sound Types/Sources': parseArrAsString(entry.sound_type)
                            }

                            sound.push(obj)
                        }
                    }
                }
            }
        }
        return sound
    }
    catch(error){
        console.log("sound fails " + error)
    }
}


//we are iterating through a data which contains array elements and printing them out individually
//in order to better identify these points, we will use the entry index alongside their individual 
//array index.  e.g. the first index in the water array will have which belongs to the second data
//index will be written as "1 w(0)"
function natureToXLSX(data){

    try{
        var nature = []
        var obj = {}

        for(var i = 0; i < data.natureCollections.length; i++){
            var collection = data.natureCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            obj = { Category: `${collection.title}(${j})`, 
                                    Date: map.date, 
                                    Time: getDigitalTime(entry.time), 
                                    Point: k,
                                    'Weather (temp/sky)': entry.weather.temperature, 
                                    'Kind/Area (ft/sq.ft)': '',
                                    Description: ''
                            }

                            nature.push(obj)

                            for (var l = 0; l < entry.animal.length; l++){
                                var animal = entry.animal[l]

                                obj = { Category: `${collection.title}(${j})`, 
                                        Date: map.date, 
                                        Time: getDigitalTime(entry.time), 
                                        Point: `a(${l})`,
                                        'Weather (temp/sky)': '', 
                                        'Kind/Area (ft/sq.ft)': animal.kind,
                                        Description: animal.description 
                                }


                                nature.push(obj)
                            }
                            for (var m = 0; m < entry.water.length; m++){
                                var water = entry.water[m]

                                obj = { Category: `${collection.title}(${j})`, 
                                        Date: map.date, 
                                        Time: getDigitalTime(entry.time), 
                                        Point: `w(${m})`,
                                        'Weather (temp/sky)': '', 
                                        'Kind/Area (ft/sq.ft)': water.area,
                                        Description: water.description 
                                        
                                }
                                nature.push(obj)
                            }
                        }
                    }
                }
            }
        }

        return nature
    }
    catch(error){
        console.log("nature fails " + error)
    }
}



function lightToXLSX(data){

    try{
        var light = []
        var obj = {}

        for(var i = 0; i < data.lightCollections.length; i++){
            var collection = data.lightCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                                var entry = map.data[k]

                                for (var l = 0; l < entry.points.length; l++){
                                    var points = entry.points[l]

                                    obj = { Category: `${collection.title}(${j})`, 
                                            Date: map.date, 
                                            Time: getDigitalTime(entry.time), 
                                            Point: l, 
                                            Description: points.light_description
                                }

                                light.push(obj)
                            }
                        }
                    }
                }
            }
        }

        return light
    }
    catch(error){
    console.log("light fails " + error)
    }
}

function boundToXLSX(data){

    try{
        var boundaries = []
        var obj = {}

        for(var i = 0; i < data.boundariesCollections.length; i++){
            var collection = data.boundariesCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            obj = { Category: `${collection.title}(${j})`, 
                                    Date: map.date, 
                                    Time: getDigitalTime(entry.time), 
                                    Point: k, 
                                    Kind: entry.kind, 
                                    Description: entry.description, 
                                    Purpose: parseArrAsString(entry.purpose), 
                                    'Value (ft/sq.ft)': entry.value
                            }

                            boundaries.push(obj)
                        }
                    }
                }
            }
        }

        return boundaries
    }catch(error){
    console.log("boundaries fails " + error)
    }
}

function orderToXLSX(data){

    try{
        var order = []
        var obj = {}

        for(var i = 0; i < data.orderCollections.length; i++){
            var collection = data.orderCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            for (var l = 0; l < entry.points.length; l++){
                                var points = entry.points[l]
                                obj = { Category: `${collection.title}(${j})`, 
                                        Date: map.date, 
                                        Time: getDigitalTime(entry.time), 
                                        Point: `${k} p(${l})`, 
                                        Description: parseArrAsString(points.description)
                                }

                                order.push(obj)
                            }
                        }
                    }
                }
            }
        }

        return order
    }catch(error){
    console.log("order fails " + error)
    }
}

function accessToXLSX(data){

    try{
        var access = []
        var obj = {}

        for(var i = 0; i < data.accessCollections.length; i++){
            var collection = data.accessCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                                for (var l = 0; l < entry.points.length; l++){
                                    var points = entry.points[l]

                                    obj = { Category: `${collection.title}(${j})`, 
                                            Date: map.date, 
                                            Time: getDigitalTime(entry.time), 
                                            Point: l, 
                                            Description: points.access_description
                                }

                                access.push(obj)
                            }
                        }
                    }
                }
            }
        }
        return access
    }
    catch(error){
    console.log("light fails " + error)
    }
}
        
function programToXLSX(data){

    try{
        var programs = []
        var obj = {}

        for(var i = 0; i < data.programCollections.length; i++){
            var collection = data.programCollections[i]

            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            obj = { Category: `${collection.title}(${j})`, 
                                    Date: map.date, 
                                    Time: getDigitalTime(entry.time), 
                                    Point: k, 
                                    Kind: entry.kind, 
                                    Description: entry.description, 
                                    Purpose: parseArrAsString(entry.purpose), 
                                    'Value (ft/sq.ft)': entry.value
                            }

                            programs.push(obj)
                        }
                    }
                }
            }
        }


        return section
    }catch(error){
    console.log("section fails " + error)
    }
}

function sectionToXLSX(data){

    try{
        var section = []
        var obj = {}

        for(var i = 0; i < data.sectionCollections.length; i++){
            var collection = data.sectionCollections[i]
            
            if(collection.maps){
                for (var j = 0; j < collection.maps.length; j++){
                    var map = collection.maps[j]

                        if(map.data){
                        for(var k = 0; k < map.data.length; k++){
                            var entry = map.data[k]

                            obj = { Category: `${collection.title}(${j})`, 
                                    Date: map.date, 
                                    Time: getDigitalTime(entry.time), 
                                    Point: k, 
                                    Kind: entry.kind, 
                                    Description: entry.description, 
                                    Purpose: parseArrAsString(entry.purpose), 
                                    'Value (ft/sq.ft)': entry.value
                            }

                            section.push(obj)
                        }
                    }
                }
            }
        }

        return section
    }catch(error){
    console.log("section fails " + error)
    }
}

//created a function that gets "hour:min:sec AM/PM" format from new Date() as no default function is available
function getDigitalTime(time){
    
    var midday = 'AM'
    var min = time.getMinutes()
    var hour = time.getHours()
    var sec = time.getSeconds()

    if (hour > 12){
      hour = hour - 12
      midday = 'PM'
    }
    var timeString = [hour, min, sec].join(':')
    timeString = timeString + ' ' + midday
    return timeString
}

//parses array as a string
function parseArrAsString(arr){
    var newString = ''
    for(var i = 0; i < arr.length; i++){
        newString += arr[i]
        if(i < arr.length-1){
            newString += ','
        }
    }
    return newString
}

module.exports = {projectExport}