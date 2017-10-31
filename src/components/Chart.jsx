import React from 'react';
import yahooFinance from 'yahoo-finance';
import Feed from 'rss-to-json';
import * as d3 from "d3";

export default class Chart extends React.Component {
	constructor() {
		super();
		this.state = {
			data: [],
      timeperiod: '1mo',
      headlines: []
		}
		this.getChart = this.getChart.bind(this);
		this.createChart = this.createChart.bind(this);
    this.getHeadlines = this.getHeadlines.bind(this);
	}

  componentDidMount() {
    this.getHeadlines(this.props.current)
    this.getChart(this.props.current, '90m', '1mo')
  }
    
  componentDidUpdate() {
   this.createChart()
  }

	getChart(symbol, interval = '1d', range = '1y') {
		const query = `https://warm-peak-38829.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?formatted=true&lang=en-US&region=US&interval=${interval}&events=div%7Csplit&range=${range}&corsDomain=finance.yahoo.com`;
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
          timeperiod: range
				})
			})
	}

  getHeadlines(symbol) {
    const self = this
    Feed.load(`https://warm-peak-38829.herokuapp.com/https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`, 
      function(err, rss){
        if(err) {return}
        self.setState({
          headlines: rss.items
        })
    });
  }

  createChart() {
    d3.selectAll("svg > *").remove();
    const self = this;
    const lineColor = (this.props.watch.filter((el) => el.symbol === self.props.current)[0].change > 0) ? '#00E676' : '#ff333a'
    const svg = d3.select("svg"),
   	margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 890,
    height = 460,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const parseTime = d3.timeFormat("%B %d, %Y"),
    parseTimeOther = d3.timeFormat("%I:%M"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };
   		
    const x = d3.scaleTime()
    	.rangeRound([0, width - 2]);

    const y = d3.scaleLinear()
    	.rangeRound([height - 10, 10]);

    let testx = x
    let testy = y

    const zoom = d3.zoom()
  		.scaleExtent([1, 40])
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
      const t = d3.zoomIdentity.translate(tx, ty).scale(e.transform.k);
      testx = t.rescaleX(x)
      testy = t.rescaleY(y)
  		dataline.attr("d", d3.line()
        .x(function(d) { return testx(d.date); })
        .y(function(d) { return testy(d.close); }));
      focus.attr("transform", 'translate(' + [tx,ty] + ')scale(' + e.transform.k + ')');  		
    	gX.call(xAxis.scale(t.rescaleX(x)));
    	gY.call(yAxis.scale(t.rescaleY(y)));
     
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
      if (self.state.timeperiod === '1d') {
        focus.select(".xtooltip2").text(parseTimeOther(d.date));
      }
      focus.select(".x-hover-line").attr("y2", height - testy(d.close));
      focus.select(".y-hover-line").attr("x2", -width - testx(d.date) + 890.5);
      focus.select(".ytooltip").attr("x", -width - testx(d.date) + 843.5);
      focus.select(".xtooltip").attr("y",height - testy(d.close) + 18);
      focus.select(".xtooltip2").attr("y",height - testy(d.close) + 30);
    }

  	const ydee = d3.extent(this.state.data, function(d) { return d.close; });
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
      .attr("stroke", lineColor)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
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

    focus.append("text")
      .attr("class", "xtooltip2")
      .attr("dx", "-1em")

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
      <div>
         <div className="timeperiod-control">
          <div className={(this.state.timeperiod === "1d") ? "timeperiod 1d active" : "timeperiod 1d"} 
            onClick={() => this.getChart(this.props.current, '2m', '1d')}>1D</div>
          <div className={(this.state.timeperiod === "5d") ? "timeperiod 5d active" : "timeperiod 5d"} 
            onClick={() => this.getChart(this.props.current, '15m', '5d')}>5D</div>
          <div className={(this.state.timeperiod === "1mo") ? "timeperiod 1mo active" : "timeperiod 1mo"} 
            onClick={() => this.getChart(this.props.current, '90m', '1mo')}>1M</div>
          <div className={(this.state.timeperiod === "6mo") ? "timeperiod 6mo active" : "timeperiod 6mo"} 
            onClick={() => this.getChart(this.props.current, '1d', '6mo')}>6M</div>
          <div className={(this.state.timeperiod === "ytd") ? "timeperiod ytd active" : "timeperiod ytd"} 
            onClick={() => this.getChart(this.props.current, '1d', 'ytd')}>YTD</div>
          <div className={(this.state.timeperiod === "1y") ? "timeperiod 1y active" : "timeperiod 1y"} 
            onClick={() => this.getChart(this.props.current, '5d', '1y')}>1Y</div>
          <div className={(this.state.timeperiod === "5y") ? "timeperiod 5y active" : "timeperiod 5y"} 
            onClick={() => this.getChart(this.props.current, '1mo', '5y')}>5Y</div>
          <div className={(this.state.timeperiod === "max") ? "timeperiod max active" : "timeperiod max"} 
            onClick={() => this.getChart(this.props.current, '1mo', 'max')}>Max</div>
        </div>
  			<svg ref={node => this.node = node}
        	width={1000} height={500}>
        </svg>
        <hr style={{margin: '30px 0'}} />
        <hr style={{marginBottom: '10px'}}/>
        <div className="headlines">
          {this.state.headlines.map((headline, key) => {
            return  (
              <div className="headline" key={key}>
                <a className="title" href={headline.url.slice(0, -10)}>{headline.title}</a>
                <div className="description">{headline.description}</div>
              </div>
            )
          })}
        </div>
      </div>
		);
	}
}
