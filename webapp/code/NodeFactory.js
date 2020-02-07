var NodeFactory = (function () {
	var module = {
		id: "distributed-least-squares.webapps.code.NodeFactory",
		load: function () {
			Logger.log(module.id, "load()");
		},
		
		nodeMap: {},
		
		centralizedSolutionResult: 0,
		
		createOne: function (id, neighbors, a, b, DOMnode) {
			var node = new Node(id, neighbors, a, b, DOMnode);
			this.nodeMap[id] = node;
			Logger.log(module.id, "Node-" + (id+1) + " is created");
			return node;
		}
	};
	
	function Node(id, neighbors, a, b, DOMnode) {
		this.id = id;
		this.neighbors = neighbors;
		this.a = a;
		this.b = b;
		this.teta_zero = 0;
		this.teta_last = 0;
		this.received_A_s = {};
		this.received_b_s = {};
		this.N = 1;
		this.converged = false;
		this.DOMnode = DOMnode;
		
		this.DOMnode.clearHTML();
		this.DOMnode.addHTML("Node-" + (this.id + 1) + " results");
		this.DOMnode.newLine();
	}
	
	Node.prototype.setNeighbors = function (neighborList) {
		this.neighbors = neighborList;
	}
	
	Node.prototype.addNeighbors = function (neighborList) {
		for(neighbor in neighborList) {
			neighborList.push(neighbor)
		}
	}
	
	Node.prototype.clearNeighbors = function (neighborList) {
		neighborList = [];
	}
	
	Node.prototype.iterate = function () {
		setTimeout( function (node) {
			if(!node.converged){
				Logger.log(module.id, "Node-" + (node.id+1) + ": iterate()");
				node.teta_zero = node.teta_last;
				
				// Formula is: teta = ((1/N*(all a_i*a_i))^(-1)*)(1/N*(all a_i*b_i))
				// 			 : teta = (all a_i*b_i)/(all a_i*a_i)
				var upperResult = node.a*node.b; // a*b
				var lowerResult = node.a*node.a; // a*a
				for(var nodeId in node.received_A_s) {
					upperResult += node.received_A_s[nodeId]*node.received_b_s[nodeId];
					lowerResult += node.received_A_s[nodeId]*node.received_A_s[nodeId];
				}
				
				node.teta_last = (upperResult / lowerResult);
				
				// b = a*teta + teta_0
				node.b = node.a*node.teta_zero + node.teta_last;
				
				Logger.log(module.id, "Node-" + (node.id+1) + ": iterate(), teta_last: " + node.teta_last + ", values: (" + node.a + ", " + node.b + ")");
				
				node.DOMnode.addHTML("&theta; : " + node.teta_last + node.DOMnode.getTab() + "- (a, b) : (" + node.a + ", " + node.b + ")");
				node.DOMnode.newLine();
				if(_isConverge(node.teta_last)){
					node.converged = true;
					Logger.log(module.id, "********* Node-" + (node.id+1) + ": iterate(), teta_last: " + node.teta_last + ", final values: (" + node.a + ", " + node.b + ")")
				}
				node.sendMessage({
					a: node.a,
					b: node.b
				});
			}
		}, 100, this);
	}
	
	Node.prototype.receiveMessage = function (fromNodeId, msg) {
		Logger.log(module.id, "Node-" + (this.id+1) + ": receiveMessage(), msg: " + math.format(msg));
		
		if(this.received_A_s.fromNodeId == undefined) {
			this.N++;
		}
		
		this.received_A_s[fromNodeId] = msg.a;
		this.received_b_s[fromNodeId] = msg.b;
		
		this.iterate();
	}
	
	Node.prototype.sendMessage = function (msg) {
		Logger.log(module.id, "Node-" + (this.id+1) + ": sendMessage(), msg: " + math.format(msg));
		for(var i = 0; i < this.neighbors.length; i++) {
			module.nodeMap[this.neighbors[i]].receiveMessage(this.id, msg);
		}
	}
	
	function _isConverge(value) {
		return (Math.round(value*100)/100 == Math.round(module.centralizedSolutionResult*100)/100)
	}
	
	
	return module;
}());
