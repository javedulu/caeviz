/**
 * @author jas : jas@esi-group.com
 https://github.com/ghemingway/cad.js/blob/master/public/javascript/shape.js
 */
// Ideally , we should have a CAE3D -> Object and OBJECT3D changes have to go there , 
// we should use CAE3D instead of Object3D
THREE.VelvetShader = {
 	vertexColors : THREE.FaceColors,
 	uniforms : {
 		'opacity':{type:'f', value:1.0},
 		'ambientBrightness' : {type:'f', value:0.3},
 		'tint' : {type : 'v4', value: new THREE.Vector4(0,0,0,0.3)}
 	},
 	vertexShader : 'varying vec3 fNormal;'+
				   'varying vec3 fPosition;'+
					'varying vec3 fColor;'+
					'const float lumaMin = 0.05;'+
					'const float lumaRange = 1. - lumaMin;'+
					'float getLumaFromColor(const in vec3 color) {'+
					    'return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;}'+
					'vec3 compressColor(vec3 color)'+
					'{float luma = getLumaFromColor(color);'+
					    'return color * lumaRange + lumaMin;}'+
					'void main()'+
					'{vec4 pos = modelViewMatrix * vec4(position, 1.0);'+
				    'fNormal = normalize(normalMatrix * normal);'+
				    'fColor = compressColor(color);'+
				    'fPosition = pos.xyz;'+
				    'gl_Position = projectionMatrix * pos;'+
					'}',
 	fragmentShader : 'uniform float opacity;'+
					'uniform float ambientBrightness;'   +
					'uniform float directFactor; '+
					'uniform vec4 tint;'+
					'varying vec3 fPosition;'+
					'varying vec3 fNormal;'+
					'varying vec3 fColor;'+
					'void main()'+
					'{ float normalDot = abs(dot(fNormal, normalize(-fPosition)));'+
					  'float lightAmount = mix(ambientBrightness, 1.0, normalDot);'+
					  'vec3 color = fColor * lightAmount;'+
					  'if (tint.w > 0.) {'+
					      'float tintAmount = mix(tint.w*0.1, tint.w, normalDot);'+
					      'color = mix(color, tint.xyz, tintAmount);}'+
					  'gl_FragColor = vec4(color, opacity);'+
					'}',
 }
THREE.Object3D.prototype.getBoundingBox = function( transform )
{
	if (!this.boundingBox)
	{
		this.boundingBox = new THREE.Box3().setFromObject(this);
	}
	var bounds = this.boundingBox.clone();
	if (transform && !bounds.empty()){
		if (this._transform)
			bounds.applyMatrix4(this._transform);
	}
	return bounds;
}
THREE.Object3D.prototype.getCentroid = function(world)
{
	if (world === undefined) world = true;
	var bbox = this.getBoundingBox(false);
	if (world) {
		bbox.min.applyMatrix4(this.matrixWorld);
		bbox.max.applyMatrix4(this.matrixWorld);
	}
	return bbox.getCenter();
}
THREE.Object3D.prototype.computeBoudingBoxSphere = function()
{
	var bb = new THREE.Box3().setFromObject(this);
	var bs = new THREE.Sphere().setFromPoints([bb.max, bb.min]);
	this.center_x = (bb.max.x+bb.min.x)/2;
	this.center_y = (bb.max.y+bb.min.y)/2;
	this.center_z = (bb.max.z+bb.min.z)/2;
	this.radius = bs.radius;
}
THREE.Object3D.prototype.explode = function(distance)
{
	if (distance === undefined ) 
		distance = 100;
	if (!this._explodeDistance) 
		this._explodeDistance = 0;

	if (this._explodeDistance + distance < 0)
	{
		distance = -this._explodeDistance;
	}
	this._explodeDistance += distance;

	var explosionCenter = this.getCentroid(true);
	this.traverse(function(child){
		if (child instanceof THREE.Mesh)
		{
			var localExplosionCenter = explosionCenter.clone();
			child.worldToLocal(localExplosionCenter);

			var childCenter = child.getCentroid(false);
			var childDirection = new THREE.Vector3().copy(childCenter);
			childDirection.sub(localExplosionCenter).normalize();
			child.translateOnAxis(childDirection,distance);
		}
		
	});

	if (this._explodeDistance === 0){
		this.resetExplode();
	}
}

