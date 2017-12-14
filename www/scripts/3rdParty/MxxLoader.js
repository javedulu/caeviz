/**
 * Loader for Mxx Result models :
 *
 * @author javeds / http://www.esi-group.com
 * 
 */
function parseString(str) {
	return str.replace(/\s+$/,"");
}

THREE.MxxLoader = function( ){
};
THREE.MxxLoader.prototype = new THREE.MxxLoader();
THREE.MxxLoader.prototype.constructor = THREE.MxxLoader ;

THREE.MxxLoader.prototype.load = function(url,callback){
	if ( url instanceof Object ) {
		console.warn( 'DEPRECATED: MxxLoader( parameters ) is now MxxLoader( url, callback, metaData ).' );
		var parameters = url;
		url = parameters.model;
		callback = parameters.callback;
	}
	
	var xhr = new XMLHttpRequest(),
		callbackProgress = null;
	var length=0;
	xhr.onreadystatechange = function() {
		if ( xhr.readyState == 4 ) {
			if ( xhr.status == 200 || xhr.status == 0 ) {
				THREE.MxxLoader.prototype.parse( xhr.responseText, callback );
			} else {
				alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );
			}
		} else if ( xhr.readyState == 3 ) {
			if ( callbackProgress ) {
				if ( length == 0 ) {
					length = xhr.getResponseHeader( "Content-Length" );
				}
				callbackProgress( { total: length, loaded: xhr.responseText.length } );
			}
		} else if ( xhr.readyState == 2 ) {
			length = xhr.getResponseHeader( "Content-Length" );
		}
	};
	xhr.open( "GET", url, true );
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );
};

THREE.MxxLoader.prototype.MxxReader = function(data) {
	this.__buffer = data;
	this.__data = [];
	this.__hasSolid = false;
	this.__nDescriptive = 0;
	this.__nTransform = 0;
	this.__nMaterial = 0;
	this.__nNode = 0;
	this.__nShell = 0;
	this.__nVarPerShell = 0;
	this.__nSolid = 0;
	this.__nTetra10 = 0;
	this.__nTetra4 = 0;
	this.__nVarPerSolid = 0;
	
	this.__lnTransform = 0;
	this.__shellVariablesLn = null;

	this.FORMAT_SUMMARY = [[1, 8, parseInt], [9, 16, parseInt], [17, 24, parseInt], [25, 32, parseInt], [33, 40, parseInt], [41, 48, parseInt], [49, 56, parseInt], [57, 64, parseInt], [65, 72, parseInt], [73, 80, parseInt]];
	this.FORMAT_NODE = [[1, 8, parseString], [9, 16, parseInt], [17, 32, parseFloat], [33, 48, parseFloat], [49, 64, parseFloat]];
	this.FORMAT_TRANSFORM_L1 = [[1, 5, parseString], [6, 13, parseInt], [14, 21, parseInt]];
	this.FORMAT_SHELL_ELEMENT = [[1, 8, parseString], [9, 16, parseInt], [17, 24, parseInt], [25, 32, parseInt], [33, 40, parseInt], [41, 48, parseInt], [49, 56, parseInt], [57, 64, parseInt], [65, 72, parseInt]];
	this.FORMAT_SHELL_VARS_L1 = [[1, 5, parseString], [6, 13, parseInt]];
	this.FORMAT_SHELL_VARS_L2 = [[1, 8, parseInt], [9, 16, parseInt], [17, 24, parseInt], [25, 32, parseInt], [33, 40, parseInt], [41, 48, parseInt]];
	this.FORMAT_SHELL_VALS = [[1, 13, parseFloat], [14, 26, parseFloat], [27, 39, parseFloat], [40, 52, parseFloat], [53, 65, parseFloat], [66, 78, parseFloat]];

	this.SHELL_VAR_THIC = ["THIC", "Thickness"];
	this.SHELL_VAR_PLAS = ["PLAS", "Effective plastic strain"];
	this.SHELL_VAR_STRS = ["STRS", "Stress tensor"];
	this.SHELL_VAR_STRN = ["STRN", "Upper and lower strain tensors"];
	this.SHELL_VAR_ORTH = ["ORTH", "Major orthotropic direction"];
	this.SHELL_VAR_FIB1 = ["FIB1", "Fiber direction 1"];
	this.SHELL_VAR_FIB2 = ["FIB2", "Fiber direction 2v"];
	this.SHELL_VAR_STF1 = ["STF1", "Fiber strain 1"];
	this.SHELL_VAR_STF2 = ["STF2", "Fiber strain 2"];
	this.SHELL_VAR_KINH = ["KINH", "Back stress tensor"];
	this.SHELL_VAR_CRAC = ["CRAC", "CRACH variable block"];
	this.SHELL_VAR_DAMG = ["DAMG", "Isotropic damage parameter"];
	this.SHELL_VAR_ALL = [this.SHELL_VAR_THIC, this.SHELL_VAR_PLAS, this.SHELL_VAR_STRS,
	                          this.SHELL_VAR_STRN, this.SHELL_VAR_ORTH, this.SHELL_VAR_FIB1,
	                          this.SHELL_VAR_FIB2, this.SHELL_VAR_STF1, this.SHELL_VAR_STF2,
	                          this.SHELL_VAR_KINH, this.SHELL_VAR_CRAC, this.SHELL_VAR_DAMG];
	
};

