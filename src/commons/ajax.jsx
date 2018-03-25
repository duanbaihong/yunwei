import axios from 'axios';

export const ajax = (url='/api',params,method='POST') =>{
  // body...
  let data={
    'method'  :method,
    'url'     :url,
    'data'    :params,
    'headers' :{
            'Accept'      : 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
            },
    }
  return axios(data)

  // .then(function(req,rsp,next) {
  //   if(req.status!==200 || req.statusText!=="OK"){

  //   }
  // });
}