THREE.Object3D.prototype.resetExplode = function()
{
	if (this._explodeDistance){
		this.explode(-this._explodeDistance);
		this._explodeDistance = undefined;
	}
}
THREE.CSJZLoader = function ( manager ) {
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};
THREE.CSJZLoader.prototype = {
	constructor: THREE.CSJZLoader,
	load: function ( url, onLoad, onProgress, onError ) {
		var scope = this;
		console.time( 'CSJZLoader' );
		var loader = new THREE.FileLoader( scope.manager );
        if (loader.setCrossOrigin !== undefined)
            loader.setCrossOrigin( this.crossOrigin );
		loader.setResponseType('arraybuffer');
        function onError(err){
            console.warn("Error ...",err);
        }
		loader.load( url, function ( text ) {
			onLoad( scope.parse( text ) );
            console.timeEnd( 'CSJZLoader' );
		}, onProgress, onError );
	},
	parse: function(text){
		var scope = this;
        var zipr = new JSZip();
        var zipcontent = zipr.load(text);
		var container = new THREE.Object3D();
        var detailsjson = JSON.parse(zipcontent.files['details.json'].asText());
        var cntdetails = (detailsjson.model === undefined) ? detailsjson : detailsjson.model;
        var attrs = new Array();
       	// for (attr in cntdetails)
       	// {
       	// 	if (cntdetails.hasOwnProperty(attr) && (attr !== 'parts' || attr!== 'children'))
       	// 	{
        // 		attrs.push(attr);
       	// 	}
       	// }
        _.each(cntdetails.parts, function(part){
            if (part === undefined || part === null) return;
            if (attrs.length <= 0){
		       	for (var attr in part)
		       	{
		       		if (part.hasOwnProperty(attr))
		       		{
		        		attrs.push(attr);
		       		}
		       	}
            }
           var partname = part.name;
           if (part){
               if (part.isShell===true || part.isSolid==true)
               {
                    //if (part.id < 300 && part.id > 200)
                    //if (part.id < 110 && part.id > 150)return;
                    if (part.geometry.vertices !=null)
                    {
                        var mesh = scope.getObject(part.geometry);
                        if (part.states !== undefined){
                           part.frames = {};
                           _.each(cntdetails.frames,function(frame){
                               if (part.states["STATE_"+frame] !== undefined)
                               {
                                   //part.frames[frame] = scope.getVerticesInBuffer(part.geometry.faces,part.states[frame]);
                                   part.frames[frame] = part.states["STATE_"+frame]
                               }
                               else{
                                   //console.error("frame not found ..:",frame);
                               }
                           });
                           delete(part.states);
                        }
                        delete(part.geometry); // JAS: Stupid idiot same tag's on geometry ? but brilliant do we need multiple arrays of data @ datamodel, agreed it's mangled -- keep this for now let's see ...
                        container.add(_.extend(mesh,part));
                    }
               }
            }
            else{
                //console.warn('cant find part : '+JSON.stringify(part));
            }
        });
        container['attrs'] = attrs;
        container['name'] = cntdetails['name']
        container['solver'] = cntdetails['solver']
        //container['file'] = cndetails.['id']
        _.extend(container, cntdetails);
		return container;
	},
    getVerticesInBuffer: function(faces,invertices){
		var buffvertices = [];
		//var normals = [];
		//var uvs = [];
        function parseVertexIndex( value ){
			var index = parseInt( value );
			return ( index >= 0 ? index : index + invertices.length / 3 ) * 3;
        }
        function addVertex(a,b,c){
            buffvertices.push(
				invertices[ a ], invertices[ a + 1 ], invertices[ a + 2 ],
				invertices[ b ], invertices[ b + 1 ], invertices[ b + 2 ],
				invertices[ c ], invertices[ c + 1 ], invertices[ c + 2 ]
            );
        }
        function addFace(a,b,c,d){
			var ia = parseVertexIndex( a );
			var ib = parseVertexIndex( b );
			var ic = parseVertexIndex( c );
			var id;
			if ( d === undefined ) {
				addVertex( ia, ib, ic );
			} else {
				id = parseVertexIndex( d );
				addVertex( ia, ib, id );
				addVertex( ib, ic, id );
			}
        }
        for ( var in_data = faces, i = 0, e = in_data.length; i < e;) {
            addFace(in_data[i++],in_data[i++],in_data[i++]);
        }
        return buffvertices;
    },
    getFrames: function(){
        var scope = this;
        var framevertices = scope.getVerticesInBuffer(faces, vertices);
        return framevertices;
    },
	getObject: function ( json ) {
		var scope = this;
		var material;
        if (json.vertices === null) return new THREE.Mesh();
        var buffvertices = json.vertices; //scope.getVerticesInBuffer(json.faces, json.vertices);
		var buffergeometry = new THREE.BufferGeometry();
        var positionattr = new THREE.BufferAttribute( new Float32Array( buffvertices ), 3 ); 
        //positionattr.updateRange.offset=0;
        //positionattr.updateRange.count = buffvertices.length;
        //positionattr.needsUpdate = true;
		buffergeometry.addAttribute( 'position', positionattr );

		//JAS : TODO: To check time taken for normal / vertex computation and move them to C++ 
		//buffergeometry.computeFaceNormals();
		buffergeometry.computeVertexNormals();
		buffergeometry.computeBoundingBox();
		buffergeometry.computeBoundingSphere();
		material = new THREE.MeshLambertMaterial({
							color:Math.random()*0xf0f0f0,
							overdraw:true, 
							wireframe: false,
							transparent: false, 
							opacity: 0.85,
							side : THREE.DoubleSide
						});
		//var mesh = new THREE.Mesh( buffergeometry, material );
		var material1 =  new THREE.ShaderMaterial (THREE.VelvetShader);
		var color = new THREE.Color(Math.random()*0xf0f0f0);
        material1.defaultAttributeValues = { 'color' : [color.r,color.g,color.b] }
		material1.side = THREE.DoubleSide;
		var mesh = new THREE.Mesh( buffergeometry, material );

		var x = mesh.getCentroid().x;
		var y = mesh.getCentroid().y;
		var z = mesh.getCentroid().z;

		//material.transparent = true;
		//material.opacity = 0.2;
		return mesh;
	}
};
