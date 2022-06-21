import './App.css';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


//el reducer debe ir ubicado en otro archivo, por fines
//de simplificar el ejemplo se deja en el mismo archivo
export const reducer = (state = 0, action) => {
  //console.log(action, state)

  switch (action.type) {
    case 'incrementar':
      return state+1
    case 'decrementar':
      return state-1
    case 'set':
      return action.payload
    default:
      return state;
  }
}


function App() {
  const [ valor, setValor ] = useState('')

  //obtengo el dispach y desde aqui puedo ejecutar el dispach de redux
  const dispatch = useDispatch()
  //obtengo el valor del estado
  const state = useSelector(state => state)

  const handleSet = () => {
    dispatch({type:'set', payload: valor})
    setValor('')
  }

  return (
    <div className="App">
      <p>Contador: { state }</p>
      <button onClick={() => dispatch({type:'incrementar'}) }>Incrementar</button>
      <button onClick={() => dispatch({type:'decrementar'}) }>Decrementar</button>
      <button onClick={ handleSet }>Set</button>
      <input value={valor} onChange={e => setValor(Number(e.target.value))} />
    </div>
  );
}

export default App;

