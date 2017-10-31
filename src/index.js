import React from 'react';
import ReactDOM from 'react-dom';
import Spyboys from './Spyboys';
import Header from './Header';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';


ReactDOM.render(
  <Spyboys
      url='http://localhost:3001/api/cards'
  pollInterval={2000} />,
  document.getElementById('root')
);
// ReactDOM.render(
//   <Spyboys
//     url='http://localhost:3001/api/cards'
//     pollInterval={2000} />,
//   document.getElementById('root')
// );
// registerServiceWorker();
