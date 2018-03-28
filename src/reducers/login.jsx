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
        sessionStorage.token=payload.userInfo.token;
        sessionStorage.userInfo=new Buffer(JSON.stringify(payload.userInfo)).toString('base64');
        return  Object.assign({}, state, {
          userAuthenticated:true,
          ...payload 
        });
      }else{
        return  Object.assign({}, state, {
          userAuthenticated:false,
          userInfo: {}
        });
      }
    case 'ACTION_CHECK_USER_LOGIN':
      let userInfo={};
      if(sessionStorage.userInfo){
        userInfo={userInfo: JSON.parse(new Buffer(sessionStorage.userInfo,'base64').toString())};
      }else{
        sessionStorage.token=payload.userInfo.token;
        sessionStorage.userInfo=new Buffer(JSON.stringify(payload.userInfo)).toString('base64');
      }
      window.isLogin=true;
      return  Object.assign({}, state,{
        userAuthenticated:true,
        ...payload,
        ...userInfo 
      });
    case 'ACTION_USER_LOGOUT':
      window.isLogin=false;
      delete sessionStorage.token
      delete sessionStorage.userInfo
      return Object.assign({
        userAuthenticated:false,
        userInfo: {}
      });
    default: 
      return state;
  }
}