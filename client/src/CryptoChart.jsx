import React from 'react';
import ReactDOM from 'react-dom';

import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'BPI',
      fontSize: 25,
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    },
  ],
};

class CryptoChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prices: {},
      title: 'Daily Prices',
      isVisibleMonths: true,
      isVisibleMonth: false,
    };
    this.grabMonths = this.grabMonths.bind(this);
    this.grabMonth = this.grabMonth.bind(this);
  }

  componentDidMount() {
    this.grabMonth();
  }

  grabMonth() {
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json').then(
      (res) => {
        res.json().then((data) => {
          console.log(data.bpi);
          this.setState({
            prices: data.bpi,
            title: 'Daily Prices',
            isVisibleMonths: true,
            isVisibleMonth: false,
          });
        });
      }
    );
  }

  grabMonths() {
    console.log('clicked!');

    let start = new Date();
    start.setDate(start.getDate() - 180);
    start = start.toISOString();
    start = start.substring(0, 10);

    let end = new Date();
    end = end.toISOString();
    end = end.substring(0, 10);

    fetch(
      `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`
    ).then((res) => {
      res.json().then((data) => {
        this.setState({
          prices: data.bpi,
          title: 'Prices - Last 6 Months',
          isVisibleMonths: false,
          isVisibleMonth: true,
        });
      });
    });
  }

  render() {
    let { prices, isVisibleMonths, isVisibleMonth } = this.state;

    let keys = Object.keys(prices);
    let values = Object.values(prices);
    data.labels = keys;
    data.datasets[0].data = values;

    return (
      <div>
        <div className='button'>
          {isVisibleMonths && (
            <button onClick={this.grabMonths}>Check last 6 months</button>
          )}
          {isVisibleMonth && (
            <button onClick={this.grabMonth}>Check last 30 days</button>
          )}
        </div>
        <div className='description'>
          <p>
            Historical chart for Bitcoin Price Index (BPI). Find all prices for
            each day of this last month, or within the last 6 months
          </p>
        </div>
        <Line
          data={data}
          width={100}
          height={350}
          options={{
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Bitcoin ' + this.state.title,
              fontSize: 50,
              fontFamily: 'Chivo',
            },
            legend: {
              // display: 'bitcoins baby',
              position: 'bottom',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'day',
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                      return '$' + value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItems, data) {
                  return 'price: $' + tooltipItems.yLabel.toString();
                },
              },
            },
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 25,
                bottom: 0,
              },
            },
          }}
        />
        <p className='plugin'>Powered by CoinDesk</p>
      </div>
    );
  }
}

ReactDOM.render(<CryptoChart />, document.getElementById('app'));
