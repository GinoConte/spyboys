import React from 'react';
import ReactDOM from 'react-dom';
import Spyboys from './Spyboys';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Spyboys
    url='http://localhost:3001/api/cards'
    pollInterval={2000} />,
  document.getElementById('root')
);
registerServiceWorker();
