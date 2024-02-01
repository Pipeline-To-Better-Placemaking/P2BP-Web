
stationaryToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers,Standing_Point_Title, Standing_Point," +
                  "Location,Age,Gender,Activity,Posture"

    var csv = headers

    for(var i = 0; i < data.stationaryCollections.length; i++){
        var collection = data.stationaryCollections[i]
        
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]

                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        csv += entry.standingPoint.title + ','
                        csv += "\"POINT( " + entry.standingPoint.latitude + " " + entry.standingPoint.longitude + ")\","
                        csv += "\"POINT( " + entry.location.latitude + " " + entry.location.longitude + ")\"," 
                        csv += entry.age + ','
                        csv += entry.gender + ','
                        csv += entry.activity +','
                        csv += entry.posture   
                    }
                }
            }
        }
    }

    return csv
}

movingToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers,Standing_Point,Standing_Point_Title," +
                  "Mode,Path"

    var csv = headers

    for(var i = 0; i < data.movingCollections.length; i++){
        var collection = data.movingCollections[i]
        
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        csv += entry.standingPoint.title + ','
                        csv += "\"POINT( " + entry.standingPoint.latitude + " " + entry.standingPoint.longitude + ")\","
                        csv += entry.mode + ','
                        path = "\"LINESTRING ( "
                        for(var l = 0; l < entry.path.length; l++){
                           if (l != 0) path += ", "
                           path += entry.path[l].latitude + " " + entry.path[l].longitude
                        }
                        path += ")\""
                        csv += path                       
                    }
                }
            }
        }
    }

    return csv
}

soundToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers,Standing_Point,Standing_Point_Title," +
                  "Sound_Types,Decibel_1,Decibel_2,Decibel_3,Decibel_4,Decibel_5,Average"

    var csv = headers

    for(var i = 0; i < data.soundCollections.length; i++){
        var collection = data.soundCollections[i]
        
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        csv += entry.standingPoint.title + ','
                        csv += "\"POINT( " + entry.standingPoint.latitude + " " + entry.standingPoint.longitude + ")\","
                        csv += entry.sound_type + ','
                        csv += entry.decibel_1 + ','
                        csv += entry.decibel_2 + ','
                        csv += entry.decibel_3 + ','
                        csv += entry.decibel_4 + ','
                        csv += entry.decibel_5 + ','
                        csv += entry.average
                    }
                }
            }
        }
    }

    return csv
}

lightToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers," +
                  "Location, Light_Description"

    var csv = headers

    for(var i = 0; i < data.lightCollections.length; i++){
        var collection = data.lightCollections[i]
        
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        csv += "\"POINT( " + entry.points.location.latitude + " " + entry.points.locaiton.longitude + ")\","
                        csv += entry.points.light_description
                    }
                }
            }a
        }
    }

    return csv
}

natureToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers" +
                  "Animals,Vegetation,Weather,Water"

    var csv = headers

    for(var i = 0; i < data.natureCollections.length; i++){
        var collection = data.natureCollections[i]
        
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        csv += entry.animals + ','
                        csv += entry.vegetation + ','
                        csv += entry.weather + ','
                        csv += entry.water
                    
                    }
                }
            }
        }
    }

    return csv
}

orderToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers" +
                  "Location,Kind,Description"

    var csv = headers

    for(var i = 0; i < data.orderCollections.length; i++){
        var collection = data.orderCollections[i]
        
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        // csv += "\"POINT( " + entry.location.latitude + " " + entry.location.longitude + ")\","
                        csv += entry.points.kind + ','
                        csv += entry.points.description 
                    }
                }
            }
        }
    }

    return csv
}

boundariesToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers," +
                  "Kind,Description,Value,Purpose"

    var csv = headers

    for(var i = 0; i < data.boundariesCollections.length; i++){
        var collection = data.boundariesCollections[i]
        
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        // path = "\"LINESTRING ( "
                        // for(var l = 0; l < entry.path.length; l++){
                        //    if (l != 0) path += ", "
                        //    path += entry.path[l].latitude + " " + entry.path[l].longitude
                        // }
                        // path += ")\""
                        // csv += path
                        csv += entry.kind + ','
                        csv += entry.description + ','
                        csv += entry.value + ',' 
                        csv += entry.purpose  

                    }
                }
            }
        }
    }

    return csv
}

