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
        age1:"",
        in: false,
        loading:false,
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

          break;
        case "xxxxx":
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
    return (
      <div className={classes.rootdiv}>
        <QueryText 
            setmsg={this.setStateMsg.bind(this)} 
            handleQuery={this.handleQuery.bind(this)}
            loading={this.state.loading} />
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
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
                            value={this.state.age}
                            onChange={this.handleChange}
                            inputProps={{
                              name: 'age',
                              id: 'controlled-open-select',
                            }}
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>设备MAC</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备IMEI号</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备型号</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>APP版本号</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>固件版本号</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>绑定手机号</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>设备绑定时间</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐编码/名称</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐订购时间</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐生效时间</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>套餐失效时间</TableCell>
                    <TableCell numeric>{111}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                      <TableRow hover>
                        <TableCell>设备MAC</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>设备IMEI号</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>设备型号</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>APP版本号</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>固件版本号</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>绑定手机号</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>设备绑定时间</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>套餐编码/名称</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>套餐订购时间</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>套餐生效时间</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>套餐失效时间</TableCell>
                        <TableCell numeric>{111}</TableCell>
                      </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
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
