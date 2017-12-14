/**
 * @author jas : jas@esi-group.com
 https://github.com/ghemingway/cad.js/blob/master/public/javascript/shape.js
 */
 // Ideally , we should have a CAE3D -> Object and OBJECT3D changes have to go there , 
 // we should use CAE3D instead of Object3D
 THREE.VelvetShader = {
 	vertexColors : THREE.VertexColors,
 	uniforms : {
 		'opacity':{type:'f', value:1.0},
 		'ambientBrightness' : {type:'f', value:0.3},
 		'tint' : {type : 'v4', value: new THREE.Vector4(0,0,0,0)}
 	},
 	vertexShader : 'varying vec3 fNormal;'+
				   'varying vec3 fPosition;'+
					'varying vec3 fColor;'+
					'const float lumaMin = 0.15;'+
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
	return bbox.center();
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
THREE.CSZLoader = function ( manager ) {
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};
THREE.CSZLoader.prototype = {
	constructor: THREE.CSZLoader,
	load: function ( url, onLoad, onProgress, onError ) {
		var scope = this;
		console.time( 'CSZLoader' );
		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setResponseType('arraybuffer');
        function onError(err){
            console.warn("Error ...",err);
        }
		loader.load( url, function ( text ) {
			onLoad( scope.parse( text ) );
            console.timeEnd( 'CSZLoader' );
		}, onProgress, onError );
	},
	parse: function(text){
		var scope = this;
        var zipr = new JSZip();
        var zipcontent = zipr.load(text);
		var container = new THREE.Object3D();
        var cntdetails = null;
        cntdetails = JSON.parse(zipcontent.files['details.json'].asText());
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
            var file = 'PART_'+part.id; // put id instead of NAME 
            if (zipcontent.files[file] !== undefined)
            {
                if (part.name === 'PART_3')
                {
                    var mesh = scope.getObject(zipcontent.files[file].asText());
                    container.add(_.extend(mesh,part));
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
	getObject: function ( text ) {
		var object, objects = [];
		var geometry, material;
		function parseVertexIndex( value ) {
			var index = parseInt( value );
			return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
		}
		function parseNormalIndex( value ) {
			var index = parseInt( value );
			return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;
		}
		function parseUVIndex( value ) {
			var index = parseInt( value );
			return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;
		}
		function addVertex( a, b, c ) {
			geometry.vertices.push(
				vertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],
				vertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],
				vertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]
			);
		}
		function addNormal( a, b, c ) {
			geometry.normals.push(
				normals[ a ], normals[ a + 1 ], normals[ a + 2 ],
				normals[ b ], normals[ b + 1 ], normals[ b + 2 ],
				normals[ c ], normals[ c + 1 ], normals[ c + 2 ]
			);
		}
		function addUV( a, b, c ) {
			geometry.uvs.push(
				uvs[ a ], uvs[ a + 1 ],
				uvs[ b ], uvs[ b + 1 ],
				uvs[ c ], uvs[ c + 1 ]
			);
		}
		function addFace( a, b, c, d,  ua, ub, uc, ud, na, nb, nc, nd ) {
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
			if ( ua !== undefined ) {
				ia = parseUVIndex( ua );
				ib = parseUVIndex( ub );
				ic = parseUVIndex( uc );
				if ( d === undefined ) {
					addUV( ia, ib, ic );
				} else {
					id = parseUVIndex( ud );
					addUV( ia, ib, id );
					addUV( ib, ic, id );
				}
			}
			if ( na !== undefined ) {
				ia = parseNormalIndex( na );
				ib = parseNormalIndex( nb );
				ic = parseNormalIndex( nc );
				if ( d === undefined ) {
					addNormal( ia, ib, ic );
				} else {
					id = parseNormalIndex( nd );
					addNormal( ia, ib, id );
					addNormal( ib, ic, id );
				}
			}
		}
		// create mesh if no objects in text
		if ( /^o /gm.test( text ) === false ) {
			geometry = {
				vertices: [],
				normals: [],
				uvs: []
			};
			material = {
				name: ''
			};
			object = {
				name: '',
				geometry: geometry,
				material: material
			};
		}
		var vertices = [];
		var normals = [];
		var uvs = [];
		// v float float float
		var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
		// vn float float float
		var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
		// vt float float
		var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
		// f vertex vertex vertex ...
		var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;
		// f vertex/uv vertex/uv vertex/uv ...
		var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;
		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
		var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;
		// f vertex//normal vertex//normal vertex//normal ...
		var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;
		//
		var lines = text.split( '\n' );
		for ( var i = 0; i < lines.length; i ++ ) {
			var line = lines[ i ];
			line = line.trim();
			var result;
			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {
				continue;
			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {
				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				vertices.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				);
			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {
				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
				normals.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				);
			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {
				// ["vt 0.1 0.2", "0.1", "0.2"]
				uvs.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] )
				);
			} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {
				// ["f 1 2 3", "1", "2", "3", undefined]
				addFace(
					result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
				);
			} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {
				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]
				addFace(
					result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
					result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
				);
			} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {
				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
				addFace(
					result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
					result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
					result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
				);
			} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {
				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]
				addFace(
					result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
					undefined, undefined, undefined, undefined,
					result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
				);
			} else if ( /^o /.test( line ) ) {
				geometry = {
					vertices: [],
					normals: [],
					uvs: []
				};
				material = {
					name: ''
				};
				object = {
					name: line.substring( 2 ).trim(),
					geometry: geometry,
					material: material
				};
			} else if ( /^g /.test( line ) ) {
				// group
			} else if ( /^usemtl /.test( line ) ) {
				// material
				material.name = line.substring( 7 ).trim();
			} else if ( /^mtllib /.test( line ) ) {
				// mtl file
			} else if ( /^s /.test( line ) ) {
				// smooth shading
			} else {
				// console.log( "THREE.CSZLoader: Unhandled line " + line );
			}
		}
		geometry = object.geometry;
		var buffergeometry = new THREE.BufferGeometry();
		buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );
		if ( geometry.normals.length > 0 ) {
			buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );
		}
		if ( geometry.uvs.length > 0 ) {
			buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );
		}
		//JAS : TODO: To check time taken for normal / vertex computation and move them to C++ 
        console.log(buffergeometry);
		buffergeometry.computeFaceNormals();
		buffergeometry.computeVertexNormals();
		buffergeometry.computeBoundingBox();
		buffergeometry.computeBoundingSphere();
		material = new THREE.MeshLambertMaterial({
							color:Math.random()*0xf0f0f0,
							overdraw:true, 
							wireframe: true,
							transparent: false, 
							opacity: 0.85,
							side : THREE.DoubleSide
						});
		// var material1 =  new THREE.ShaderMaterial (THREE.VelvetShader);
		// var color = new THREE.Color(0xf0f0f0)
		// material1.uniforms.tint.value.set(color.r,color.g,color.b, 0.3);
		// material1.side = THREE.DoubleSide;
		var mesh = new THREE.Mesh( buffergeometry, material );

		var x = mesh.getCentroid().x;
		var y = mesh.getCentroid().y;
		var z = mesh.getCentroid().z;

		//material.transparent = true;
		//material.opacity = 0.2;
        console.log(mesh);
		return mesh;
	}
};
