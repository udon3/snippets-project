if (typeof Graphs === "undefined") {
    var Graphs = {};
}

/*
Adapted from http://www.smashingmagazine.com/2011/09/23/create-an-animated-bar-graph-with-html-css-and-jquery/
*/



Graphs = {

	opts: {
		useYAxis: false, //can omit the y-axis
		graphsContainerClass: '.tableGraphs', //there can be more than one wrapper on a page
		graphTableWrapClass: '.tg-wrap', //individual table-graph wrapper, as children of the above
		genGraphContainer: '<div class="gg-wrap"></div>', //generated container for graph + caption heading
		genHeading: 'h3', //change if this needs to be another element (caption text will be reperesented)		
		headingClass: 'gg-caption', //class for the heading
		genGraph: '<div class="gg"></div>', //generated graph element
		genBars: '<div class="gg__bars"></div>', //Bars for generated graph element
		genBarGroup: '<div class="gg__bar-wrap"></div>' //generated bar group (column for each bar)
	},

	vars: {
		barDataArray: [],
		barData: null
	},

	init: function(){

		var $graphsContainer = $(Graphs.opts.graphsContainerClass);

		var dataArray = [];

		if ($graphsContainer.length > 0){

			var $graphwrap = $(Graphs.opts.graphTableWrapClass), //html code individual table/graph wrapper
					$tables = $('table', $graphsContainer); //array of all tables in the big graphs wrapper

			$tables.each(function(){
				//Create graph from the data table(tableId) 
				//and specify a container for it (chartContainer)
				var tableId =  '#' + this.id,
						chartContainer = $(this).parent();

				Graphs.createGraph(tableId, chartContainer);
				// /console.log('from init', Graphs.vars.barData);
				dataArray.push(Graphs.vars.barData);
				
			});			
		}	

		Graphs.vars.barDataArray = dataArray;
		//console.log('from init', Graphs.vars.barDataArray);
	},

	reset: function(){
		//reset all graphs
		var resetDataArray = Graphs.vars.barDataArray;
		var $graphs = $('.gg');

		$graphs.each(function(i){
			Graphs.resetGraph(resetDataArray[i]);
		});
	},

	//Main function: initialised with 2 arguments:
	//data: table id from wwhich to get data
	//container: dom element into which graph is appended 
	createGraph: function(data, container){	

		// Declare some common variables and container elements	
		var bars = [],
				$genGraphContainer = $(Graphs.opts.genGraphContainer),
				$genGraph = $(Graphs.opts.genGraph),
				$genBars = $(Graphs.opts.genBars),
				$data = $(data),
				$container = $(container),
				chartData,		
				chartYMax,
				columnGroups,
				//Timer variables
				barTimer,
				graphTimer;		
		
		// Create table data object
		var tableData = {

			// Get numerical data from table cells
			chartData: function() {
				var chartdata = [];
				$data.find('tbody td').each(function() {
					chartdata.push($(this).text());
				});
				//console.log(chartdata);
				return chartdata;
			},

			// Get heading data from table caption
			chartHeading: function() {
				var chartHeading = $data.find('caption').text();
				//console.log(chartHeading);
				return chartHeading;
			},			

			// Get highest value for y-axis scale
			chartYMax: function() {
				var chartdata = this.chartData();
				// Round off the value
				var chartYmax = Math.ceil(Math.max.apply(Math, chartdata)) ;
				var chartMaxNum = (chartYmax /900)*1000;
				//console.log('from chartYMax',chartMaxNum);
				return chartMaxNum;
			},

			// Get y-axis data from table cells
			yLegend: function() {
				var chartYmax = this.chartYMax();
				var yLegend = [];
				// Number of divisions on the y-axis
				var yAxisMarkings = 5;						
				// Add required number of y-axis markings in order from 0 - max
				for (var i = 0; i < yAxisMarkings; i++) {
					yLegend.unshift(((chartYmax * i) / (yAxisMarkings - 1)) / 1000);
				}
				//console.log(yLegend);
				return yLegend;
			},

			// Get x-axis data from table header
			xLegend: function() {
				var xLegend = [];
				// Find th elements in table header - that will tell us what items go in the x-axis legend
				$data.find('thead th').each(function() {
					xLegend.push($(this).text());
				});
				//console.log(xLegend);
				return xLegend;
			},

			// Sort data into groups based on number of columns
			columnGroups: function() {
				//each table will output an array of data
				var columngroup = [];

				// Get number of columns from first row of table body
				var columns = $data.find('tbody tr:eq(0) td').length;

				//iterate thru each column
				for (var i = 0; i < columns; i++) {
					columngroup[i] = [];

					setColgroupArray(i);
				}

				function setColgroupArray(index){
					$data.find('tbody tr').each(function() {
						columngroup[index].push($(this).find('td').eq(index).text());
					});
				}
				//console.log('columngroup: ' + columngroup);
				return columngroup;
			}
		};//end tableData object
		
		// variables for accessing table data functions	
		chartData = tableData.chartData();		
		chartYMax = tableData.chartYMax();
		
		columnGroups = tableData.columnGroups();
		
		// Construct the graph
		
		Graphs.addBars(columnGroups, chartYMax, bars, $genBars);
		//console.log(columnGroups,chartYMax);
		Graphs.addHeading($genGraphContainer, tableData.chartHeading());
				
		Graphs.addXAxis($genGraph, tableData.xLegend());//try this from inside addBars
		
		// Add y-axis to graph (optional)
		if (Graphs.opts.useYAxis){			
			Graphs.addYAxis($genGraph, tableData.yLegend());
		}

		//append components to view:
		//bars:
		$genBars.appendTo($genGraph);		
		
		//graph:
		$genGraph.appendTo($genGraphContainer);
		
		//graph container to main container:
		$genGraphContainer.appendTo($container);
		
		//Reset graph settings and prepare for display
		Graphs.resetGraph(bars, barTimer, graphTimer);
		//console.log('the data going to resetGraph function: ', bars);	
		Graphs.vars.barData = bars;

	},

	//add bars to graph
	addBars: function(columnGroups, chartYMax, bars, $genBars ){
		// Loop through column groups, adding bars as we go
		$.each(columnGroups, function(i) {
			// Create bar group container
			var barGroup = $(Graphs.opts.genBarGroup);
			// Add bars inside each column
			for (var j = 0, k = columnGroups[i].length; j < k; j++) {
				// Create bar object to store properties (label, height, code etc.) and add it to array
				// Set the height later in displayGraph() to allow for left-to-right sequential display
				var barObj = {};
				barObj.label = this[j];
				barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
				//console.log(barObj.height);
				barObj.bar = $('<div class="gg__bar bar-' + i + '"><span>' + barObj.label + '</span></div>')
					.appendTo(barGroup);
				bars.push(barObj);
			}
			// Add bar groups to graph
			barGroup.appendTo($genBars);

			//add the x-axis to each bar
			$(barObj.bar).each(function(index){
				$(this).append('<em class="x-legend"></em>');
			});
			
		});
	},

	// Add heading to graph
	addHeading: function($genGraphContainer, fn){
		var chartHeading = fn,
				headerEl = Graphs.opts.genHeading,
				headingClass = Graphs.opts.headingClass,
				heading = $('<'+headerEl+' class="'+headingClass+'">' + chartHeading + '</'+headerEl+'>');
		heading.appendTo($genGraphContainer);
	},
		
	addXAxis: function($genGraph, fn){
		// Add x-axis to graph
		var xLegend	= fn;		//return an array of theaders
		var xAxisList	= $('<div class="gg__x-axis"></div>');
		$.each(xLegend, function(i) {			
			var listItem = $('<span>' + this + '</span>')
				.appendTo(xAxisList);
		});
		xAxisList.appendTo($genGraph);
	},
	
	addYAxis: function($genGraph, fn){
		var yLegend	= fn;
		var yAxisList	= $('<ul class="gg__y-axis"></ul>');
		$.each(yLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(yAxisList);
		});
		yAxisList.appendTo($genGraph);	
	},		
		
	// Set individual height of bars
	displayGraph: function(bars, i) {
		// Changed the way we loop because of issues with $.each not resetting properly
		if (i < bars.length) {
			
			// Add transition properties and set height via CSS

			$(bars[i].bar).css({'height': bars[i].height, 'transition': 'all 0.8s ease-out'});
			
			// Wait the specified time then run the displayGraph() function again for the next bar
			barTimer = setTimeout(function() {
				i++;				
				Graphs.displayGraph(bars, i);
			}, 100);
		}
	},

	//Reset graph settings and prepare for display
	resetGraph: function(bars, barTimer, graphTimer){
		//Set bar height to 0 and clear all transitions
			//console.log(bars);
			$.each(bars, function(i) {
				$(bars[i].bar).stop().css({'height': 0, 'transition': 'none'});
				//console.log($(bars[i].bar));
			});
			
			// Clear timers
			clearTimeout(barTimer);
			clearTimeout(graphTimer);
			
			// Restart timer		
			graphTimer = setTimeout(function() {		
				Graphs.displayGraph(bars, 0);
			}, 200);
	}

};