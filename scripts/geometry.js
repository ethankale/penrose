
var Geometry = Geometry || {};

/*
* Acquired and modified from https://github.com/substack/point-in-polygon
* 
* When supplied with a point ( form of [x, y]) and a polygon (form of
*  ([x,y],[x,y],[x,y]), determines if the point is in our out.  Works
*  on all polygons, including both convex & concave.
*/
 Geometry.pointInsidePoly = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = point[0], y = point[1];
    
    var inside = false;

    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }
    
    return inside;
};

// A useful constant for math with a Penrose tile set.
Geometry.phi = 0.5 + Math.sqrt(5 / 4);

// Sine and cosine functions in javascript accept radians rather than degrees.
Geometry.degToRad = function(degrees) {
    return degrees * (Math.PI / 180)
}

/*
* Returns true if a line through p1, p2, and p3 rotates counterclockwise.
*
* Useful for determining intersection of two lines.
*/
Geometry.counterClockwiseRotation =  function(p1, p2, p3) {
    return (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p2[0] - p1[0]);
}

/*
* Not strictly geometry, but handy for comparing complex js objects/arrays
*
* Accepts an array of arrays or objects; if any of the sub-arrays is
*  the same as any other, returns true, otherwise returns false.
*/
Geometry.anyArraysSame =  function(array) {
    var same = false;
    
    findSameVariables:
    for (var i in array) {
        var testVal = array[i];
        
        for (var j in array) {
            
            if (i != j) {
                same = (JSON.stringify(testVal) == JSON.stringify(array[j]));
                if (same) {break findSameVariables};
            }
        }
    }
    return same;
}

/* p1 and p2 make up the first line; p3 and p4 are the second line.
*
*
* This will return true for lines that share a point; best to run anyArraySame to check
*  for overlapping endpoints before using this function.
*/
Geometry.linesIntersect = function(p1, p2, p3, p4) {
    
    var collision = (
        (Geometry.counterClockwiseRotation(p1, p3, p4) != Geometry.counterClockwiseRotation(p2, p3, p4)) &&
        (Geometry.counterClockwiseRotation(p1, p2, p3) != Geometry.counterClockwiseRotation(p1, p2, p4))
    );
    
}
