var Data = (function () {
	var module = {
		id: "distributed-least-squares.webapp.code.Data",
		
		adjacencies: [
			[false, true, false, false, false, false],
			[true, false, true, false, true, false],
			[false, true, false, true, false, true],
			[false, false, true, false, false, true],
			[false, true, false, false, false, false],
			[false, false, true, true, false, false]
		],
		
		/*
		* Represents measured a and b values
		* [a1, b1]
		* [a2, b2]
		* ...
		*/
		measuredValues: [
			[2, 3],
			[8, 8],
			[4, 3],
			[1, 5],
			[8, 5],
			[6, 3],
		],

		load: function () {
			Logger.log(module.id, "load()");
		}
	};

	return module;

}
	());