
//This is a jquery plugin that takes a data table and generates an animated graph

(function ($) {
 
  $.fn.generateGraph = function( options ) {

    var defaults = {
      // These are the defaults.
      // could do with more finesse!
      hideTable: true,
      tableClass: 'graph-table', //there can be more than one wrapper on a page
      genHeading: 'h3', //change if this needs to be another element (caption text will be reperesented)      
      headingClass: 'gg-caption', //class for the heading
      useYAxis: true, //can omit the y-axis
      yAxisSegments: 5, //only set if useYAxis is true 
      barsMultiColour: true, //false if no hooks needed for colouring each bar differently
      barsTransitionSpeed: '.8', //control graph bars transition speed
      barTooltips: false //show bar data text on hover 
    };

    // Merge options
    var settings = $.extend({
                        complete: null, // set up for a callback      
                        genGraphContainer: '<div class="gg-wrap"></div>', //generated container for graph + caption heading
                        genGraph: '<div class="gg"></div>', //generated graph element
                        genBars: '<div class="gg__bars"></div>', //Bars for generated graph element
                        genBarGroup: '<div class="gg__bar-wrap"></div>' //generated bar group (column for each bar)
                    }, defaults, options );

    // return, so that the plugin action can be chainable
    // the this keyword refers to the object the function is called on, and we iterate through each matching dom object with $.each()
    return this.each(function() {
      // Plugin code would go here...

      //allow for call backs:
      if ($.isFunction(settings.complete)){
        settings.complete.call(this);
      }

      // run the graphs code
      ggGraphs(settings, this);

      if (settings.hideTable){
        $(this).addClass('hide-table');
      }

    });


    // All the plugin functions here:
    function ggGraphs(settings, object){

      var Graphs = {

        vars: {
          barDataArray: [],
          barData: null
        },

        init: function(){

          var $tables = $('.'+settings.tableClass);

          var dataArray = [];

          var tableObj = object;

          if ($tables.length > 0){

            (function(){
              //Create graph from the data table(tableId) 
              //and specify a container for it (chartContainer)
              var tableId =  '#' + tableObj.id,
                  chartContainer = $(tableObj).parent();

              Graphs.createGraph(tableId, chartContainer);

              var barDataObjArray = Graphs.vars.barData;

              dataArray.push(Graphs.vars.barData);

              // This could do with being extracted and exposed:
              $('#reset').on('click', function(e){ 
                //passing the object('this'), and an array of data objects 
                Graphs.reset(tableObj, dataArray);
                e.preventDefault();
              });
              
            })();  

          } 
        },

        reset: function(tableObj, dataArray){

          //interate the array of data objects and reset each graph
          $(tableObj).each(function(i){            
            Graphs.resetGraph(dataArray[i]);
          });

        },

        //Main function: initialised with 2 arguments:
        //data: table id from wwhich to get data
        //container: dom element into which graph is appended 
        createGraph: function(data, container){ 

          // Declare some common variables and container elements 
          var bars = [],
              $genGraphContainer = $(settings.genGraphContainer),
              $genGraph = $(settings.genGraph),
              $genBars = $(settings.genBars),
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
              return chartMaxNum;
            },

            // Get y-axis data from table cells
            yLegend: function() {
              var chartYmax = this.chartYMax();
              var yLegend = [];
              // Number of divisions on the y-axis
              var yAxisSegments = settings.yAxisSegments +1; //number of y-axis rows  

              //need a function to calculate the y-axis legends (so if 0 - 8, in 4 rows, it's 2,4,6,8)



              // Add required number of y-axis markings in order from 0 - max
              for (var i = 0; i < yAxisSegments; i++) {
                yLegend.unshift(((chartYmax * i) / (yAxisSegments - 1)));
                //yLegend = Math.ceil(parseInt(yLegend)).toString();
              }
              
              //yLegend = integer.toString();
              return yLegend;
            },

            // Get x-axis data from table header
            xLegend: function() {
              var xLegend = [];
              // Find th elements in table header - that will tell us what items go in the x-axis legend
              $data.find('thead th:not([scope="row"])').each(function() { //:not([scope="row"])
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
          if (settings.useYAxis){      
            Graphs.addYAxis($genGraph, tableData.yLegend());
            $genGraph.addClass('gg--has-yaxis');
          }

          //append components to view:
          //bars:
          $genBars.appendTo($genGraph);   
          
          //graph:
          $genGraph.appendTo($genGraphContainer);
          
          //graph container to main container:
          $(container).append('<div class="gg-wrap"></div>');
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
            var barGroup = $(settings.genBarGroup);
            // Add bars inside each column
            for (var j = 0, k = columnGroups[i].length; j < k; j++) {
              // Create bar object to store properties (label, height, code etc.) and add it to array
              // Set the height later in displayGraph() to allow for left-to-right sequential display
              var barObj = {};
              barObj.label = this[j];
              barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
              //console.log(barObj.height);

              //add hooks to bars for styling?
              var barClass = '',
                  tooltipClass = '';              
              if (settings.barsMultiColour){
                barClass = ' bar-' + i;
              }
              if (settings.barTooltips){
                tooltipClass = ' gg__bar--tooltip';
              }

              barObj.bar = $('<div class="gg__bar' + barClass + tooltipClass + '"><span>' + barObj.label + '</span></div>')
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
              headerEl = settings.genHeading,
              headingClass = settings.headingClass,
              heading = $('<'+headerEl+' class="'+headingClass+'">' + chartHeading + '</'+headerEl+'>');
          heading.appendTo($genGraphContainer);
        },
          
        addXAxis: function($genGraph, fn){
          // Add x-axis to graph
          var xLegend = fn;   //return an array of theaders
          var xAxisList = $('<div class="gg__x-axis"></div>');
          $.each(xLegend, function(i) {    

            var listItem = $('<span>' + this + '</span>')
              .appendTo(xAxisList);

          });
          xAxisList.appendTo($genGraph);
        },
        
        addYAxis: function($genGraph, fn){
          if (settings.useYAxis){
            var yLegend = fn;
            var yAxisList = $('<ul class="gg__y-axis"></ul>');
            $.each(yLegend, function(i) {   

              yNum = Math.ceil(this);

              var listItem = $('<li><span>' + yNum + '</span></li>')
                .appendTo(yAxisList);

            });
            yAxisList.appendTo($genGraph);    
          }
          
        },    
          
        // Set individual height of bars
        displayGraph: function(bars, i) {
          // Changed the way we loop because of issues with $.each not resetting properly
          if (i < bars.length) {
            // Add transition properties and set height via CSS
            $(bars[i].bar).css({'height': bars[i].height, 'transition': 'height ' +settings.barsTransitionSpeed+ 's ease'}); //'transition': 'all 0.8s ease-out'
            // Wait the specified time then run the displayGraph() function again for the next bar
            barTimer = setTimeout(function() {
              i++;        
              Graphs.displayGraph(bars, i);
            }, 100);
          }
        },

        //Reset graph settings and prepare for display
        //used initially on load, as well as with the reset function
        resetGraph: function(bars, barTimer, graphTimer){
          //Set bar height to 0 and clear all transitions

            //console.log(bars); //ISSUE with reset function: Currently returning an array of arrays rather than an array of objects

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

      Graphs.init();
     
      //$('#reset').on('click',function(){ Graphs.reset();});
    }

  };
 
}(jQuery));

//$('table').generateGraph({})








