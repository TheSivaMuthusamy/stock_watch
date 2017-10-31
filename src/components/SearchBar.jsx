import React from 'react';
import Autocomplete from 'react-autocomplete';
import FaEye from 'react-icons/lib/fa/eye';

const AutoSuggestURL = 'https://s.yimg.com/aq/autoc?query=aapl&region=US&lang=en-US';

export default class SearchBar extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {
			inputValue: '',
			data: [],
		}
		this.onHandleInput = this.onHandleInput.bind(this);
		this.handleRenderItem = this.handleRenderItem.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	handleRenderItem(item, isHighlighted) {
		const listStyles = {
			item : {
				padding: '5px',
				cursor: 'default',
				color: '#eeeeee',
				background: '#121212'
			},

			highlightedItem: {
				padding: '5px',
				cursor: 'default',
				background: '#2f3136',
				color: '#00E676',
				overflow: 'hidden'
			}
		};
		const watched = (this.props.watch).some((el) => {return el.symbol == item.symbol})
		const cn = (watched) ? 'eye active' : 'eye'
		return (
			<div style={isHighlighted ? listStyles.highlightedItem : listStyles.item} key={(this.state.data).indexOf(item)}>
				<div className="suggestions">
					<p>{item.symbol}</p>
					<p>{item.name}</p>
				</div>
				<div className="suggestions end">
					<p>{item.typeDisp + ' - ' + item.exchDisp}</p>
					<FaEye className={cn} onClick={(e) => this.props.addToWatch(e, item)}/>
				</div>
			</div>
		)
	}

	onHandleInput(event) {
		const query = event.target.value
		const self = this
		const url  = 'https://s.yimg.com/aq/autoc?query=' + query + '&region=US&lang=en-US'

		this.setState({
			inputValue: event.target.value
		})

		fetch("https://warm-peak-38829.herokuapp.com/" + url)
			.then(response => response.json())
			.then(data => 
				{
					const filterData = data.ResultSet.Result.filter((el) => el.typeDisp !== "Option")				
					this.setState({data: filterData})
				}
			)
		
	}

	onSearch(value) {
		this.props.onEnterChart(value.symbol)
		window.location.href = ('#/' + value.symbol)
	}

	render() {
		const menuStyle = {			
			left: 'auto',
			top: 'auto',
			position: 'absolute',
			zIndex: '10'
		}
		return (
			<Autocomplete
			ref = "search"
			items = {this.state.data}
			getItemValue = {(item) => item}
			inputProps={{ placeholder: 'Search ...'}}
			value={this.state.inputValue}
			onChange={this.onHandleInput}
			onSelect={this.onSearch}
			renderItem={this.handleRenderItem}
			menuStyle= {menuStyle}
			autoHighlight= {false}
			/>
		)
	}
}
