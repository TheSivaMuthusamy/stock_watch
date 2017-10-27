import React from 'react';
import SearchBar from './SearchBar.jsx';
import WatchList from './WatchList.jsx';

export default class Portfolio extends React.Component {
  componentDidMount() {
    this.setInterval = setInterval(() => this.props.continueWatching(this.props.watch), 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
      </div>
    );
	}
}