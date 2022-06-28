import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import './index.css';
import App, { reducer, asyncMiddleware } from './App';


//se agrega como segundo argumento la funcion de middleware
const store = createStore(reducer, applyMiddleware(asyncMiddleware))

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


