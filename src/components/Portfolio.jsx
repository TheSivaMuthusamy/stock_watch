import React from 'react';
import SearchBar from './SearchBar.jsx';
import WatchList from './WatchList.jsx';

export default class Portfolio extends React.Component {
	
	render() {
    return (
      <div className="portfolio-wrapper">
    		<div className="search-bar">
    			<SearchBar addToWatch={this.props.addToWatch} watch={this.props.watch} />
    		</div>
    		<WatchList watch={this.props.watch} removeFromWatch={this.props.removeFromWatch} 
          onEnterChart={this.props.onEnterChart} sort={this.props.sort}/>
      </div>
    );
	}
}