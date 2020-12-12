import  React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import ScrollText from 'react-scroll-text';


const Plot = createPlotlyComponent(Plotly);

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockChartXvalues: [],
            stockChartYvalues: [],
            stockSymbol: [],
            stockChartYvaluesSeparated: []
        }
    }

    componentDidMount() {
        this.fetchStock();
    }

    //fetch stock
    fetchStock() {
        const pointerToThis = this;
        console.log('pointertotthis', pointerToThis);
        const API_KEY = '7GTC3ZGLTXQXU1BN';
        let STOCK_SYMBOL = 'FB';
        //MSFT , GOOGL, IBM, TSCO.LON, AMZN, FB
        let API_CALL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${STOCK_SYMBOL}&outputsize=compact&apikey=${API_KEY}`;
        let stockChartXvaluesFn = [];
        let stockChartYvaluesFn = [];

        fetch(API_CALL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);

                for (var key in data['Time Series (Daily)']) {
                    stockChartXvaluesFn.push(key);
                    stockChartYvaluesFn.push(data['Time Series (Daily)'][key]['1. open']);

                    // console.log('x values',stockChartXvaluesFn', y values',stockChartYvaluesFn)
                }

                pointerToThis.setState({
                    stockChartXvalues: stockChartXvaluesFn,
                    stockChartYvalues: stockChartYvaluesFn,
                    stockSymbol: STOCK_SYMBOL,
                    stockChartYvaluesSeparated: stockChartYvaluesFn.join(' || ')
                });
            })
    }

    render() {
        return(
            <div>
                <h1>Stock Market</h1>
                Company: {this.state.stockSymbol}
                <p>Period: { this.state.stockChartXvalues.length } days</p>
                <p>From: { this.state.stockChartXvalues[0] } - To: { this.state.stockChartXvalues.slice(-1)[0] } </p>
                <ScrollText style={{backgroundColor: "black"}}>
                     <h3 style={{color: "red"}}> { this.state.stockChartYvaluesSeparated } </h3>
                </ScrollText>
                <Plot
                    data={[
                        {
                            x: this.state.stockChartXvalues,
                            y: this.state.stockChartYvalues,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: {color: 'red'},
                        },
                        // {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
                    ]}
                    layout={{width: 1000, height: 440, title: 'Stock Market Plot'}}
                />
            </div>
        )
    }
}

export default Stock;
