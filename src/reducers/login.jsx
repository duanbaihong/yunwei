// import immutable from 'immutable';

const initialState = 
  {
    userAuthenticated: false,
    userInfo: {}
  };

export const LoginReducer = (state = initialState , action={}) => {
  const { type, payload } = action;
  switch (type) {
    case 'ACTION_USER_LOGIN':
      if(payload.hasOwnProperty('resultCode') && payload.resultCode==="10000"){
        window.isLogin=true;
        return  Object.assign({}, state, {
          userAuthenticated:true,
          userInfo: {...payload},
        });
      }else{
        return  Object.assign({}, state, {
          userAuthenticated:true,
          userInfo: {},
        });
      }
    case 'ACTION_CHECK_USER_LOGIN':
      window.isLogin=true;
      return  Object.assign({}, state,{
        userAuthenticated:true,
        userInfo: {...payload},
      });
    case 'ACTION_USER_LOGOUT':
      window.isLogin=false;
      return Object.assign({
        userAuthenticated:false,
        userInfo: {}
      });
    default: 
      console.log(payload)
      return state;
  }
}