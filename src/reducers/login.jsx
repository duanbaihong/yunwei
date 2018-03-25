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
      console.log(...state)
      window.isLogin=true;
      return  Object.assign({}, state, {
        userAuthenticated:true,
      });
    case 'ACTION_CHECK_USER_LOGIN':
      console.log(state)
      window.isLogin=true;
      return  Object.assign({}, state,{
        userAuthenticated:true,
      });
    case 'ACTION_USER_LOGOUT':
      window.isLogin=false;
      return Object.assign({
        userAuthenticated:false,
        userInfo: {}
      });
    default: 
      return state;
  }
}