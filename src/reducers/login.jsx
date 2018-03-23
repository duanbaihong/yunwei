import immutable from 'immutable';

const initialState = 
  {
    userAuthenticated: false,
    userInfo: {}
  };

export const LoginReducer = (state = initialState , action={}) => {
  const { type, payload } = action;
  switch (type) {
    case 'ACTION_USER_LOGIN':
      window.isLogin=true;
      // return  Object.assign({}, state, {user{
      //   userAuthenticated:true
      // });
    case 'ACTION_CHECK_USER_LOGIN':
      window.isLogin=true;
      return  Object.assign({}, state, {
        userAuthenticated:true
      });
      
    case 'ACTION_USER_LOGOUT':
      window.isLogin=false;
      return {
        ...state
      }
    default:
      return state
  }
}