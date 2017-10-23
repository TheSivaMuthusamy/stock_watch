import React from 'react';
import yahooFinance from 'yahoo-finance';
import * as d3 from "d3";
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

export default class Chart extends React.Component {
	constructor() {
		super();
		this.state = {
			data: []
		}
		this.getChart = this.getChart.bind(this)
		this.createChart = this.createChart.bind(this)
	}



	getChart(symbol, interval = '1d', range = '1y') {
		const query = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?formatted=true&lang=en-US&region=US&interval=${interval}&events=div%7Csplit&range=${range}&corsDomain=finance.yahoo.com`;
		function round(value, decimals) {
  			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}
		fetch(query)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				const rounded = data.chart.result[0].indicators.quote[0].close
				.filter(function(value){
					return value
				})
				.map(function(value, i){
					return {close: round(value, 2), date: new Date(data.chart.result[0].timestamp[i] * 1000)}
				})
				this.setState({
					data: rounded,
				})
			})
	}

	componentDidMount() {
      	this.getChart('AAPL', '90m', '1mo')
   	}
   	
   	componentDidUpdate() {
   		this.createChart()
   	}
   	
   	createChart() {
    	var svg = d3.select("svg"),
   			margin = {top: 10, right: 20, bottom: 30, left: 50},
    		width = +svg.attr("width") - margin.left - margin.right,
    		height = +svg.attr("height") - margin.top - margin.bottom,
    		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   		
   		var x = d3.scaleTime()
    		.rangeRound([0, width]);

    	var y = d3.scaleLinear()
    		.rangeRound([height, 0]);


		var zoom = d3.zoom()
		    .scaleExtent([1, 3])
		    .translateExtent([[-100, -100], [width + 90, height + 100]])
		    .on("zoom", zoomed);


    	var area = d3.area()
    		.x(function(d) { return x(d.date); })
    		.y0(height)
    		.y1(function(d) { return y(d.close); });

    	var line = d3.line()
    		.x(function(d) { return x(d.date); })
    		.y(function(d) { return y(d.close); });

    	function make_x_gridlines() {		
    		return d3.axisBottom(x)
    			.ticks(5)
		}


		function make_y_gridlines() {		
    		return d3.axisLeft(y)
        		.ticks(5)
		}

		function zoomed() {
			let e = d3.event;
			let tx = Math.min(0, Math.max(e.transform.x, width - width*e.transform.k));
  			let ty = Math.min(0, Math.max(e.transform.y, height - height*e.transform.k));
			dataarea.attr("transform", 'translate(' + [tx,ty] + ')scale(' + e.transform.k + ')')
			dataline.attr("transform", 'translate(' + [tx,ty] + ')scale(' + e.transform.k + ')')
			console.log([tx, ty, e.transform.k])
			var t = d3.zoomIdentity.translate(tx, ty).scale(e.transform.k);
			console.log(t)
  			gX.call(xAxis.scale(t.rescaleX(x)));
  			gY.call(yAxis.scale(t.rescaleY(y)));
		}

		var ydee = d3.extent(this.state.data, function(d) { return d.close; })
		ydee[1] = ydee[1] + 1
		console.log(ydee)
    	x.domain(d3.extent(this.state.data, function(d) { return d.date; }));
  		y.domain(ydee);

  		const xValues = this.state.data.filter((d, i) => i % 32 === 0).map(d => d.date)

  		var xAxis = d3.axisBottom(x).ticks(5)

      	var yAxis = d3.axisLeft(y).ticks(5)
  	
      	g.append('defs')
  			.append('clipPath')
  			.attr('id', 'clip')
  			.append('rect')
    		.attr('x', 0)
    		.attr('y', 0)
    		.attr('width', width)
    		.attr('height', height);

    	const main = g.append('g')
      	.attr('class', 'main')
      	.attr('clip-path', 'url(#clip)');

    	var view = main.append("rect")
    				.attr("class", "view")
   				 	.attr("x", 0.5)
    				.attr("y", 0.5)
    				.attr("width", width)
    				.attr("height", height)
    				.call(zoom);

    	main.append("g")			
      		.attr("class", "grid")
      		.attr("transform", "translate(0," + height + ")")
      		.call(make_x_gridlines()
          		.tickSize(-height)
          		.tickFormat("")
      		)	

  
  		main.append("g")			
      		.attr("class", "grid")
      		.call(make_y_gridlines()
          		.tickSize(-width)
          		.tickFormat("")
      		)
  		
  		var gX = g.append("g")
      		.attr("transform", "translate(0," + height + ")")
      		.attr("class", "axis")
      		.call(xAxis)


	  	var gY = g.append("g")
	  		.attr("class", "axis")
	      	.call(yAxis)

	  	var dataarea = main.append("path")
	  		.datum(this.state.data)
	       	.attr("fill", "#99FFCE")
	       	.attr("stroke-width", 0)
	       	.attr("d", area);


	  	var dataline = main.append("path")
	      	.datum(this.state.data)
	      	.attr("fill", "none")
	      	.attr("stroke", "#00E676")
	      	.attr("stroke-linejoin", "round")
	      	.attr("stroke-linecap", "round")
	      	.attr("stroke-width", 3)
	      	.attr("d", line);

	    g.call(zoom)
}


	render() {
		return (
			<svg ref={node => this.node = node}
      		width={960} height={500}>
      		</svg>
		)
	}
}
