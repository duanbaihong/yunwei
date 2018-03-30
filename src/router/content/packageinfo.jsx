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
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SearchIcon from 'material-ui-icons/Search';
import Snack from '../components/snackbar';
import md5 from 'md5';

import { ajax } from '../../commons/ajax'
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 0,
    overflowX: 'auto',
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
      height:35
    }
  },
  paper:{
    paddingLeft:30,
    [theme.breakpoints.down('sm')]:{
      paddingLeft:10,
      marginTop:0,
      marginLeft:10
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
    float: "right"
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

  handleQuery(){
    let macimei=this.macimei
    let phone=this.phone
    if(macimei.value=== "" && phone.value===""){
      this.setState({msg:"请输入用户手机号或设备MAC号或设备IMEI号"});
      phone.focus();
      return false;
    }
    if(macimei.value!==""){
      if(!(macimei.value.length===12 || macimei.value.length===15)){
        this.setState({msg:"请输入正确的设备MAC或IMEI位数。"});
        macimei.focus()
        return false;
      }
      if(!macimei.value.match(/^\w+$/g)){
        this.setState({msg:"请输入合法的设备MAC或IMEI号。"});
        macimei.focus()
        return false;
      }
    }
    if(phone.value!==""){
      if(!(phone.value.length===11)){
        this.setState({msg:"请输入正确位数的手机号码。"});
        phone.focus()
        return false;
      }
      if(!phone.value.match(/^1[3456789]\d+$/g)){
        this.setState({msg:"请输入合法的手机号码。"});
        phone.focus()
        return false;
      }
    }
    let params={
      MsgType: "ACTION_QUERY_PACKAGE_INFO",
      Token: sessionStorage.token,
    }
    if(phone.value!==""){
      params['phone']= phone.value
      params['Sign']= md5("ACTION_QUERY_PACKAGE_INFO"+sessionStorage.token+phone.value);
    }else{
      params['macimei']= macimei.value
      params['Sign']= md5("ACTION_QUERY_PACKAGE_INFO"+sessionStorage.token+ macimei.value);
    }
    console.log(params)
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case "10000":

          break;
        case "xxxxx":
          break;
        case "22222":
          this.setState({msg:req.data.resultMsg});
          setTimeout(()=>{this.props.userLoginOut()}, 1000);
          break;
        default:
          this.setState({msg:req.data.resultMsg});
      }
    }).catch(error=>{
      this.setState({msg:"数据提交错误！或网络异常！"});
      console.log(error)
    })
  }
  render() {
    const { classes } = this.props;
    return (
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              查询方式：
              <TextField
                id="phone_imei"
                label="手机号"
                className={classes.textField}
                type="text"
                autoComplete="phone"
                margin="normal"
                inputRef={(c) => this.phone = c}
              /> 
              <TextField
                id="password-input"
                label="设备号MAC或IMEI号查询"
                className={classes.textField}
                type="text"
                autoComplete="macimei"
                margin="normal"
                inputRef={(c) => this.macimei = c}
              />
              <Button variant="raised" 
                      color="secondary" 
                      className={classes.search}
                      onClick={this.handleQuery.bind(this)}>
                <SearchIcon />
                查询
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow hover>
                    <TableCell>运管套餐情况</TableCell>
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
    );
  }
}

PackageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PackageInfo);
