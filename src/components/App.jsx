import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import Portfolio from './Portfolio.jsx'
import Chart from './Chart.jsx'
import yahooFinance from 'yahoo-finance';

export default class App extends React.Component {
	constructor() {
		super();
		const initialState = {
			watch: [],
      current: null,
      sortMethod: null,
		}
    this.state = this.getFromStorage(initialState);
		this.addToWatch = this.addToWatch.bind(this);
		this.removeFromWatch = this.removeFromWatch.bind(this);
    this.onEnterChart = this.onEnterChart.bind(this);
    this.sortPortfolio = this.sortPortfolio.bind(this);
	}

  componentDidUpdate() {
    // Writes  current state to local storage after an update
      this.writeToStorage(this.state)
  }

  getFromStorage(state) {
    // Returns state from local storage or returns intial state
    try {
      const persistantState = localStorage.getItem('stateFinance');
      if(persistantState === null) {
        return state;
      }
      return JSON.parse(persistantState);
    } catch(err) {
      return state;
    }
  }

  writeToStorage(state) {
    // Writes a state to local storage
    try {
      const persistantState = JSON.stringify(state);
      localStorage.setItem('stateFinance', persistantState)
    } catch(err) {

    }
  }

	addToWatch(item) {
		const watched = (this.state.watch).some((el) => {return el.symbol === item.symbol})
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

	onEnterChart(symbol) {
    this.setState({
      current: symbol
    })
  }

  sortPortfolio(method) {
    if (this.state.sortMethod === method) {
     const sortedWatch =  this.state.watch.sort(function(a,b) {
          if (a[method] < b[method])
            return 1;
          else if (a[method] == b[method])
              return 0;
          else
            return -1;
        });
      this.setState({
        watch: sortedWatch,
        sortMethod: null
      })
    } else {
      const sortedWatch = this.state.watch.sort(function(a,b) {
          if (a[method] < b[method])
            return -1;
          else if (a[method] == b[method])
              return 0;
          else
            return 1;
        });
      this.setState({
        watch: sortedWatch,
        sortMethod: method
      })
    }
  }
	
	render() {
		return (
			<div>
  			<HashRouter>
          <Switch>
            <Route exact path='/' render={(props) =>(<Portfolio watch={this.state.watch} 
                                                      removeFromWatch={this.removeFromWatch} 
                                                      addToWatch={this.addToWatch} 
                                                      onEnterChart={this.onEnterChart} 
                                                      sort={this.sortPortfolio}/>)} />
    				<Route path='/:symbol' render={(props) =>(<Chart watch={this.state.watch}
                                                      current={this.state.current} />)} />
          </Switch>
  			</HashRouter>
			</div>
		)
	};
}