import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    coins: '',
  }

  componentDidMount() {
    axios.get('http://localhost:3001').then((response) => {
      this.setState({coins: response.data});
    });
  }

  render() {
    return (
      <div className="App">
        { this.state.coins === ''
          ? ''
          : Object.keys(this.state.coins.prices).map((item) => {
            return (
              <p>
                {item} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {this.state.coins.prices[item].DISPLAY
                  ? this.state.coins.prices[item].DISPLAY[item].USD.PRICE
                  : 'None'}
              </p>
            );
          }) }
      </div>
    );
  }
}

export default App;
