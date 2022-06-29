import './App.css';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchThunk, setComplete, setFilter, selectTodos, selectStatus } from './features/todos'





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

