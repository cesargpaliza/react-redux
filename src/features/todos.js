import { combineReducers } from 'redux'
import { makeFetchingReducer, makeSetReducer } from './utils'

//funciones que devolveran los actions para eviar acoplamiento
export const setPending = () => {
    return { type: 'todos/pending'  }
}
export const setFullFilled = payload => {
    return { type: 'todos/fullfilled', payload, }
}
export const setError = e => {
    return { type: 'todos/error', error: e.message}
}
export const setComplete = payload => {
    return { type: 'todo/complete', payload}
}
export const setFilter = payload => {
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

//reducers
//new
export const fetchingReducer = makeFetchingReducer([
    'todos/pending',
    'todos/fullfilled',
    'todos/rejected',
])

export const filterReducer = makeSetReducer(['filter/set'])

  
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
export const selectTodos = state => {
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
  
  export const selectStatus = state => state.todos.status