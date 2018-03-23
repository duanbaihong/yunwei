import * as type from '../actiontypes';
import { createAction } from 'redux-actions';
export const userLoginIn = createAction(type.ACTION_USER_LOGIN, async (resp)=>{
  console.log(resp)
  return resp;
});
export const userLoginOut = createAction(type.ACTION_USER_LOGIN, async ()=>{
  return null;
});