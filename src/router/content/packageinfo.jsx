import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
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
    minWidth: 700,
  },
  paper:{
    paddingLeft:30,
  },
  textField:{
    minWidth:250,
    marginLeft:30,
  },
  search: {
    margin: 22,
    float: "right"
  },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class PackageInfo extends Component {
  constructor(props) {
      super(props);
      this.state={
        msg:"",
        in: false,
      }
  }
  handleQuery(){
    let macimei=this.macimei
    let phone=this.phone
    if(macimei.value=== "" && phone.value===""){
      this.setState({msg:"请输入用户手机号或设备MAC号或设备IMEI号"});
      phone.focus();
    }
    if(macimei.value!=""){
      if(!(macimei.value.length==12 || macimei.value.length==15)){
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
    if(phone.value!=""){
      if(!(phone.value.length==11)){
        this.setState({msg:"请输入正确位数的手机号码。"});
        phone.focus()
        return false;
      }
      if(!phone.value.match(/^13\d+$/g)){
        this.setState({msg:"请输入合法的手机号码。"});
        phone.focus()
        return false;
      }
    }
    let params={
      MsgType: "ACTION_QUERY_PACKAGE_INFO",
      Token: sessionStorage.token,
    }
    if(phone.value!=""){
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
        case "xxxxx":
          break;
        default:
      }
    }).catch(error=>{
      this.setState({msg:"数据提交错误！或网络异常！",substatus:false});
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
          <Grid item xs={12}>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell numeric>Calories</TableCell>
                    <TableCell numeric>Fat (g)</TableCell>
                    <TableCell numeric>Carbs (g)</TableCell>
                    <TableCell numeric>Protein (g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(n => {
                    return (
                      <TableRow key={n.id}>
                        <TableCell>{n.name}</TableCell>
                        <TableCell numeric>{n.calories}</TableCell>
                        <TableCell numeric>{n.fat}</TableCell>
                        <TableCell numeric>{n.carbs}</TableCell>
                        <TableCell numeric>{n.protein}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
            <Snack title={this.state.msg} vertical={"bottom"} />
          </Grid>
        </Grid>
    );
  }
}

PackageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(PackageInfo);
