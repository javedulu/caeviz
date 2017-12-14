var Compass = class {
   constructor( parentNode, camera, controls) {
      if (parentNode === undefined ) { console.log("Error > parentNode is null / undefined "); return ;}
      var compassDomText = 
'<div id="compass-cube" class="cube">'+
'    <div class="cube-face cube-face-front">'+
'        <span class="cube-face-label">Front</span>'+
'        <div class="cube-button cube-face-button" data-x="0" data-y="0" data-z="0"></div>'+
'        <div class="cube-face-edge cube-face-edge-top cube-button cube-button-face-edge" data-group="front-top" data-x="45" data-y="0" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-right cube-button cube-button-face-edge" data-group="front-right" data-x="0" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-bottom cube-button cube-button-face-edge" data-group="front-bottom" data-x="-45" data-y="0" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-left cube-button cube-button-face-edge" data-group="front-left" data-x="0" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-right cube-button cube-button-face-corner" data-group="front-top-right" data-x="45" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-right cube-button cube-button-face-corner" data-group="front-bottom-right" data-x="-45" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-left cube-button cube-button-face-corner" data-group="front-bottom-left" data-x="-45" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-left cube-button cube-button-face-corner" data-group="front-top-left" data-x="45" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'    </div>'+
'    <div class="cube-face cube-face-back">'+
'        <span class="cube-face-label">Back</span>'+
'        <div class="cube-button cube-face-button" data-x="0" data-y="180" data-z="0"></div>'+
'        <div class="cube-face-edge cube-face-edge-top cube-button cube-button-face-edge" data-group="back-top" data-x="45" data-y="180" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-right cube-button cube-button-face-edge" data-group="back-left" data-x="0" data-y="225" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-bottom cube-button cube-button-face-edge" data-group="back-bottom" data-x="-45" data-y="180" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-left cube-button cube-button-face-edge" data-group="back-right" data-x="0" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-right cube-button cube-button-face-corner" data-group="back-top-left" data-x="45" data-y="225" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-right cube-button cube-button-face-corner" data-group="back-bottom-left" data-x="-45" data-y="225" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-left cube-button cube-button-face-corner" data-group="back-bottom-right" data-x="-45" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-left cube-button cube-button-face-corner" data-group="back-top-right" data-x="45" data-y="135" data-z="0" data-order="YXZ"></div>'+
'    </div>'+
'    <div class="cube-face cube-face-right">'+
'        <span class="cube-face-label">Right</span>'+
'        <div class="cube-button cube-face-button" data-x="0" data-y="90" data-z="0"></div>'+
'        <div class="cube-face-edge cube-face-edge-top cube-button cube-button-face-edge" data-group="top-right" data-x="45" data-y="90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-right cube-button cube-button-face-edge" data-group="back-right" data-x="0" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-bottom cube-button cube-button-face-edge" data-group="bottom-right" data-x="-45" data-y="90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-left cube-button cube-button-face-edge" data-group="front-right" data-x="0" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-right cube-button cube-button-face-corner" data-group="back-top-right" data-x="45" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-right cube-button cube-button-face-corner" data-group="back-bottom-right" data-x="-45" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-left cube-button cube-button-face-corner" data-group="front-bottom-right" data-x="-45" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-left cube-button cube-button-face-corner" data-group="front-top-right" data-x="45" data-y="45" data-z="0" data-order="YXZ"></div>'+
'    </div>'+
'    <div class="cube-face cube-face-left">'+
'        <span class="cube-face-label">Left</span>'+
'        <div class="cube-button cube-face-button" data-x="0" data-y="-90" data-z="0"></div>'+
'        <div class="cube-face-edge cube-face-edge-top cube-button cube-button-face-edge" data-group="top-left" data-x="45" data-y="-90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-right cube-button cube-button-face-edge" data-group="front-left" data-x="0" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-bottom cube-button cube-button-face-edge" data-group="bottom-left" data-x="-45" data-y="-90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-left cube-button cube-button-face-edge" data-group="back-left" data-x="0" data-y="-135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-right cube-button cube-button-face-corner" data-group="front-top-left" data-x="45" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-right cube-button cube-button-face-corner" data-group="front-bottom-left" data-x="-45" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-left cube-button cube-button-face-corner" data-group="back-bottom-left" data-x="-45" data-y="-135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-left cube-button cube-button-face-corner" data-group="back-top-left" data-x="45" data-y="-135" data-z="0" data-order="YXZ"></div>'+
'    </div>'+
'    <div class="cube-face cube-face-top">'+
'        <span class="cube-face-label">Top</span>'+
'        <div class="cube-button cube-face-button" data-x="90" data-y="0" data-z="0" data-up="0,0,1"></div>'+
'        <div class="cube-face-edge cube-face-edge-top cube-button cube-button-face-edge" data-group="back-top" data-x="45" data-y="180" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-right cube-button cube-button-face-edge" data-group="top-right" data-x="45" data-y="90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-bottom cube-button cube-button-face-edge" data-group="front-top" data-x="45" data-y="0" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-left cube-button cube-button-face-edge" data-group="top-left" data-x="45" data-y="-90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-right cube-button cube-button-face-corner" data-group="back-top-right" data-x="45" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-right cube-button cube-button-face-corner" data-group="front-top-right" data-x="45" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-left cube-button cube-button-face-corner" data-group="front-top-left" data-x="45" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-left cube-button cube-button-face-corner" data-group="back-top-left" data-x="45" data-y="-135" data-z="0" data-order="YXZ"></div>'+
'    </div>'+
'    <div class="cube-face cube-face-bottom">'+
'        <span class="cube-face-label">Bottom</span>'+
'        <div class="cube-button cube-face-button" data-x="-90" data-y="0" data-z="0" data-up="0,0,-1"></div>'+
'        <div class="cube-face-edge cube-face-edge-top cube-button cube-button-face-edge" data-group="front-bottom" data-x="-45" data-y="0" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-right cube-button cube-button-face-edge" data-group="bottom-right" data-x="-45" data-y="90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-bottom cube-button cube-button-face-edge" data-group="back-bottom" data-x="-45" data-y="180" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-edge cube-face-edge-left cube-button cube-button-face-edge" data-group="bottom-left" data-x="-45" data-y="-90" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-right cube-button cube-button-face-corner" data-group="front-bottom-right" data-x="-45" data-y="45" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-right cube-button cube-button-face-corner" data-group="back-bottom-right" data-x="-45" data-y="135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-bottom-left cube-button cube-button-face-corner" data-group="back-bottom-left" data-x="-45" data-y="-135" data-z="0" data-order="YXZ"></div>'+
'        <div class="cube-face-corner cube-face-corner-top-left cube-button cube-button-face-corner" data-group="front-bottom-left" data-x="-45" data-y="-45" data-z="0" data-order="YXZ"></div>'+
'    </div>'+
'</div>'
      this.controls = controls;
      this.camera = camera;
      this.parentNode = $(parentNode); 
      this.parentNode.append(compassDomText); 
      this.$cubeButtons = $('.cube-button', this.parentNode); 
      this.compassCube = this.parentNode.find('#compass-cube')[0];
      this.compassCubeMatrix = new THREE.Matrix4();
      this.compassCube.style['top'] = '48px';
      this.compassCube.style['right'] = '48px';
      this.compassCube.style['position'] = 'absolute';
      //parentNode.style['position'] = 'relative';
      this.bindEvents();
   };
   bindEvents() {
     var defUpVec = new THREE.Vector3(0,1,0);
     var _this = this;
     this.$cubeButtons.
          on('mouseenter', function(e){
              _this.$cubeButtons.
                        removeClass('hover').
                        filter('[data-group="'+$(this).attr('data-group')+'"]').
                        addClass('hover');
          }).
          on('mouseleave', function(e){
              _this.$cubeButtons.removeClass('hover');
          }).
          on('click', function(e){
             var upVector, upValues, eulerOrder;
             if (typeof(this.dataset.up)!=='undefined'){
                upValues = this.dataset.up.split(',').map(parseFloat);
                upVector = new THREE.Vector3(upValues[0],upValues[1], upValues[2]);
             } else {
               upVector = defUpVec;
             }
             eulerOrder = typeof(this.dataset.order) === 'undefined' ? 'XYZ' : this.dataset.order;
             
             var conversionFactor = Math.PI/ 180.0;
             var viewAngles = new THREE.Euler(parseFloat(this.dataset.x)*conversionFactor,
                                              parseFloat(this.dataset.y)*conversionFactor,
                                              parseFloat(this.dataset.z)*conversionFactor,
                                              eulerOrder);
              _this.camera.setRotationFromEuler(_this.camera, viewAngles, upVector /* allowed to be undefined */);

          });
   };
   destroy(){
       var _this = this;
       _this.compassCube.remove();
   }
   update(){
      var up = this.camera.up,
         lookFrom = this.camera.position,
         lookTarget = this.controls.target,
         matrix = new THREE.Matrix4(),
         roundedMatrix; 
      matrix.lookAt(lookTarget, lookFrom, up);
      this.compassCubeMatrix.getInverse(matrix);
      roundedMatrix = Array.prototype.map.call(this.compassCubeMatrix.elements, function (v) {
          return v.toFixed(3);
      });
      this.setStyleTransform(this.compassCube, 'perspective(300px) matrix3d('+roundedMatrix.join()+')');
   };
   setStyleTransform(element, value) {
      var style = element.style,
          styleNames = ['transform','webkitTransform','MozTransform'], 
          i;
      for (i=0; i<styleNames.length; ++i){
          if ( typeof(style[styleNames[i]]) !== 'undefined') {
             style[styleNames[i]] = value;
          }
      }
   }
}

