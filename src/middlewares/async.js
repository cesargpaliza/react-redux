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