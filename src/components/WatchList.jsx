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

		  ? round((Number(labelValue)) / 1.0e+9, 2) + "B"
		  // Six Zeroes for Millions 
		  : Math.abs(Number(labelValue)) >= 1.0e+6

		  ? round((Number(labelValue)) / 1.0e+6, 2) + "M"
		  // Three Zeroes for Thousands
		  : Math.abs(Number(labelValue)) >= 1.0e+3

		  ? round((Number(labelValue)) / 1.0e+3, 2) + "K"

		  : Math.abs(Number(labelValue));
		}		

		return (
			<div className="list-wrapper">
				<div className="headers">
          <div className="symbol-container">
  					<div className="header symbol" onClick={() => this.props.sort('symbol')}>Symbol 
              <div className="arrow">{this.props.sortMethod === 'symbol' ? '▲' : '▼'}</div>
            </div>
          </div>
					<div className="header name" onClick={() => this.props.sort('name')}>Name
            <div className="arrow">{this.props.sortMethod === 'name' ? '▲' : '▼'}</div>
          </div>
					<div className="header price" onClick={() => this.props.sort('price')}>Price
            <div className="arrow">{this.props.sortMethod === 'price' ? '▲' : '▼'}</div>
          </div>
					<div className="header change" onClick={() => this.props.sort('change')}>Change
            <div className="arrow">{this.props.sortMethod === 'change' ? '▲' : '▼'}</div>
          </div>
					<div className="header change-percent" onClick={() => this.props.sort('changePercent')}>Change(%)
            <div className="arrow">{this.props.sortMethod === 'changePercent' ? '▲' : '▼'}</div>
          </div>
					<div className="header market-cap" onClick={() => this.props.sort('marketCap')}>Market Cap
            <div className="arrow">{this.props.sortMethod === 'marketCap' ? '▲' : '▼'}</div>
          </div>
          <div className="header PE" onClick={() => this.props.sort('PE')}>PE Ratio
            <div className="arrow">{this.props.sortMethod === 'PE' ? '▲' : '▼'}</div>
          </div>
          <div className="header PEG" onClick={() => this.props.sort('PEG')}>PEG Ratio
            <div className="arrow">{this.props.sortMethod === 'PEG' ? '▲' : '▼'}</div>
          </div>
          <div className="header debtToEquity" onClick={() => this.props.sort('debtToEquity')}>Debt to Equity
            <div className="arrow">{this.props.sortMethod === 'debtToEquity' ? '▲' : '▼'}</div>
          </div>
          <div className="header freeCashFlow" onClick={() => this.props.sort('freeCashFlow')}>Free Cash Flow
            <div className="arrow">{this.props.sortMethod === 'freeCashFlow' ? '▲' : '▼'}</div>
          </div>
          <div className="header equity" onClick={() => this.props.sort('equity')}>Type
            <div className="arrow">{this.props.sortMethod === 'equity' ? '▲' : '▼'}</div>
          </div>
				</div>
				<div className="list">
					{this.props.watch.map((asset, key) =>  {
						const cn = (asset.change > 0) ? ' positive' : ' negative'
						return (
							<div className="asset" key={key}> 
                <div className="symbol-container">
  								<FaEye className="unwatch" onClick={(e) => this.props.removeFromWatch(e, asset)}/>
                  <a href={'#/' + asset.symbol} className={"item symbol" + cn} 
                      onClick={() => this.props.onEnterChart(asset.symbol)}>
                    {asset.symbol}
                  </a>
                </div>
								<a href={'#/' + asset.symbol} className={"item name" + cn}
                    onClick={() => this.props.onEnterChart(asset.symbol)}>
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
                <div className={"item PE" + cn}>
                  {(asset.PE) ? asset.PE : '-'}
                </div>
                <div className={"item PEG" + cn}>
                  {(asset.PEG) ? asset.PEG : '-'}
                </div>
                <div className={"item debtToEquity" + cn}>
                  {(asset.debtToEquity) ? round(asset.debtToEquity, 2) : '-'}
                </div>
                <div className={"item freeCashFlow" + cn}>
                  {(asset.freeCashFlow) ? valueFormat(asset.freeCashFlow) : '-'}
                </div>
                <div className={"item equity" + cn}>
                  {(asset.equity) ? asset.equity : '-'}
                </div>
							</div>
						);
					})}
				</div>
			</div>
		)
	}
}