import React from 'react';
import SearchBar from './SearchBar.jsx';
import WatchList from './WatchList.jsx';
import Feed from 'rss-to-json';

export default class Portfolio extends React.Component {
  constructor(){
    super();
    this.state = {
      headlines: []
    }
    this.getHeadlinesPortfolio = this.getHeadlinesPortfolio.bind(this)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.props.continueWatching(this.props.watch), 60000)
    const symbols = this.props.watch.map((el) => el.symbol).join()
    this.getHeadlinesPortfolio(symbols)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.watch !== nextProps.watch) {
      const symbols = nextProps.watch.map((el) => el.symbol).join()
      this.getHeadlinesPortfolio(symbols)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getHeadlinesPortfolio(symbols) {
    const self = this
    Feed.load(`https://warm-peak-38829.herokuapp.com/https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbols}&region=US&lang=en-US`, 
      function(err, rss){
        if(err) {return}
        self.setState({
          headlines: rss.items
        })
    });
  }
	
	render() {
    return (
        <div className="portfolio-wrapper">
      		<div className="search-bar">
      			<SearchBar addToWatch={this.props.addToWatch} watch={this.props.watch} 
              onEnterChart={this.props.onEnterChart} router={this.props.router}/>
      		</div>
      		<WatchList watch={this.props.watch} removeFromWatch={this.props.removeFromWatch} 
            onEnterChart={this.props.onEnterChart} sort={this.props.sort}
            sortMethod={this.props.sortMethod} continueWatching={this.props.continueWatching}/>
          {this.props.watch.length < 1 ? 
            <h3 className="empty-watch">Looks like you aren't following anything please click on the eye icon while seaching to follow</h3> 
            : 
            <div>
              <div className="headlines" style={{marginTop: '30px'}}>
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
          }
        </div>
    );
	}
}