surveyToCSV = function(data) {

    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers,Key" 

    var csv = headers

    for(var i = 0; i < data.surveyCollections.length; i++){
        var collection = data.surveyCollections[i]
        
        var area = "\"POLYGON (("
        if(collection.area){
            for(var j = 0; j < collection.area.points.length; j++){
                if (j != 0) area += ','
                area += collection.area.points[j].latitude + " "
                area += collection.area.points[j].longitude
            }
        }
        area += "))\""
        
        if(collection.surveys){
            for (var j = 0; j < collection.surveys.length; j++){
                var survey = collection.surveys[j]

                var researchers = "\""
                if(survey.researchers){
                    for(var k = 0; k < survey.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += survey.researchers[k].firstname + " " + survey.researchers[k].lastname
                    }
                }
                researchers += "\""

                csv += '\n'
                csv += collection.title + ','
                csv += collection.date + ','
                csv += collection.area.title + ','
                csv += area + ','
                csv += collection.duration + ','
                csv += survey.date + ','
                csv += researchers + ','
                csv += survey.key                    
            }
        }
    }

    return csv
}

accessToCSV = function(data) {
    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers," +
                  "Location, Access_Description"

    var csv = headers

        for(var i = 0; i < data.accessCollections.length; i++){
            var collection = data.accessCollections[i]
            var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        csv += "\"POINT( " + entry.points.location.latitude + " " + entry.points.locaiton.longitude + ")\","
                        csv += entry.points.light_description
                    }
                }

            }
            
        }

    }
    return csv;
}

sectionToCSV = function(data) {
    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers," +
                  "Kind,Description,Value,Purpose"

    var csv = headers

    for(var i = 0; i < data.programCollections.length; i++){
        var collection = data.programCollections[i]
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        // path = "\"LINESTRING ( "
                        // for(var l = 0; l < entry.path.length; l++){
                        //    if (l != 0) path += ", "
                        //    path += entry.path[l].latitude + " " + entry.path[l].longitude
                        // }
                        // path += ")\""
                        // csv += path
                        csv += entry.kind + ','
                        csv += entry.description + ','
                        csv += entry.value + ',' 
                        csv += entry.purpose  

                    }
                }
            }
        }
    }

    return csv
}

programToCSV = function(data) {
    var headers = "Collection_Title," +
                  "Collection_Date,"  +
                  "Area_Title,Area,Duration,Activity_Time," +
                  "Researchers," +
                  "Kind,Description,Value,Purpose"

    var csv = headers

    for(var i = 0; i < data.sectionCollections.length; i++){
        var collection = data.sectionCollections[i]
        var area = "\"POLYGON (("
        for(var j = 0; j < collection.area.points.length; j++){
            if (j != 0) area += ','
            area += collection.area.points[j].latitude + " "
            area += collection.area.points[j].longitude
        }
        area += "))\""
        
        if(collection.maps){
            for (var j = 0; j < collection.maps.length; j++){
                var map = collection.maps[j]
                var researchers = "\""
                if(map.researchers){
                    for(var k = 0; k < map.researchers.length; k++){
                        if(k != 0) researchers += ', '
                        researchers += map.researchers[k].firstname + " " + map.researchers[k].lastname
                    }
                }
                researchers += "\""
                if(map.data){
                    for(var k = 0; k < map.data.length; k++){
                        var entry = map.data[k]
                        csv += '\n'
                        csv += collection.title + ','
                        csv += collection.date + ','
                        csv += collection.area.title + ','
                        csv += area + ','
                        csv += collection.duration + ','
                        csv += map.date + ','
                        csv += researchers + ','
                        // path = "\"LINESTRING ( "
                        // for(var l = 0; l < entry.path.length; l++){
                        //    if (l != 0) path += ", "
                        //    path += entry.path[l].latitude + " " + entry.path[l].longitude
                        // }
                        // path += ")\""
                        // csv += path
                        csv += entry.kind + ','
                        csv += entry.description + ','
                        csv += entry.value + ',' 
                        csv += entry.purpose  

                    }
                }
            }
        }
    }

    return csv
}

module.exports = {
    stationaryToCSV,
    movingToCSV,
    surveyToCSV,
    soundToCSV,
    lightToCSV,
    orderToCSV,
    boundariesToCSV,
    natureToCSV,
    accessToCSV,
    programToCSV,
    sectionToCSV,
}