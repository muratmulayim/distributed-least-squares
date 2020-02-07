var Bootloader = (function () {
	var module = {
		id: "distributed-least-squares.webapp.code.Bootloader",
		load: function () {
			Logger.load();
			Logger.log(module.id, "load()");
			NodeFactory.load();
			Data.load();
			Statistics.load();
			_load();
		}
	};
	
	var A_GRAPH = [];
	var X = [];
	var statisticsData = [];
	var MAX_STEP_COUNT = 300;
	var adjacencyMatrix = [];
	
	var A_matrix = [];
	var b_matrix = [];
	
	// DOM
	var graphAdjacenciesNode;
	var graphNextValuesNode;
	var centralisedSolutionNode;
	var graphInitialValuesNode;
	var distributedSolutionContainerNode;
	
	var DOMFactory = function (nodeId) {
		this.node = window.document.getElementById(nodeId);
		
		this.__proto__ = {
			show: function () {
				this.node.classList.remove("hidden");
			},
			
			hide: function () {
				this.node.classList.add("hidden");
			},
			
			setRelativePosition: function (top, left) {
				this.node.style.top = top + "%";
				this.node.style.left = left + "%";
			},
			
			getSubString: function (text) {
				return "<sub>" + text + "</sub>";
			},
			
			getSuperString: function (text) {
				return "<sup>" + text + "</sup>";
			},
			
			setSubString: function (text) {
				this.node.innerHTML += "<sub>" + text + "</sub>";
			},
			
			setSuperString: function (text) {
				this.node.innerHTML += "<sup>" + text + "</sup>";
			},
			
			addHTML: function (text) {
				this.node.innerHTML += text;
			},
			
			setHTML: function (text) {
				this.node.innerHTML = text;
			},
			
			clearHTML: function() {
				this.node.innerHTML = "";
			},
			
			newLine: function() {
				this.node.innerHTML += "<br>";
			},
			
			setText: function(text) {
				this.node.innerText = text;
			},
			
			getTab: function() {
				return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			},
			
			setTab: function() {
				this.node.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			},
			
			createChild: function(id, className) {
				var element = document.createElement("div");
				element.setAttribute("id", id);
				element.setAttribute("class", className);
				
				this.node.appendChild(element);
				
				return new DOMFactory(id);
			}
		};
		
		return this;
	};
	
	/*
	* Usage: "{0} is {1}".format(2, "number")
	*/
	String.prototype.format = function() {
		var formatted = this;
		for (var i = 0; i < arguments.length; i++) {
			var regexp = new RegExp('\\{'+i+'\\}', 'gi');
			formatted = formatted.replace(regexp, arguments[i]);
		}
		return formatted;
	};
	
	function _loadDOMNodes() {
		graphAdjacenciesNode = new DOMFactory("graphAdjacencies");
		graphInitialValuesNode = new DOMFactory("graphInitialValues");
		graphNextValuesNode = new DOMFactory("graphNextValues");
		centralisedSolutionNode = new DOMFactory("centralisedSolution");
		distributedSolutionContainerNode = new DOMFactory("distributedSolutionContainer");
	}
	
	/*
	function _randomTopo(nodeCount) {
		var topo = [];
		
		for(var row = 0; row < nodeCount; row++) {
			topo.push();
			topo[row] = [];
			for(var column = 0; column < nodeCount; column++) {
				if(row == column) {
					topo[row][column] = false;
				} else if(row < column) {
					var rnd = Math.round(Math.random() * 1);
					topo[row][column] = rnd == 1 ? true : false;
				} else {
					topo[row][column] = topo[column][row];
				}		
			}
		}
		
		return topo;
	}
	
	function _randomInitialValues(nodeCount) {
		var vals = [];
		
		for(var row = 0; row < nodeCount; row++) {
			vals.push();
			
			var a_val = Math.round(Math.random() * 9);
			var b_val = Math.round(Math.random() * 9);
			
			vals[row] = [a, b];
		}
		
		return vals;
	}*/
	
	function _printInfo() {
		var statisticsData_A_matrix = [];
		var statisticsData_b_matrix = [];
		var statisticsData_res_b_matrix = [];
		
		graphInitialValuesNode.clearHTML();
		var measurements = Data.measuredValues;
		for(var i = 0; i < measurements.length; i++) {
			graphInitialValuesNode.addHTML("X" + graphInitialValuesNode.getSubString(i + 1) + ": ( " + measurements[i][0] + ', ' + measurements[i][1] + ' )');
			graphInitialValuesNode.newLine();
		}	
		
		centralisedSolutionNode.clearHTML();
		
		centralisedSolutionNode.addHTML('&theta; = ( ');
		centralisedSolutionNode.addHTML(math.format(math.transpose(A_matrix)));
		centralisedSolutionNode.addHTML(' * ');
		centralisedSolutionNode.addHTML(math.format(A_matrix));
		centralisedSolutionNode.addHTML(' )' + centralisedSolutionNode.getSuperString('-1'));
		centralisedSolutionNode.addHTML(' * ');
		centralisedSolutionNode.addHTML(math.format(math.transpose(A_matrix)));
		centralisedSolutionNode.addHTML(' * ');
		centralisedSolutionNode.addHTML(math.format(b_matrix));
		
		centralisedSolutionNode.newLine();
		
		var result = math.multiply(math.multiply(math.inv(math.multiply(math.transpose(A_matrix), A_matrix)), math.transpose(A_matrix)), b_matrix);
		centralisedSolutionNode.addHTML('&theta; = ' + math.format(result));
		centralisedSolutionNode.newLine();
		centralisedSolutionNode.newLine();
		
		for(var i = 0; i < measurements.length; i++) {
			centralisedSolutionNode.addHTML("X" + centralisedSolutionNode.getSubString(i + 1) + ": ( " + measurements[i][0] + ', ' + (measurements[i][0]*result[0][0]) + ' )');
			centralisedSolutionNode.newLine();
			statisticsData_A_matrix.push(measurements[i][0]);
			statisticsData_b_matrix.push(measurements[i][1]);
			statisticsData_res_b_matrix.push(measurements[i][0]*result[0][0]);
		}
		
		NodeFactory.centralizedSolutionResult = result[0][0];
		
		Statistics.showCentralised("centralisedStatisticContainer", statisticsData_A_matrix, statisticsData_b_matrix, statisticsData_res_b_matrix);
		
	}
	
	function _loadMeasurements() {
		var measurements = Data.measuredValues;
		
		for(var row = 0; row < measurements.length; row++) {
			A_matrix.push([measurements[row][0]]);
			b_matrix.push([measurements[row][1]]);
		}
	}
	
	function _obtainAdjacencyMatrix() {
		var topo = Data.adjacencies;
		
		for(var row = 0; row < topo.length; row++) {
			adjacencyMatrix.push();
			adjacencyMatrix[row] = [];
			for(var column = 0 ; column < topo[0].length; column++) {
				if(topo[row][column]) {
					adjacencyMatrix[row].push(column);
				}
			}
		}
		Logger.log(module.id, "adjacencyMatrix: " + math.format(adjacencyMatrix));
	}
	
	function _startDistributedLeastSquare() {
		var measurements = Data.measuredValues;
		for (var i = 0; i < adjacencyMatrix.length; i++) {
			var nodeDomElement = distributedSolutionContainerNode.createChild("distributedElement" + (i+1), "distributed-element node-" + (i+1));
			var node = NodeFactory.createOne(i, adjacencyMatrix[i], measurements[i][0], measurements[i][1], nodeDomElement);
			node.iterate();
		}
	}

	function _load() {
		_loadDOMNodes();
		
		/*
		* Produces a random graph matrix and an initial values array.
		* In order to run the example that resides in Figure 57 in the course book, comment in following 2 lines of codes.
		*/
		// Data.adjacencies = _randomTopo(5);
		// Data.X = _randomInitialValues(5);

		_obtainAdjacencyMatrix();
		
		_loadMeasurements();
		_printInfo();
		
		_startDistributedLeastSquare();
	}

	return module;
	
}());