var elem = $('#3jswidget');
var width = $(window).width()*0.99;
var height = $(window).height()*0.95;
var type = 'CSZ';
var name = 'Camry_V1';
var url = 'data/Camry_V1.csz';
var ng3widget = new ng3jswidget(elem[0],width,height,type,url,name);
ng3widget._isNavigate = true;
ng3widget.startup();
//ng3widget.setStereoEffect();
$( window ).resize(function() {
    var width = $(window).width()*0.99;
    var height = $(window).height()*0.95;
    ng3widget.resize(width,height);
});
var animate = function(){
    requestAnimationFrame(animate);
    if (ng3widget)
      ng3widget._sceneloop();
}
animate();
