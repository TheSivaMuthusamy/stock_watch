import React from 'react';
import FaEye from 'react-icons/lib/fa/eye';

export default class WatchList extends React.Component {

	render() {
		function round(value, decimals) {
  		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}

		function valueFormat(labelValue) {

		  // Nine Zeroes for Billions
		  return Math.abs(Number(labelValue)) >= 1.0e+9

		  ? round(Math.abs(Number(labelValue)) / 1.0e+9, 2) + "B"
		  // Six Zeroes for Millions 
		  : Math.abs(Number(labelValue)) >= 1.0e+6

		  ? round(Math.abs(Number(labelValue)) / 1.0e+6, 2) + "M"
		  // Three Zeroes for Thousands
		  : Math.abs(Number(labelValue)) >= 1.0e+3

		  ? round(Math.abs(Number(labelValue)) / 1.0e+3, 2) + "K"

		  : Math.abs(Number(labelValue));
		}		

		return (
			<div className="list-wrapper">
				<div className="headers">
					<div className="header symbol" onClick={() => this.props.sort('symbol')}>Symbol</div>
					<div className="header name" onClick={() => this.props.sort('name')}>Name</div>
					<div className="header price" onClick={() => this.props.sort('price')}>Price</div>
					<div className="header change" onClick={() => this.props.sort('change')}>Change</div>
					<div className="header change-percent" onClick={() => this.props.sort('changePercent')}>Change(%)</div>
					<div className="header market-cap" onClick={() => this.props.sort('marketCap')}>Market Cap</div>
				</div>
				<div className="list">
					{this.props.watch.map((asset, key) =>  {
						const cn = (asset.change > 0) ? ' positive' : ' negative'
						return (
							<div className="asset" key={key}> 
								<FaEye className="unwatch" onClick={() => this.props.removeFromWatch(asset)}/>
								<a href={'#/' + asset.symbol} className={"item symbol" + cn} 
                    onClick={() => this.props.onEnterChart(asset.symbol)}>
                  {asset.symbol}
                </a>
								<a href={'#/' + asset.symbol} className={"item name" + cn}>
                  {asset.name}
                </a>
								<div className={"item price" + cn}>
									{(asset.price) ? asset.price.toFixed(2) : '-'}
								</div>
								<div className={"item change" + cn}>
									{(asset.change) ? round(asset.change, 2) : '-'}
								</div>
								<div className={"item change-percent" + cn}>
									{(asset.changePercent) ? '(' + round(100 * asset.changePercent, 2) + '%)' : '-'}
								</div>
								<div className={"item market-cap" + cn}>
									{(asset.marketCap) ? valueFormat(asset.marketCap) : '-'}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		)
	}
}