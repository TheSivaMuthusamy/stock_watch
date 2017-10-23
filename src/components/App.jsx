import React from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './SearchBar.jsx';
import WatchList from './WatchList.jsx';
import Chart from './Chart.jsx'
import yahooFinance from 'yahoo-finance';

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			watch: []
		}
		this.addToWatch = this.addToWatch.bind(this);
		this.removeFromWatch = this.removeFromWatch.bind(this);
	}

	addToWatch(item) {
		const watched = (this.state.watch).some((el) => {return el.symbol == item.symbol})
		const self = this
		if (watched) {
			const copy = this.state.watch.slice()
			const deleteWatch = (this.state.watch).filter((el) => {return el.symbol !== item.symbol})
			this.setState({
				watch: deleteWatch
			})
		} else {
			yahooFinance.quote({
	  			symbol: item.symbol,
	  			modules: ['price']       
			}, function(err, quote) {
				console.log(quote)
	  			const copyWatch = self.state.watch.slice()
	  			const newItem = {
	  				symbol: quote.price.symbol,
	  				name: quote.price.shortName,
	  				price: quote.price.regularMarketPrice,
	  				marketCap: quote.price.marketCap,
	  				change: quote.price.regularMarketChange,
	  				changePercent: quote.price.regularMarketChangePercent,
	  				exchange: quote.price.exchangeName,
	  				equity: quote.price.quoteType
	  			}
	  			copyWatch.push(newItem)
	  			self.setState({
	  				watch: copyWatch
	  			})
	  			console.log(copyWatch)
			});
		}
	}

	removeFromWatch(item) {
		const copy = this.state.watch.slice()
		const deleteWatch = (this.state.watch).filter((el) => {return el.symbol !== item.symbol})
		this.setState({
			watch: deleteWatch
		})
	}

	sortList(type) {

	}
	
	render() {
		return (
			<div>
				{/*<div className="search-bar" tabIndex="0">
					<SearchBar addToWatch={this.addToWatch} watch={this.state.watch}/>
				</div>
				<WatchList watch={this.state.watch} removeFromWatch={this.removeFromWatch}/>*/}
				<Chart  />
			</div>
		)
	};
}