THREE.MxxLoader.prototype.MxxReader.prototype = {
		
		__readData : function(){
				if (this.__data.length > 0)
					return this.__data;
				//this.__buffer = this.__buffer.replace(/\r/,"\n");
				this.__data = this.__buffer.split('\n');
				return this.__data;
		},
				
		__splitByColumn : function(line,fields){
				if ((line==null) || (line==""))
					return null;
				var output = [];
				var maxlen = line.length;
				for (var i=0; i< fields.length;i++)
					{
						var s  = fields[i][0];
						var e  = fields[i][1];
						var fn = fields[i][2];
						if ((maxlen <= s) || (maxlen < e) ){break;}
						field = line.substr(s-1,e);
						output.push(fn(field));
					}
				if (output.length==0)
					return null;
				return output;
				
		},
		__guessLinesAndFieldsForVariable : function(varname,intgrpt,gauspt){
			if (this.__shellVariablesLn == null)
				return [0,0,0];
			
			var fcount = 0; var stidx = 0; var eidx = 0;var retnvals = 0; var retintrows = 1; var retintcols = 1;
			for (var j=0; j < this.__shellVariablesLn.length;j++)
				{
					var key = this.__shellVariablesLn[j][0];
					var val = this.__shellVariablesLn[j][1];
					var nvals = val[0];
					var intdep = val[1];
					var gaussdep =  val[2];
					
					if (intdep==1){nvals = nvals * intgrpt;}
					if (gaussdep == 1){nvals = nvals * gauspt;}
					if (key == varname)
						{
							stidx = fcount;
							eidx = fcount + nvals;
							retnvals = val[0];
							if (intdep==1){retintrows = intgrpt;}
							if (gaussdep==1){retintcols = gauspt;}
						}
					fcount = fcount + nvals;
				}
			lines = parseInt(fcount / 6);
			rem = parseInt(fcount % 6);
			if (rem > 0){lines = lines + 1;}
		return [lines,stidx,eidx,retnvals,retintrows,retintcols];
		
		},
		getShellVarDescription : function(varname){
			  for (var i=0 ; i < this.SHELL_VAR_ALL.length; i++)
				  {
				  	var variable = this.SHELL_VAR_ALL[0][0];
				  	var description = this.SHELL_VAR_ALL[0][1];
				  	if (variable == varname)
				  		return description;
				  }
		        return "Unknown";
		},
		getDescriptiveBlocksCount : function(){
			return [this.__nDescriptive,3,this.__nDescriptive * 2];
		},
		getTransformBlocksCount : function(){
			var descBlocksCount = this.getDescriptiveBlocksCount();
			var count = descBlocksCount[0];var sidx = descBlocksCount[1];var lines = descBlocksCount[2];
			return [this.__nTransform,sidx+lines,this.__lnTransform];
		},
		getMaterialsCount : function(){
			 return [this.__nMaterial, 0, 0];
		},
		getNodesCount : function(){
			var tnfmBlocksCount = this.getTransformBlocksCount();
			var count = tnfmBlocksCount[0];var sidx = tnfmBlocksCount[1];var lines = tnfmBlocksCount[2];
	        return [this.__nNode, sidx + lines, this.__nNode];
		},
		getShellElementsCount : function(){
			var nodesCount = this.getNodesCount();
			var count = nodesCount[0];var sidx = nodesCount[1];var lines = nodesCount[2];
	        return [this.__nShell, sidx + lines, this.__nShell];
		},
		getVariablesPerShellCount : function(){
			var shellElementsCount =  this.getShellElementsCount();
			var count = shellElementsCount[0];var sidx = shellElementsCount[1];var lines = shellElementsCount[2];
		    return [this.__nVarPerShell, sidx + lines, this.__nVarPerShell * 2];
		},
		getShellValuesCount : function(){
			var varPerShellCount =  this.getVariablesPerShellCount();
			var count = varPerShellCount[0];var sidx = varPerShellCount[1];var lines = varPerShellCount[2];
		    return [this.__nShell, sidx + lines, 0];
		},
		getSolidElementsCount : function(){
			 return [this.__nSolid, 0, 0];
		},
		getTetraElement10Count : function(){
			return [this.__nTetra10, 0, 0];
		},
		getTetraElement4Count : function(){
			return [this.__nTetra4, 0, 0];
		},
		getVariablesPerSolidCount : function(){
			return [this.__nVarPerSolid, 0, 0];
		},
		getShellVariableNames : function(){
			if(this.__shellVariablesLn == null)
	            {return null;}
	        
	        var names = new Array();
	        for (var i=0;i< this.__shellVariablesLn.length; i++)
	        	{
	        		var name = this.__shellVariablesLn[i][0];
	        		var options = this.__shellVariablesLn[i][1];
	        		names.push(name);
	        	}
	           
	        if(names.length == 0)
	            {return null;}
	        return names;
		},
		getIntegrationAndGaussPoints : function(){
			var data = this.__readData();
			var shellElementsCount =  this.getShellElementsCount();
			var count = shellElementsCount[0];var sidx = shellElementsCount[1];var lines = shellElementsCount[2];
			
			var intpts = new Array();
			var gausspts = new Array();
			
			for (var i=0; i < count; i++)
			    {
				 	var ret = this.__splitByColumn(data[sidx + i], this.FORMAT_SHELL_ELEMENT);
					var key = ret[0]; var id = ret[1]; var mat = ret[2]; 
					var n1 = ret[3]; var n2 = ret[4]; var n3 = ret[5] ; var n4 =ret[6] ;
					var nipt = ret[7] ; var ngauspt = ret[8];
					
					intpts.push(nipt);
					gausspts.push(ngauspt);
			    }
			return [intpts, gausspts];
		},
		getShellValuesForVariable : function(varname){
			var data = this.__readData();
			var pts = this.getIntegrationAndGaussPoints();
			var intpts = pts[0]; var gausspts = pts[1];
			var shellValuesCount = this.getShellValuesCount();
			
			var count = shellValuesCount[0];var sidx = shellValuesCount[1];var junk = shellValuesCount[2];
			
			var values = new Array();
			
			for (var i=0; i < count; i++)
				{
					var resinfo = this.__guessLinesAndFieldsForVariable(varname, intpts[i], gausspts[i]);
					var lncount = resinfo[0];var stfieldidx=resinfo[1];var edfieldidx = resinfo[2];var nvals = resinfo[3];var introws=resinfo[4];var intcols = resinfo[5];
					var onelist=new Array();
					for (var j=0;j<lncount;j++)
						{
							var splt =this.__splitByColumn(data[sidx],this.FORMAT_SHELL_VALS);
							onelist = onelist.concat(splt);
							sidx = sidx+1;
						}
					var resarr=new Array();
					for (var k=stfieldidx;k<edfieldidx;k++){resarr.push(onelist[k]);}
					values.push([[nvals,introws,intcols],resarr]);
				}
			return values;
		},
		getNodesData : function(){
			var ret = this.getNodesCount();
			var count = ret[0]; var sidx = ret[1]; var lines = ret[2];
			var data = this.__readData();
			
			var nodes = {};
//			var nodes = new Array();
			for (var i=0; i<count; i++)
				{
				 	var splt = this.__splitByColumn(data[sidx + i], this.FORMAT_NODE);
		            nodes[splt[1]] = [splt[2], splt[3], splt[4]];
				 	//	nodes.push([splt[1],splt[2], splt[3], splt[4]]);
				}
	        return nodes;
		},
		getElementsData : function(){
			var ret = this.getShellElementsCount();
			var count = ret[0]; var sidx = ret[1]; var lines = ret[2];
	        var data = this.__readData();
	        
	        //var elements = {};
	        var elements = [];
	        for (var i=0; i<count; i++)
			{
	            splt = this.__splitByColumn(data[sidx + i], this.FORMAT_SHELL_ELEMENT);
	            //elements[splt[1]]= [splt[2], splt[3], splt[4], splt[5], splt[6]];
	            elements.push([splt[1],splt[2], splt[3], splt[4], splt[5], splt[6]]);
			}
	        return elements;
		},
		parseFile : function(){
			var data = this.__readData();
			if (data[0].replace(/^\s+|\s+$/g,"")!="AMAP"){return false;}
			if (data[1].replace(/^\s+|\s+$/g,"")=="10"){this.__hasSolid = true;}
			var counts = this.__splitByColumn(data[2],this.FORMAT_SUMMARY);
			if (counts == null || counts.length ==0) { return false; }
			var total = counts.length;
			if(total > 0){ this.__nDescriptive = counts[0]; }
			if(total > 1){ this.__nTransform = counts[1]; }
			if(total > 2){ this.__nMaterial = counts[2]; }
			if(total > 3){ this.__nNode = counts[3]; }
			if(total > 4){ this.__nShell = counts[4]; }
			if(total > 5){ this.__nVarPerShell = counts[5]; }
			if(total > 6){ this.__nSolid = counts[6]; }
			if(total > 7){ this.__nTetra10 = counts[7]; }
			if(total > 8){ this.__nTetra4 = counts[8]; }
			if(total > 9){ this.__nVarPerSolid = counts[9]; }
			//Getting transformation Block
			var ret = this.getTransformBlocksCount();
			total = ret [0]; var sidx = ret[1]; var junk = ret[2];
			var bgn = sidx;
			for (var i=0; i<total;i++)
				{
					var counts = this.__splitByColumn(data[bgn],this.FORMAT_TRANSFORM_L1);
					bgn = bgn+1+counts[1];
				}
			this.__lnTransform = bgn - sidx;
			var retvar = this.getVariablesPerShellCount();
			var names = new Array();
			var count = retvar[0],sidx = retvar[1];junk = retvar[2];
			for (var j=0;j<count;j++)
				{
					var idx = sidx+j*2;
					var name = this.__splitByColumn(data[idx],this.FORMAT_SHELL_VARS_L1)[0];
					var counts = this.__splitByColumn(data[idx+1],this.FORMAT_SHELL_VARS_L2);
					names.push([name.replace(/^\s+|\s+$/g,""),counts]);
				}
			this.__shellVariablesLn = names;
		}
};

