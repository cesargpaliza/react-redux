import './App.css';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const initialState = {
  entities: [],
  filter: 'all', //complete , incomplete
}

//Reducer
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    
    case 'todo/add': {
      return {
        ...state,
        entities: state.entities.concat({...action.payload})
      }
    }     

    case 'todo/complete': {
      const newTodos = state.entities.map(todo => {
        if (todo.id === action.payload.id){
          return({ ...todo, completed: !todo.completed})
        }
        return todo
      })
      return ({
        ...state,
        entities: newTodos
      })
    }     

    case 'filter/set': {
      return {
        ...state,
        filter: action.payload,
      }
      
    }

    default:
      return state;
  }
}

const TodoItem = ( {  todo } ) => {
  const dispach = useDispatch();

  return(
    <li
      style={{textDecoration: todo.completed ? 'line-through': 'none',
              color: todo.completed ? '#16A34A': 'white'}
            }
      onClick={() => dispach({ type: 'todo/complete', payload: todo}) }
    >{todo.title} - ID: {todo.id}</li>
  )
}

const selectTodos = state => {
  const { entities, filter } = state

  if(filter === 'complete'){
    //retorna solo los todos que estan completos
    return entities.filter(todo => todo.completed) 
  }
  if(filter === 'incomplete'){
    //retorna solo los todos no que estan completos
    return entities.filter(todo => !todo.completed) 
  }
  return entities
  
}



const App = () => {
  const [ valor, setValor ] = useState('')
  
  const dispatch = useDispatch()

  //useSelector: nos sirve para poder seleccionar parte de nuestro estado
  const todos = useSelector(selectTodos)


  const submit = e => {
    e.preventDefault()
    if(!valor.trim()){
      return
    }
    const id = Math.random().toString(36)
    const todo = { title: valor, completed: false, id }
    dispatch({ type: 'todo/add', payload: todo})
    setValor('')
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input 
          value={valor} 
          onChange={e => setValor(e.target.value)}
          placeholder="Ingrese la tarea y presione enter ↩️"
        />
      </form>

      
      <h4>Filtros:</h4>
      <button onClick={() => dispatch({type: 'filter/set', payload: 'all'})}>Mostrar Todos</button>
      <button onClick={() => dispatch({type: 'filter/set', payload: 'incomplete'})}>Incompletos</button>
      <button onClick={() => dispatch({type: 'filter/set', payload: 'complete'})}>Completos</button>

      <h3>Listado de tareas</h3>

      <ul>
        {todos.map(todo =>  <TodoItem key={todo.id} todo={todo}  />)}
      </ul>

    </div>
  );
}

export default App;

