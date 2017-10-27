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
    this.continueWatching = this.continueWatching.bind(this)
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

	addToWatch(e, item) {
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
	  			modules: ['price', 'defaultKeyStatistics', 'financialData', 'summaryDetail']       
			}, function(err, quote) {
	  			const copyWatch = self.state.watch.slice()
          const pegRatio = (quote.defaultKeyStatistics === undefined) ? null : quote.defaultKeyStatistics.pegRatio
	  			const newItem = {
	  				symbol: quote.price.symbol,
	  				name: quote.price.shortName,
	  				price: quote.price.regularMarketPrice,
	  				marketCap: quote.price.marketCap,
	  				change: quote.price.regularMarketChange,
	  				changePercent: quote.price.regularMarketChangePercent,
	  				exchange: quote.price.exchangeName,
	  				equity: quote.price.quoteType,
            PE: quote.summaryDetail.trailingPE,
            PEG: (quote.defaultKeyStatistics === undefined) ? undefined : quote.defaultKeyStatistics.pegRatio,
            debtToEquity: (quote.financialData === undefined) ? null : quote.financialData.debtToEquity,
            freeCashFlow: (quote.financialData === undefined) ? null : quote.financialData.freeCashflow
	  			}
	  			copyWatch.push(newItem)
	  			self.setState({
	  				watch: copyWatch
	  			})
			});
		}
    e.stopPropagation()
	}

  continueWatching(watch) {
    const symbols = watch.map(function(el) {return el.symbol})
    const emptyWatch = []
    const self = this
    if (this.state.watch.length === 0) {
      console.log('derp')
      return
    } else {
       yahooFinance.quote({
          symbols: symbols,
          modules: ['price', 'defaultKeyStatistics', 'financialData', 'summaryDetail']       
      }, function(err, quote) {

        for(let i = 0; i < symbols.length; i++) {
          let place = symbols[i]
          const newItem = {
            symbol: quote[place].price.symbol,
            name: quote[place].price.shortName,
            price: quote[place].price.regularMarketPrice,
            marketCap: quote[place].price.marketCap,
            change: quote[place].price.regularMarketChange,
            changePercent: quote[place].price.regularMarketChangePercent,
            exchange: quote[place].price.exchangeName,
            equity: quote[place].price.quoteType,
            PE: quote[place].summaryDetail.trailingPE,
            PEG: (quote[place].defaultKeyStatistics === undefined) ? undefined : quote[place].defaultKeyStatistics.pegRatio,
            debtToEquity: (quote[place].financialData === undefined) ? null : quote[place].financialData.debtToEquity,
            freeCashFlow: (quote[place].financialData === undefined) ? null : quote[place].financialData.freeCashflow
          }
          emptyWatch.push(newItem)
        }
        self.setState({
          watch: emptyWatch
        })
      })
    }
  }

	removeFromWatch(e, item) {
		const copy = this.state.watch.slice()
		const deleteWatch = (this.state.watch).filter((el) => {return el.symbol !== item.symbol})
		this.setState({
			watch: deleteWatch
		})
     e.stopPropagation()
	}

	onEnterChart(symbol) {
    this.setState({
      current: symbol
    })
  }

  sortPortfolio(method) {
    if (this.state.sortMethod === method) {
     const sortedWatch =  this.state.watch.sort(function(a,b) {
          if(!a[method])
            return 1;
          else if(!b[method])
            return -1;
          else if (a[method] < b[method])
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
          if(!a[method])
            return 1;
          else if(!b[method])
            return -1;
          else if (a[method] < b[method])
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
                                                      sort={this.sortPortfolio}
                                                      sortMethod={this.state.sortMethod}
                                                      continueWatching={this.continueWatching} />)} />
    				<Route path='/:symbol' render={(props) =>(<Chart watch={this.state.watch}
                                                      current={this.state.current} />)} />
          </Switch>
  			</HashRouter>
			</div>
		)
	};
}