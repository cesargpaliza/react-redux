
/*
    Le pasare un arreglo de reducers, ejecutare el 1ro pasandole el estado y la accion
    este tomara el estado que retorno el reducer y se lo pasara al siguiente con la accion
*/

export const reduceReducers = (...reducers) => ( state, action ) => 
    reducers.reduce( (acumulador, elemento) =>  elemento(acumulador/*estado que viene hasta ahora*/, action), state/*valor inicial*/) 




const initialFecthing = { loading: 'idle', error: null}
//higher order reducer
export const makeFetchingReducer = actions => (state = initialFecthing, action) => {
  switch (action.type){
    case actions[0]: {
      return { ...state, loading: 'pending'}
    }
    case actions[1]: {
      return { ...state, loading: 'succeded'}
    }
    case actions[2] : {
      return { error: action.error, loading: 'rejected'}
    }
    default: {
      return state
    }
  }
}

export const makeSetReducer = actions => (state= 'all', action) => {
    switch (action.type) {
      case actions[0]:
        return action.payload
      default:
        return state
    }
  }



//ex componente todoReducer
export const makeCrudReducer = actions => (state = [], action) => {
    switch (action.type) {

      case actions[0]: {
        return state.concat({...action.payload}) 
      }     
      case actions[1]: {
        const newEntities = state.map(entity => {
          if (entity.id === action.payload.id){
            return({ ...entity, completed: !entity.completed})
          }
          return entity
        })
        return newEntities
      }     
      default: {
        return state
      }
    }
  }