THREE.MxxLoader.prototype.ParseMxx = function (data){
    var s = new Date().getTime();
	var reader = new THREE.MxxLoader.prototype.MxxReader(data);
	reader.parseFile();
	
	var scope = new THREE.Geometry();
	var elementData = reader.getElementsData();
	var nodesData = reader.getNodesData();
	var vert_hash={};
	
	var vertexes = [];
	var faces =[] ;
	var results = [];
	for (nodeid in nodesData)
		{
			var vertex = [nodesData[nodeid][0],nodesData[nodeid][1],nodesData[nodeid][2]];
			var vertexIndex = vert_hash[vertex];
			if (vertexIndex == null) {
	          vertexIndex = vertexes.length;
	          vertexes.push(vertex);
	          vert_hash[vertex] = vertexIndex;
			}
		}
	for (var i=0;i<elementData.length;i++)
		{
			var face_indices=[];
			//console.log(elementData[i]);
			for (var j=1;j<6;j++)
			{
				if (elementData[i][j]==0){continue;}
				var node = nodesData[elementData[i][j]];
				//console.log(node);
				if (node != undefined){
					face_indices.push(vert_hash[node]);
				}
			}
			//console.log(face_indices.length);
			faces.push(face_indices);
		}
//	console.log(reader.getShellVariableNames());
	var variables = reader.getShellVariableNames()
	var variable_hash = {}
	for (var j=0; j<variables.length; j++)
		{
			variable_hash[variables[j]]=reader.getShellValuesForVariable(variables[j]);
		}
	results.push(variable_hash);
//	console.log(results);
//	console.log(faces.length);
//	console.log(elementData.length);
    var e = new Date().getTime();
    console.log("time taken",(e-s),"ms");
    delete reader; 
    return [vertexes,faces,variable_hash];
};

