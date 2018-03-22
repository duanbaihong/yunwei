import axios from axios;

module.exports=function (url='/api',params,method='GET') {
  // body...
  let data={
    'method'  :method,
    'url'     :url,
    'data'    :data,
    'headers' :{
            'Accept'      : 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
            },
    }
  axios(data).then(function(response){
    
  }).catch(function(error){

  })
}