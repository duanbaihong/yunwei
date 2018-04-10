import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Snack from '../components/snackbar';
import green from 'material-ui/colors/green';
import md5 from 'md5';
import QueryText from './othercomponents/querytext';

import { ajax } from '../../commons/ajax'
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 0,
    overflowX: 'auto',
  },
  rootdiv: {
    width: '100%',
  },
  wordshow:{
    [theme.breakpoints.down('sm')]:{
      display:"none"
    }
  },
  table: {
    // minWidth: 700,
    "&>thead>tr":{
      height:45,
      "&>th":{
        fontSize: 18
      }
    },
    "&>tbody>tr":{
      height:35,
      "&>td":{
        color: "rgba(0, 0, 0, 0.66)",
        fontSize: "0.94125rem"
      }
    }
  },
  paper:{
    paddingLeft:30,
    [theme.breakpoints.down('sm')]:{
      paddingLeft:10,
      marginTop:0,
    },
    [theme.breakpoints.down('xs')]:{
      paddingLeft:5,
    },
    overflow:"auto",
  },
  textField:{
    minWidth:220,
    marginLeft:30,
    [theme.breakpoints.down('xs')]:{
      marginTop:4,
      marginLeft:15,
    },
  },
  search: {
    margin: 22,
    [theme.breakpoints.down('xs')]:{
      margin:8,
    },
    float: "right",
    position: "relative"
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});

