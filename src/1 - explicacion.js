import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import './index.css';
import App from './App';




/* 
** renombrar a index.js para ejecutar

Un store recibe dos parametros:
1 - stado: estado completo de la aplicacion
2 - accion: objeto que tiene el ripo de accion
    ej: {type: TIPODEACCION, payload: ANY}
*/


//reducer
const store = createStore((state = 0, action) => {
  switch (action.type) {
    case 'incrementar': {
      return state+ 1
    }
    case 'decrementar': {
      return state- 1
    }
    case 'set': {
      return action.payload
    }
    default:
      return state
  }
})

// cada vez q llamemos a dispach de nuestro store se 
// ejecutara el reducer q le hayamos pasado
store.dispatch({type: 'accion'})
store.dispatch({type: 'incrementar'})
// recuperar el state
console.log(store.getState())
store.dispatch({type: 'decrementar'})
console.log(store.getState())
store.dispatch({type: 'incrementar'})
console.log(store.getState())

store.dispatch({type: 'set', payload: 5})
console.log(store.getState())


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


