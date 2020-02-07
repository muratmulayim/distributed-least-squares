var Statistics = (function () {
	var module = {
		id: "distributed-least-squares.webapps.code.Statistics",
		load: function () {
			Logger.log(module.id, "load()");
		},

		showCentralised: function (parentId, a_array, b_array, b_result_array) {
			Logger.log(module.id, "Statistic info will be displayed soon.");
			var data = [];
			
			var initialObject = {
				x: a_array,
				y: b_array,
				text: [],
				name: 'Initial (a, b) values',
				mode: 'markers',
				marker: {
					color: 'rgb(0, 255, 0)',
					size: 8
				}
			};
			
			var resultObject = {
				x: a_array,
				y: b_result_array,
				text: [],
				name: 'Linear (a, b) values',
				mode: 'lines+markers',
				marker: {
					color: 'rgb(255, 0, 0)',
					size: 8
				},
				line: {
					color: 'rgb(255, 0, 0)',
					width: 3
				}
			};
			
			data.push(initialObject);
			data.push(resultObject);
			
			var layout = {
				title: 'Centralised Least Squares Chart - ' + Plotly.version
			};
			
			var config = {
				displayModeBar: true,
				displaylogo: false,
				sendData: false,
				modeBarButtonsToRemove: ["toImage", "zoom2d", "sendDataToCloud", "select2d", "lasso2d", "autoScale2d", "resetScale2d", "hoverCompareCartesian"]
				
			};
			Plotly.newPlot(parentId, data, layout, config);

		},
		
		showDistributed: function (parentId, a_array, b_array, b_result_array) {
			
		},

		hideStatistics: function () {}
	};

	return module;
}());
