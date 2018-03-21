
const initialState = {
  userAuthenticated: false
}

export const LoginReducer = (state = initialState , action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        userAuthenticated: true
      }
    case 'AUTH_FAIL':
      return {
        ...state,
        userAuthenticated: false
      }
    default:
      return state
  }
}


// export default LoginReducer;