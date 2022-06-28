import './App.css';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { combineReducers } from 'redux'

/* 
  funcion q recibe el store(state, dispatch), a su vez va a retornar una funcion
  la cual recibe next nos servira para llamar al siguiente middleware 
  (en caso de ser necesario) esta funcion recibe como argumento action
*/
export const asyncMiddleware = store => next => action => {
  //en el caso que sea una funcion la llama y le pasa el dispatch
  //cdo llamamos a fetchThunk entra por este if
  if(typeof action === 'function'){
    return action(store.dispatch, store.getState)
  }
  next(action)
}


//funciones que devolveran los actions para eviar acoplamiento
const setPending = () => {
  return { type: 'todos/pending'  }
}
const setFullFilled = payload => {
  return { type: 'todos/fullfilled', payload, }
}
const setError = e => {
  return { type: 'todos/error', error: e.message}
}
const setComplete = payload => {
  return { type: 'todo/complete', payload}
}
const setFilter = payload => {
  return { type: 'filter/set', payload }
}


export const fetchThunk = () => async dispatch => {
  dispatch(setPending())
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const data = await response.json()
    const todos = data.slice(0,10)
    dispatch(setFullFilled(todos))
  } catch (e) {
    dispatch(setError())
  }  
}

export const filterReducer = (state= 'all', action) => {
  switch (action.type) {
    case 'filter/set':
      return action.payload
    default:
      return state
  }
}

/** Se pone un string en loading por que permite manejar varios estados de carga
 * que a diferencia de true/false solo nos permite 2 */
const initialFecthing = { loading: 'idle', error: null}

export const fetchingReducer = (state = initialFecthing, action) => {
  switch (action.type){
    case 'todos/pending': {
      return { ...state, loading: 'pending'}
    }
    case 'todos/fullfilled': {
      return { ...state, loading: 'succeded'}
    }
    case 'todos/error' : {
      return { error: action.error, loading: 'rejected'}
    }
    default: {
      return state
    }
  }
}

export const todosReducer = (state = [], action) => {
  
  switch (action.type) {
    //carga todos los datos obtenidos de la api
    case 'todos/fullfilled' : {
      return action.payload
    }
    case 'todo/add': {
      return state.concat({...action.payload}) 
    }     
    case 'todo/complete': {
      const newTodos = state.map(todo => {
        if (todo.id === action.payload.id){
          return({ ...todo, completed: !todo.completed})
        }
        return todo
      })
      return newTodos
    }     
    default: {
      return state
    }
  }
}

export const reducer = combineReducers({
  //<propiedad del estado> : <el reducer q utilzara para modificarla>
  todos: combineReducers({
    entities: todosReducer, 
    status: fetchingReducer,
  }),
  filter: filterReducer,
})








//funcion creada para ser utilizada en useSelector
const selectTodos = state => {
  const { todos: { entities}, filter } = state
  
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

const selectStatus = state => state.todos.status


const TodoItem = ( {  todo } ) => {
  const dispach = useDispatch();
  return(
    <li
      style={{textDecoration: todo.completed ? 'line-through': 'none',
              color: todo.completed ? '#16A34A': 'white'}
            }
      onClick={() => dispach(setComplete(todo))}
    >{todo.title} - ID: {todo.id}</li>
  )
}

const App = () => {
  const [ valor, setValor ] = useState('')  
  const dispatch = useDispatch()

  const todos = useSelector(selectTodos)
  const status = useSelector(selectStatus)

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

  if(status.loading === 'pending'){
    return <h4>Cargando</h4>
  }
  if(status.loading === 'rejected'){
    return <h4>{status.error}</h4>    
  }

  return (
    <div className="App">
      <h4>Nueva tarea</h4>
      <form onSubmit={submit}>
        <input 
          value={valor} 
          onChange={e => setValor(e.target.value)}
          placeholder="Ingrese la tarea y presione enter ↩️"
        />
      </form>
      <h4>Filtros</h4>
      <button onClick={() => dispatch(setFilter('all'))}>Mostrar Todos</button>
      <button onClick={() => dispatch(setFilter('incomplete'))}>Incompletos</button>
      <button onClick={() => dispatch(setFilter('complete'))}>Completos</button>
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>

      <h4>Listado de tareas</h4>

      <ul>
        {todos.map(todo =>  <TodoItem key={todo.id} todo={todo}  />)}
      </ul>

    </div>
  );
}

export default App;