var ng3jswidget = class {
  constructor(domNode,width,height,dataType,dataUrl,dataName) {
    this.height = Math.floor(height);
    this.width = Math.floor(width);
    this.domNode = domNode;
    this.dataUrl = dataUrl
    this.dataType = dataType;
    this.dataName = dataName || null;
    //this.mOrient = null;
    //this.viewQuat = null;
    this._dataAttrs = new Array();
    this._renderer = new THREE.WebGLRenderer({ alpha : true , antialias: true });
    this._camera = null;
	this._views = [{ 
                left: 0,
                bottom: 0.5,
                width: 0.5,
                height: 0.5,
                background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
                eye: [ 0, 300, 1800 ],
                up: [ 0, 1, 0 ],
                fov: 30,
                angle : 0,
                rotation: 33.75 
			}]
	this._prismviews = [{ 
                left: 0,
                bottom: 0.5,
                width: 0.5,
                height: 0.5,
                background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
                eye: [ 0, 300, 1800 ],
                up: [ 0, 1, 0 ],
                fov: 30,
                angle : 0,
                rotation: 33.75
            },{ 
                left: 0,
                bottom: 0,
                width: 0.5,
                height: 0.5,
                background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
                eye: [ 0, 300, 1800 ],
                up: [ 0, 1, 0 ],
                fov: 30,
                angle: 90,
                rotation: 101.25
            },
			{ 
				left: 0.5,
				bottom: 0,
				width: 0.5,
				height: 0.5,
				background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
				eye: [ 0, 300, 1800 ],
				up: [ 0, 1, 0 ],
				fov: 30,
				angle: 180,
				rotation: -101.25
			},
			{ 
				left: 0.5,
				bottom: 0.5,
				width: 0.5,
				height: 0.5,
				background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
				eye: [ 0, 300, 1800 ],
				up: [ 0, 1, 0 ],
				fov: 30,
				angle: 270,
				rotation: 101.25
			}]
    this._scene = new THREE.Scene();
    this._sceneCenter = new THREE.Vector3(0,0,0);
    this._sceneRadius = 100000;
    // this._gpuPicker = null;
    this._gpuPickdebug = false;
    this._controls = null;
    this._model = null;
    this._mouse = new THREE.Vector2();
    this._timer = new THREE.Clock();
    this._effect =  null;
    this._raycaster = new THREE.Raycaster();
    this._compass = null ; 
    this._isNavigate = false;
    this._cRender = false; // this._continusRendering / render on controls
    this._sRender = false; // this._shouldRender   / render on invalidate 
    this._eRender = false; // render the effect 
  };
  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };
  setStereoEffect() {
        this._eRender = !this._eRender;
        if (!this._effect && this._eRender){
          this._effect = new THREE.StereoEffect( this._renderer );
          this._effect.eyeSeparation = 1;
          this._effect.setSize(this.width, this.height);
          //this._controls = new THREE.DeviceOrientationControls(this._camera, this._renderer.domElement);
          //this._controls.connect();
        }
        else {
          if (this._effect)
              this._effect.setSize(this.width, this.height);
          this._effect = undefined;
        }
        this.invalidate();
  }
  startup(){
    this._id = this.generateUUID();
    this._camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 100000);
    
    this.domNode.appendChild( this._renderer.domElement );
    this.domNode.id = this._id;
    
    this._controls = new THREE.TrackballControls(this._camera, this._renderer.domElement);
    this._controls.rotateSpeed = 1.5;
    this._controls.zoomSpeed = 1.2;
    this._controls.panSpeed = 0.8;
    //this._controls.noZoom = false;
    //this._controls.noPan = false;
    this._controls.staticMoving = true;
    this._controls.dynamicDampingFactor = 0.3;
    
    this._scene.add( new THREE.AmbientLight( 0x101030 ) );
    var posDirlight = new THREE.DirectionalLight( 0xffffff, 0.75 );
    posDirlight.position.set( 1, 1, 1 ).normalize();
    this._scene.add( posDirlight );
    
    var negDirlight = new THREE.DirectionalLight( 0xffffff, 0.75 );
    negDirlight.position.set( -1, -1, -1 ).normalize();
    this._scene.add( negDirlight );
    
    var geometry = new THREE.CylinderGeometry(0,0.8,5);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -2.5, 0 ) );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );

    //this._renderer.setClearColor( 0x101030 );
    //this._renderer.setClearColor(0x343d46);
    //this._renderer.setClearColor(0x7795BA);
    //this._renderer.setClearColor(0x4b505b);
    //this._renderer.setClearColor(0xb0b0b0);
    this._renderer.domElement.style['background'] = 'linear-gradient(to bottom, #cedbe9 0%,#26558b 100%)'; // setting gradient
    this._renderer.setPixelRatio( window.devicePixelRatio );
    this._renderer.setSize( this.width, this.height );
    this._renderer.sortObjects = false;
    
    // this._gpuPicker = new THREE.GPUPicker({renderer:this._renderer, debug: false});
    // this._gpuPicker.setFilter(function (object) {return true;});
    // this._gpuPicker.setScene(this._scene);
    // this._gpuPicker.setCamera(this._camera);
    // this._gpuPicker.resizeTexture( this.width , this.height );
    // this._gpuPicker.needUpdate = true;

    if (this._isNavigate)
        this._compass = new Compass(this.domNode, this._camera, this._controls);
    this.render();
    this.handleEvents();
    //this.setupMotion();
    console.log("Renderer Startup ...")
  };
  /*setupMotion(){
      this.viewQuat = new THREE.Quaternion();
      var worldQuat = new THREE.Quaternion(-Math.sqrt(0.5), 0 , 0 , Math.sqrt(0.5));
      var _this = this;
      window.requestAnimationFrame(function _setupMotion() {
        _this.mOrient = new MotionStack.Orientation();
        _this.mOrient.start(function(e) {
          _this.viewQuat.set(
            e.quaternion.x,
            e.quaternion.y,
            e.quaternion.z,
            e.quaternion.w
          ).premultiply(worldQuat);
        });
      });
  };*/
  _sceneloop(forceRender){
    if (forceRender === undefined) 
        forceRender = false;
    if (this._cRender === true || this._sRender === true || forceRender === true )
    {
        this._sRender = false;
        this._controls.update();
        if (this._isNavigate)
            this._compass.update();
        if (this._gpuPickdebug){
          // this._renderer.render(this._gpuPicker.pickingScene, this._camera);
        } 
        /*if (this.mOrient != null)
        {
            if (this.viewQuat){
                this._camera.quaternion.copy(this.viewQuat);
            }
        }*/
        if (this._effect && this._eRender)
        {
          this._effect.render(this._scene, this._camera);
        }
        else 
        {
          this._renderer.render(this._scene, this._camera);
        }
    }
  };
  resize(width, height){
    this.width = Math.floor(width);
    this.height = Math.floor(height);
    this._camera.aspect =  this.width / this.height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize( this.width , this.height );
    // this._gpuPicker.resizeTexture( this.width , this.height );
    // this._gpuPicker.needUpdate = true;
    if (this._effect)
      this._effect.setSize(width,height);
    this.invalidate();
  };
  render() { 
    var csjloader = new THREE.CSJZLoader();
    var _this = this;
    csjloader.load(this.dataUrl, function( object ) {
      if (object.attrs)
        _this.dataAttrs = object.attrs;
      object.computeBoudingBoxSphere();
      if (object.radius / 1000 > 1)
      {
        var max = 10000; 
        object.scale.x = object.radius/max;
        object.scale.y = object.radius/max;
        object.scale.z = object.radius/max;
      }
      object.computeBoudingBoxSphere();
      _this.add3DObject(object);
    });
  };

  add3DObject(object)
  {
    this._model = object;
    if (this._model !== undefined || this._model !== null)
    {
      this._scene.add(this._model);
      this.centerCamera(this._model);
      // this._gpuPicker.setScene(this._scene); 
      this.invalidate();
    }
  };
  zoomToFit() 
  {
        var object3d = this._model,
            boundingBox = this._model.getBoundingBox(),
            radius = boundingBox.size().length() * 0.5,
            horizontalFOV = 2 * Math.atan(THREE.Math.degToRad(this._camera.fov * 0.5) * this._camera.aspect),
            fov = Math.min(THREE.Math.degToRad(this._camera.fov), horizontalFOV),
            dist = radius / Math.sin(fov * 0.5),
            newTargetPosition = boundingBox.max.clone().
                lerp(boundingBox.min, 0.5).
                applyMatrix4(object3d.matrixWorld);
        this._camera.position.
            sub(this._controls.target).
            setLength(dist).
            add(newTargetPosition);
        this._controls.target.copy(newTargetPosition);
        this.invalidate();
  };
  setSelection(object,select)
  {

      if (object===undefined)
      {
        console.log("Are you fucking INSANE to ask for selecting the WHOLE MODEL , Fuck off you Asshole...")
      }
      if (select === undefined)
          select = false;
      if (object.isSelected === undefined || object.isSelected===null)
          object.isSelected = false;
      if (object.material.transparent)
          this.setTransparent(object,false);
      if (object instanceof THREE.Mesh)
      {
        console.log(">> Selected Object .. ",object.name);
        if (select === true && object.isSelected === false) // only change if it's not already selected
        {
            //Set selection for object ....
            object.material.color.orgHex = object.material.color.getHex();
            object.material.color.setHex( 0xffff00 );
            object.isSelected = true;
        }
        if (select === false && object.isSelected === true) // only deselect if its selected
        {
            object.material.color.setHex( object.material.color.orgHex )
            object.material.color.orgHex = undefined;
            object.isSelected = false;
        }
        this.invalidate();
      }
  };
  showSelected(object,value){
      var _this = this;
      this._model.traverse(function(child){
          if (!(child instanceof THREE.Mesh)) return;
          if (child.isSelected)// reseting the parts which are highlight in red not cleared from table !
              if (child.material.color.getHex() === 0xff0000) 
                  child.material.color.setHex(0xffff00);
          if (!child.isSelected){
              _this.setTransparent(child);
          }
      });
  }
  getSelectedObjs(){
    var _this = this;
    var selObjs = new Array();
    if (_this._model === null || _this._model === undefined) return [];
    _this._model.traverse(function(child){
        if (!(child instanceof THREE.Mesh)) return;
        if (child.isSelected) 
        {
          var jsonChild = {};
          _.each(_this.dataAttrs, function(attr){
              jsonChild[attr] = child[attr];
              jsonChild['format'] = _this._model['solver'];
              jsonChild['model'] = _this.dataName || _this._model['name'];
          })
          selObjs.push(jsonChild);
        }
    })
    return selObjs;
  }
  setTransparent(object,value){
      if (value === undefined) value = true;
      if (object===undefined)
      {
        // We need to set the full model / Transparet / Opaque 
        this._model.traverse(function(child){
          if (!(child instanceof THREE.Mesh)) return;
          child.material.opacity = (value ? 0.1 : 0.85);
          child.material.transparent = value;
        });
      }
      if (object instanceof THREE.Mesh)
      {
          object.material.opacity = (value ? 0.1 : 0.85);
          object.material.transparent = value;
      }
      this.invalidate();
  }
  toggleTransparent(object){
      if (object === undefined)
      {
        // Assuming we need to show the full model ....
        // The model is already non-transparent , lets fuck off from here ...
        if (this._model.isTransparent===false)
            return;
        this._model.traverse(function(child){
          if (!(child instanceof THREE.Mesh)) return;
           child.material.opacity = 0.85;
           child.material.transparent = false;
        });
        this._model.computeBoudingBoxSphere();
        this._model.isTransparent = false;
        //this.centerCamera(this._model);
      }
      if (object instanceof THREE.Mesh) 
      {
        var isTransparent = false;
        this._model.traverse(function(child){
          if (!(child instanceof THREE.Mesh)) return;
          if (object.name === child.name)
          {
              child.material.opacity = 0.85;
              child.material.transparent = false;
              //TODO: TO create a box here to show the part  if its already selected ... 
              //it may confuse with neighbouring parts ...
              if (child.isSelected)
              {
                child.material.color.setHex(0xff0000);
              }
          } 
          else 
          {
              if (child.isSelected === undefined || child.isSelected === false)
              {
                child.material.opacity = 0.1;
                child.material.transparent = true;
                isTransparent  = true;
              }
          }
        });
        this._model.isTransparent = isTransparent;
        object.computeBoudingBoxSphere();
        this.centerCamera(object);
      }
      this.invalidate();
  };
  centerCamera(object)
  {
      if (object instanceof THREE.Object3D) {
        this._controls.reset();
        this._camera.position.x = object.center_x;
        this._camera.position.y = object.center_y;
        this._camera.position.z = object.center_z;
        var cog = Math.sqrt(object.center_x*object.center_x+object.center_y*object.center_y+object.center_z*object.center_z)
        // find distance to center
        var distance = (object.radius) / Math.sin((this._camera.fov/2) * (Math.PI / 180));
        //this.camera.position.z = (-distance/0.8);
        this._camera.position.z = +distance;
        //this._camera.position.z = object.center_z;
        if (this._camera.far < this._camera.position.z)
        {
            this._camera.far = this._camera.position.z * 1.2;
            this._camera.updateProjectionMatrix();
        }
        
        //positioning the controls to rotate at cog of object
        this._controls.target.x = object.center_x;
        this._controls.target.y = object.center_y;
        this._controls.target.z = object.center_z;
        //object.position.set(object.center_x, object.center_y,object.center_z);
        
      } else {
        // set to any valid position so it doesn't fail before object is available
          this._camera.position.y = -70;
          this._camera.position.z = 70;
          this._camera.position.x = 0;
      }
      this.invalidate();
  };
  invalidate() {
      this._sRender = true;
  };
  updateSceneBoundingBox(newBoundingBox){
    this.sceneCenter(newBoundingBox.getCenter());
    this._sceneRadius = newBoundingBox.size().length()/2;
  };
  destroy () {
      var _this = this;
      _this._scene.traverse(function(child){
          if (child instanceof THREE.Mesh)
          {
              _this._scene.remove(child);
              //delete child;
          }
      })
      delete _this._model;
      _this._scene = null;
      this._renderer.forceContextLoss();
      this._renderer.context = null;
      if (this._isNavigate)
          this._compass.destroy();
      this._renderer.domElement.remove();
      //this._renderer.domElement = null;
      this._renderer = null;
  };
  animateFrame(frameno){
    var _this = this;
    if (_this._model.frames !== undefined || _this._model.frames !== null)
    {
        if (_this._model.frames.indexOf(frameno) >= 0)
        {
            _this._model.traverse(function(child){
                if (!(child instanceof THREE.Mesh)) return;
                if (child.frames[frameno]!==undefined){
                    var framev = child.frames[frameno];
                    if (framev === null)  return;
                    if (framev.length%3 !== 0 ) return;
                    var posattr = new THREE.BufferAttribute(new Float32Array(framev), 3);
                    child.geometry = new THREE.BufferGeometry();
                    child.geometry.addAttribute('position', posattr);
                    child.geometry.computeVertexNormals();
                    //child.geometry.computeBoundingBox();
                    //child.geometry.computeBoundingSphere();
                }
                return;
            });
        }
    }
    _this.invalidate();
  };
  animateNext(){
    var _this = this;
    _this._model.frameIndex = _this._model.frameIndex ? _this._model.frameIndex : 0;
    var frameIndex = _this._model.frameIndex+1;
    _this._model.currentFrame = _this._model.frames[frameIndex];
    _this.animateFrame(_this._model.currentFrame);
    _this._model.frameIndex=frameIndex;
    if (_this._model.frames.length <= _this._model.frameIndex){
        _this._model.frameIndex = 0;
    }
  }
  handleEvents(){
    var _this = this;
    var onControlStart  = function(){
      _this._cRender = true ;
    }
    var onControlEnd = function(){
      _this.invalidate();
      _this._cRender = false;
      // _this._gpuPicker.needUpdate = true;
    }
    var onControlChange = function() 
    {
        // var x0 = _this._sceneCenter;
        // var x1 = _this._camera.position;
        // var x2 = _this._controls.target; 
        // var x2subX1 = x2.clone().sub(x1);
        // var x1subX0 = x1.clone().sub(x0);
        // var c = x2subX1.clone().cross(x1.clone().sub(x0)).lengthSq() / x2subX1.lengthSq();
        // var d = Math.sqrt(Math.abs(c - x1subX0.lengthSq()));
        // _this._camera.near = Math.max(0.1, d - _this._sceneRadius);
        // _this._camera.far = d + _this._sceneRadius;
        // _this._camera.updateProjectionMatrix();
        _this.invalidate();
    }
    var onMouseMove = function(event){
      // be careful dont invalidate here as much as possible 
      event.preventDefault();
    }
    var onMouseDown  = function(event){
        event.preventDefault();
        _this._mouse.x = event.clientX;
        _this._mouse.y = event.clientY;
        _this._renderer.domElement.addEventListener('mouseup', onMouseUp, false);
    }
    var onKeyUp = function(event){
      _this._keyCode = event.keyCode;
      if (event.keyCode !== _this._keyCode) return;
      // TODO: replace the below with switch for all devices 
      switch(event.keyCode)
      {
        case KeyCode.key('x'):
            if (!event.shiftKey)
              {_this._model.explode(100);}
            else
              {_this._model.explode(-100);}
            if (event.ctrlKey)
              {_this._model.resetExplode();}
            _this.invalidate();
          break;
        case KeyCode.key('b'):
          if( event.ctrlKey )
          {
             _this._model.traverse(function(child)
             {
                if (!(child instanceof THREE.Mesh)) return;
                child.material.transparent = true;
                //child.material.wireframe= true;
                child.material.opacity = 0.4;
                var helper = new THREE.EdgesHelper(child, 0xD3D3D3,20);
                _this._scene.add(helper);
             });
            _this.invalidate();
          }
          break;
        case KeyCode.key('i'):
          if( event.ctrlKey )
          {
              var i=0;
             _this._model.traverse(function(child){
                if (!(child instanceof THREE.Mesh)) return;
                i = i+1;
                var x = child.getCentroid().x*0.8; 
                var y = child.getCentroid().y*0.8; 
                var z = child.getCentroid().z*0.8;
                var color = (i%50!=0) ? 0x080AFF : 0x08FF0A;
                var smaterial = new THREE.MeshLambertMaterial({
                                color: (i%50!=0) ? 0x080AFF : ((i%100!=0) ? 0x08FF0A : 0xFF080A),
                                overdraw:true, 
                                wireframe: false,
                                transparent: false, 
                                opacity: (i%50!=0) ? 0.50 : 1.0
                              });
                var rad = (i%50!=0) ? 2 : 4; 
                var spmesh = new THREE.Mesh(new THREE.SphereBufferGeometry( rad , 16 , 16 ),smaterial)
                spmesh.position.x = child.getCentroid().x;
                spmesh.position.y = child.getCentroid().y; 
                spmesh.position.z = child.getCentroid().z;
                _this._scene.add(spmesh);

                var linegeom = new THREE.Geometry();
                linegeom.vertices.push( new THREE.Vector3(_this._model.center_x, _this._model.center_y, _this._model.center_z))
                linegeom.vertices.push( new THREE.Vector3( child.getCentroid().x , child.getCentroid().y, child.getCentroid().z))
                var lmaterial = new THREE.LineBasicMaterial({color: 0x5A5A5A});
                var line = new THREE.Line(linegeom, lmaterial);
                _this._scene.add(line);
              });
             _this.invalidate();
          }
        break;
        case KeyCode.key('n'):
          if (_this._model){
            //_.each(_this._model.frames, function(frame){
            //      _this.animateFrame(frame);
            //});
            if (_this._model.frames === undefined || _this._model.frames === null) 
            {
                break;
            }
            if (_this.interval)
            {
                clearInterval(_this.interval);
                _this.interval = null;
                break;
            }
            _this.interval = setInterval(function(){
                return _this.animateNext();
            }, 100);
          }
          break;
        case KeyCode.key('p'):
          if (event.ctrlKey)
          {
            _this._eRender = !_this._eRender;
            if (!_this._effect && _this._eRender){
                //_this._effect = new THREE.ParallaxBarrierEffect( _this._renderer );
              _this._effect = new THREE.AnaglyphEffect( _this._renderer );
              _this._effect.setSize(_this.width, _this.height);
            }
            else {
              _this._effect = undefined;
            }
            _this.invalidate();
          }
          break;
        case KeyCode.key('s'):
          if (event.ctrlKey)
          {
            _this._eRender = !_this._eRender;
            if (!_this._effect && _this._eRender){
              _this._effect = new THREE.StereoEffect( _this._renderer );
              _this._effect.eyeSeparation = 1;
              _this._effect.setSize(_this.width, _this.height);
              //_this._controls = new THREE.DeviceOrientationControls(_this._camera, _this._renderer.domElement);
              //_this._controls.connect();
            }
            else {
              if (_this._effect)
				  _this._effect.setSize(_this.width, _this.height);
              _this._effect = undefined;
            }
            _this.invalidate();
          }
          break;
        case KeyCode.key('v'):
          if (event.ctrlKey)
          {
              // TODO : To enable VREffect effect here ...
			  _this._eRender = !_this._eRender;
			  if(!_this._effect && _this._eRender)
			  {
				  _this._effect = new THREE.VREffect(_this._renderer);
				  _this._effect.setSize(_this.width, _this.height);
			  }
              else {
                  if (_this._effect)
                      _this._effect.setSize(_this.width, _this.height);
              _this._effect = undefined;
            }
			  _this.invalidate();
          }
          break;
        case KeyCode.key('f'):
          if (_this._model){
              _this._model.computeBoudingBoxSphere();
              _this.centerCamera(_this._model);
          }
          break;
        default:
          break;
      }
      document.removeEventListener('keyup', onKeyUp);
    }
    var onKeyDown = function(event){
        //event.preventDefault();
        //event.stopPropagation();
        _this._keyCode = event.keyCode
        document.addEventListener('keyup', onKeyUp);
    }
    var onMouseUp = function ( event ) {
        event.preventDefault();
        if (event.which !== 1) return;
        var upPos = new THREE.Vector2();
        upPos.x = event.clientX;
        upPos.y = event.clientY;
        if (_this._mouse.distanceTo(upPos)==0)
        {
          var rect = _this._renderer.domElement.getBoundingClientRect();
          var x = ( _this._mouse.x - rect.left )  / rect.width,
              y = ( _this._mouse.y - rect.top ) / rect.height;
          
          var raymouse = new THREE.Vector2();
          raymouse.set(( x * 2 ) - 1, - ( y * 2 ) + 1)
          
          _this._raycaster.setFromCamera( raymouse, _this._camera );
          var intersect = _this._raycaster.intersectObject(_this._scene, true)[0];
          //var intersect = _this._gpuPicker.pick( _this._mouse, _this._raycaster);
          if (intersect) {
            if (event.shiftKey)
            {
              _this.setSelection(intersect.object, false);
            }
            else
            {
              _this.setSelection(intersect.object, true);
            }
          }
        }
        _this._renderer.domElement.removeEventListener( 'mouseup', onMouseUp, false );
  };

    this._controls.addEventListener('end', onControlEnd );
    this._controls.addEventListener('start', onControlStart );
    this._controls.addEventListener('change', onControlChange );
    this._renderer.domElement.addEventListener('mousedown', onMouseDown);
    this._renderer.domElement.addEventListener('mousemove', onMouseMove);
    //this._renderer.onkeydown = onKeyDown;
    document.addEventListener('keydown', onKeyDown);
  };
};
