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

  componentDidMount() {
   this.getChart('AAPL', '90m', '1mo')
  }
    
  componentDidUpdate() {
   this.createChart()
  }

	getChart(symbol, interval = '1d', range = '1y') {
		const query = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?formatted=true&lang=en-US&region=US&interval=${interval}&events=div%7Csplit&range=${range}&corsDomain=finance.yahoo.com`;
		function round(value, decimals) {
			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}
		fetch(query)
			.then(response => response.json())
			.then(data => {
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

  createChart() {
    const self = this
    const svg = d3.select("svg"),
   	margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var parseTime = d3.timeFormat("%B %d, %Y"), 
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };
   		
    const x = d3.scaleTime()
    	.rangeRound([0, width - 2]);

    const y = d3.scaleLinear()
    	.rangeRound([height, 10]);

    let testx = x
    let testy = y

    const zoom = d3.zoom()
  		.scaleExtent([1, 4])
  		.translateExtent([[-100, -100], [width + 90, height + 100]])
  		.on("zoom", zoomed)



    const line = d3.line()
    	.x(function(d) { return x(d.date); })
    	.y(function(d) { return y(d.close); });

    function make_x_gridlines() {		
    	return d3.axisBottom(x)
    		.ticks(5);
		}

  	function make_y_gridlines() {		
      return d3.axisLeft(y)
        .ticks(5);
  	}

  	function zoomed() {
  		const e = d3.event;
  		const tx = Math.min(0, Math.max(e.transform.x, width - width*e.transform.k));
    	const ty = Math.min(0, Math.max(e.transform.y, height - height*e.transform.k));
  		dataline.attr("transform", 'translate(' + [tx,ty] + ')scale(' + e.transform.k + ')');
      focus.attr("transform", 'translate(' + [tx,ty] + ')scale(' + e.transform.k + ')');
  		const t = d3.zoomIdentity.translate(tx, ty).scale(e.transform.k);
    	gX.call(xAxis.scale(t.rescaleX(x)));
    	gY.call(yAxis.scale(t.rescaleY(y)));
      testx = t.rescaleX(x)
      testy = t.rescaleY(y)
    	gridX.call(make_x_gridlines()
    		.scale(t.rescaleX(x))
    		.tickSize(-height)
        .tickFormat(""))
    	gridY.call(make_y_gridlines()
    		.scale(t.rescaleY(y))
    		.tickSize(-width)
        .tickFormat(""))
      focus.style("display", "none")
  	}
    
    function mousemove() {

      const x0 = testx.invert(d3.mouse(this)[0]),
          i = bisectDate(self.state.data, x0, 1),
          d0 = self.state.data[i - 1],
          d1 = (self.state.data[i]) ? self.state.data[i] : d0,
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + testx(d.date) + "," + testy(d.close) + ")");
      focus.select(".ytooltip").text(formatCurrency(d.close));
      focus.select(".xtooltip").text(parseTime(d.date));
      focus.select(".x-hover-line").attr("y2", height - testy(d.close));
      focus.select(".y-hover-line").attr("x2", -width - testx(d.date) + 890.5);
      focus.select(".ytooltip").attr("x", -width - testx(d.date) + 843.5);
      focus.select(".xtooltip").attr("y",height - testy(d.close) + 18);
    }

  	const ydee = d3.extent(this.state.data, function(d) { return d.close; });

    const xdee = d3.extent(this.state.data, function(d) { return d.date; });
    console.log(xdee[1])
    xdee[1] = xdee[1] + 5;
    console.log(xdee[1])
    y.domain(ydee);
    x.domain(d3.extent(this.state.data, function(d) { return d.date; }));

  	const xValues = this.state.data.filter((d, i) => i % 32 === 0).map(d => d.date);

  	const xAxis = d3.axisBottom(x).ticks(5);

    const yAxis = d3.axisLeft(y).ticks(5);
  	
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
      .attr('clip-path', 'url(#clip)')

    const view = main.append("rect")
    	.attr("class", "view")
   		.attr("x", 0.5)
    	.attr("y", 0.5)
    	.attr("width", width)
    	.attr("height", height)

    const gridX = main.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat(""));	

  
  	const gridY = main.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat(""));
  		
  	const gX = g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(xAxis);


	  const gY = g.append("g")
      .attr("class", "axis")
      .call(yAxis);

	  const dataline = main.append("path")
        .datum(this.state.data)
	      .attr("fill", "none")
	      .attr("stroke", "#00E676")
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("stroke-width", 3)
	      .attr("d", line);

    const focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("r", 4.5);

    focus.append("text")
      .attr("class", "ytooltip")
      .attr("dy", ".35em")

    focus.append("text")
      .attr("class", "xtooltip")
      .attr("dx", "-3.5em")

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    g.on("mousemove",  mousemove)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .call(zoom)

}


	render() {
		return (
			<svg ref={node => this.node = node}
      		width={960} height={500}>
      	</svg>
		)
	}
}
