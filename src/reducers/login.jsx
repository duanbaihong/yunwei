import immutable from 'immutable';

const initialState = immutable.Map({
  userAuthenticated: false,
  userInfo: {}
});

export const LoginReducer = (state = initialState , action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      window.isLogin=true;
      console.log(state)
      return {
        ...state.toJS()
      }
    case 'AUTH_FAIL':
      window.isLogin=false;
      return {
        ...state.toJS()
      }
    default:
      return state.toJS()
  }
}


// export default LoginReducer;