THREE.MxxLoader.prototype.parse = function (data,callback){
	
	var Model = function (){
		var scope = this;
		scope.materials = [];
		THREE.Geometry.call(this);
		var MxxArray = THREE.MxxLoader.prototype.ParseMxx(data);
		this.results = MxxArray[2];

		for (var i=0; i<MxxArray[0].length; i++) {    
		    v(MxxArray[0][i][0], MxxArray[0][i][1], MxxArray[0][i][2]);
		}
		function v(x, y, z) {
		    //console.log("adding vertex: " + x + "," + y + "," + z);
		    scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
		}
		for (var i=0; i<MxxArray[1].length; i++) {
			if (MxxArray[1][i].length==3)
				f3(MxxArray[1][i][0], MxxArray[1][i][1], MxxArray[1][i][2]);
			else if (MxxArray[1][i].length==4)
				f4(MxxArray[1][i][0], MxxArray[1][i][1], MxxArray[1][i][2],MxxArray[1][i][3]);
		}
		function f3(a, b, c) {
		    //console.log("adding face: " + a + "," + b + "," + c)
		    scope.faces.push( new THREE.Face3( a, b, c ) );
		}
		function f4(a, b, c, d) {
		    //console.log("adding face: " + a + "," + b + "," + c)
		    scope.faces.push( new THREE.Face4( a, b, c, d ) );
		}

		this.computeCentroids();
		this.computeFaceNormals();
		this.computeBoundingBox();
		this.computeBoundingSphere();
		//this.computeTangents();
		scope.center_x = (this.boundingBox.x[1]+this.boundingBox.x[0])/2;
		scope.center_y = (this.boundingBox.y[1]+this.boundingBox.y[0])/2;
		scope.center_z = (this.boundingBox.z[1]+this.boundingBox.z[0])/2;
		
		scope.min_x = Math.min(this.boundingBox.x[1],this.boundingBox.x[0]);
		scope.min_y = Math.min(this.boundingBox.y[1],this.boundingBox.y[0]);
		scope.min_z = Math.min(this.boundingBox.z[1],this.boundingBox.z[0]);
		
		scope.max_x = Math.max(this.boundingBox.x[1],this.boundingBox.x[0]);
		scope.max_y = Math.min(this.boundingBox.y[1],this.boundingBox.y[0]);
		scope.max_z =  Math.min(this.boundingBox.z[1],this.boundingBox.z[0]);

	};
	Model.prototype = new THREE.Geometry();
	Model.prototype.constructor = Model;
	callback( new Model() );
};