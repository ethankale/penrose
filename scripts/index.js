$(document).ready(function() {
    var penrose = new Penrose();
    penrose.init({canvasSelector:'#tiles'});
    console.log(penrose);
    penrose.startTiling();
    $('#stopTiling').click(penrose.stopTiling);
});