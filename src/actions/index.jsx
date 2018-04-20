import * as type from '../actiontypes';
import { createAction } from 'redux-actions';

export const userLoginIn = createAction(type.ACTION_USER_LOGIN, (resp)=>{
  return resp;
});
export const userLoginOut = createAction(type.ACTION_USER_LOGOUT, ()=>{
  return null;
});
export const userCheckLogin = createAction(type.ACTION_CHECK_USER_LOGIN, (resp)=>{
  return resp;
});
export const changeAvaterImg = createAction(type.ACTION_USER_AVATER_CHANGE, (resp)=>{
  return resp;
});