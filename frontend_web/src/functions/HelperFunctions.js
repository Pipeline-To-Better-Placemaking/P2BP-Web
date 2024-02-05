function Area(points) {
    // calculates the area of a drawn polygon (value returned is in feet squared)
    //hard coded radius is the approximate (its rounded down) radius of the earth in meters
    let radius = 6371000;

    const diameter = radius * 2;
    const circumference = diameter * Math.PI;
    const listY = [];
    const listX = [];
    const listArea = [];

    // calculate segment x and y in degrees for each point
    const latRef = points[0].latitude;
    const lngRef = points[0].longitude;
    for (let i = 1; i < points.length; i++) {
        let lat = points[i].latitude;
        let lng = points[i].longitude;
        listY.push(calculateYSegment(latRef, lat, circumference));

        listX.push(calculateXSegment(lngRef, lng, lat, circumference));
    }

    // calculate areas for each triangle segment
    for (let i = 1; i < listX.length; i++) {
        let x1 = listX[i - 1];
        let y1 = listY[i - 1];
        let x2 = listX[i];
        let y2 = listY[i];
        listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));

    }

    // sum areas of all triangle segments
    let areaSum = 0;
    listArea.forEach(tarea => areaSum = areaSum + tarea)

    // get abolute value of area (which is in meters squared); area can't be negative
    let metersSqr = Math.abs(areaSum);
    // convert it to feet squared
    let feetSqr = metersSqr * 10.76391042;
    // fix the percision to the 2nd decimal place
    let tempString = feetSqr.toFixed(2);
    // return the parsed float of the fixed number
    return parseFloat(tempString);
}

// helpers for calcArea
function calculateAreaInSquareMeters(x1, x2, y1, y2) { return (y1 * x2 - x1 * y2) / 2 }
function calculateYSegment(latRef, lat, circumference) { return (lat - latRef) * circumference / 360.0 }
function calculateXSegment(lngRef, lng, lat, circumference) { return (lng - lngRef) * circumference * Math.cos((lat * (Math.PI / 180))) / 360.0 }

function testNames(collection) {
    const testNames = {
        stationary_maps: 'People in Place',
        moving_maps: 'People in Motion',
        order_maps: 'Absence of Order Locator',
        boundaries_maps: 'Spatial Boundaries',
        light_maps: 'Lighting Profile',
        nature_maps: 'Nature Prevalence',
        sound_maps: 'Acoustical Profile',
        access_maps: 'Identifying Access',
        program_maps: 'Identifying Program',
        section_maps: 'Section Cutter',
    };
    
    return(testNames[collection]);
}

export {Area,testNames};