class PackageInfo extends Component {
  constructor(props) {
      super(props);
      this.state={
        msg:"",
        open:false,
        open1:false,
        age:"",
        age1:0,
        in: false,
        loading:false,
        dhdata:{},
        platdata:{},
      }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false ,open1:false,msg:""});
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleOpen1 = () => {
    this.setState({ open1: true });
  };
  setStateMsg(msg){
    this.setState(msg);
  }
  handleQuery(data){
    let macimei=data.macimei
    let phone=data.phone
    console.log(data)
    let params={
      MsgType: "ACTION_QUERY_PACKAGE_INFO",
      Token: sessionStorage.token,
    }
    if(phone!=="" && phone!== undefined){
      params['phone']= phone
      params['Sign']= md5("ACTION_QUERY_PACKAGE_INFO"+sessionStorage.token+phone);
    }else{
      params['macimei']= macimei
      params['Sign']= md5("ACTION_QUERY_PACKAGE_INFO"+sessionStorage.token+ macimei);
    }
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case "10000":
          // console.log(req.data)
          if(req.data.hasOwnProperty('resultData') && req.data.resultData!==''){
            let dhdata={}
            let dh1data={}
            let platdata={}

            req.data.resultData.dh1data.forEach(n=>{
              dh1data[n.mac.toLowerCase()]=n;
            })
            req.data.resultData.dhdata.forEach(n=>{
              let tmpmac=n.deviceid.replace('xxxxS_','').toLowerCase();
              dhdata[tmpmac]=n
              dhdata[tmpmac]['imei']=dh1data.hasOwnProperty(tmpmac)?dh1data[tmpmac].imei:""
              dhdata[tmpmac]['devtype']=dh1data.hasOwnProperty(tmpmac)?dh1data[tmpmac].devtype:""
            })
            req.data.resultData.platdata.forEach(n=>{
              platdata[n.cam_sn.toLowerCase()]=n
            })
            console.log(platdata)
            let curstate={
                  dhdata:dhdata,
                  platdata:platdata,
                  loading:false,
                  age1:Object.keys(dhdata)[0]};
            if(Object.keys(dhdata).length===0){
              curstate['msg']="没有找登虹数据！"
            }
            this.setState(curstate)
          }
          break;
        case "22222":
          this.setState({msg:req.data.resultMsg,loading:false});
          setTimeout(()=>{this.props.userLoginOut()}, 1000);
          break;
        default:
          this.setState({msg:req.data.resultMsg,loading:false});
      }
    }).catch(error=>{
      this.setState({msg:"数据提交错误！或网络异常！",loading:false});
      console.log(error)
    })
  }
  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    const dhtable=(JSON.stringify(this.state.dhdata)!=='{}'?(<Grid item xs={12} sm={6}>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>登虹套餐情况</TableCell>
                      <TableCell numeric>
                          <FormControl fullWidth={true}>
                            <Select
                              open={this.state.open1}
                              onClose={this.handleClose}
                              onOpen={this.handleOpen1}
                              value={this.state.age1}
                              onChange={this.handleChange}
                              inputProps={{
                                name: 'age1',
                                id: 'controlled-open-select1',
                              }}
                            >{
                              Object.keys(this.state.dhdata).map(n=>{
                                return (<MenuItem key={n} value={n}>{n}</MenuItem>)
                              })}
                            </Select>
                          </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                        <TableRow hover>
                          <TableCell>设备MAC</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].deviceid:"无"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>设备IMEI号</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].imei:"暂无"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>设备名称</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].devicename:"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>设备状态</TableCell>
                          <TableCell numeric>
                            {this.state.dhdata.hasOwnProperty(this.state.age1)?(this.state.dhdata[this.state.age1].deviceStatus==="0"?'离线':(this.state.dhdata[this.state.age1].deviceStatus==="1"?'在线':'')):""}
                          </TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>设备型号</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].devtype:"暂无"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>云存储机房</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].region:"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>APP版本号</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].cameraAppVersion:"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>固件版本号</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].firmwareVersion:"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>绑定手机号</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].mobile:"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>设备绑定时间</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?(new Date(parseInt(this.state.dhdata[this.state.age1].registertime,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>套餐编码/名称</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?this.state.dhdata[this.state.age1].servicename:"无"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>套餐生效时间</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?(this.state.dhdata[this.state.age1].starttime!==""?(new Date(parseInt(this.state.dhdata[this.state.age1].starttime,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"):"-"}</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell>套餐失效时间</TableCell>
                          <TableCell numeric>{this.state.dhdata.hasOwnProperty(this.state.age1)?(this.state.dhdata[this.state.age1].endtime!==""?(new Date(parseInt(this.state.dhdata[this.state.age1].endtime,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"):""}</TableCell>
                        </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>):"");
    const plattable=(JSON.stringify(this.state.platdata)!=='{}'?(<Grid item xs={12} sm={6}>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow >
                    <TableCell >运管套餐情况</TableCell>
                    <TableCell numeric>
                        <FormControl className={classes.formControl} fullWidth={true}>
                          <Select
                            open={this.state.open}
                            onClose={this.handleClose}
                            onOpen={this.handleOpen}
                            value={this.state.age1}
                            onChange={this.handleChange}
                            inputProps={{
                              name: 'age1',
                              id: 'controlled-open-select',
                            }}
                          >
                          {  Object.keys(this.state.platdata).map(n=>{
                                return (<MenuItem key={n} value={n}>{n}</MenuItem>)
                              })}
                          </Select>
                        </FormControl>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>设备MAC</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].cam_sn:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备IMEI号</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].cam_imei:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备名称</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].cam_name:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备状态</TableCell>
                    <TableCell numeric>
                      {this.state.platdata.hasOwnProperty(this.state.age1)?(this.state.platdata[this.state.age1].online==="0"?'离线':(this.state.platdata[this.state.age1].online==="1"?'在线':'')):"-"}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备型号</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].cam_model:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>云存储机房</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].region:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>APP版本号</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].app_version:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>固件版本号</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].cam_version:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>绑定手机号</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].phone_num:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备绑定时间</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?(this.state.platdata[this.state.age1].bind_time!==""?(new Date(parseInt(this.state.platdata[this.state.age1].bind_time,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"):"-"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐编码/名称</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].name:"无"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐生效时间</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?(this.state.platdata[this.state.age1].effective_time!==""?(new Date(parseInt(this.state.platdata[this.state.age1].effective_time,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"):"-"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐失效时间</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?(this.state.platdata[this.state.age1].failure_time!==""?(new Date(parseInt(this.state.platdata[this.state.age1].failure_time,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"):"-"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐订购时间</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?(this.state.platdata[this.state.age1].create_time!==""?(new Date(parseInt(this.state.platdata[this.state.age1].create_time,10)*1000).Format("yyyy-MM-dd hh:mm:ss")):"-"):"-"}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备渠道</TableCell>
                    <TableCell numeric>{this.state.platdata.hasOwnProperty(this.state.age1)?this.state.platdata[this.state.age1].area_name:""}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>):"")
    return (
      <div className={classes.rootdiv}>
        <QueryText 
            setmsg={this.setStateMsg.bind(this)} 
            handleQuery={this.handleQuery.bind(this)}
            loading={loading} />
        <Grid container spacing={24}>
          {plattable}
          {dhtable}
          <Snack title={this.state.msg} vertical={"bottom"} />
        </Grid>
      </div>
    );
  }
}

PackageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PackageInfo);
