$(document).ready(function() {
    var penrose = new Penrose();
    penrose.init({canvasSelector:'#tiles'});

    penrose.startTiling();
    $('#stopTiling').click(penrose.stopTiling);
    window.penrose = penrose;
});