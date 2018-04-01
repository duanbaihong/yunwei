import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SearchIcon from 'material-ui-icons/Search';
import green from 'material-ui/colors/green';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
const styles = theme => ({
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
  wordshow:{
    [theme.breakpoints.down('sm')]:{
      display:"none"
    }
  },
  textField:{
    minWidth:210,
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
  class QueryText extends Component {
  handleQuery(){
    let macimei=this.macimei
    let phone=this.phone
    let data={};
    if(macimei.value=== "" && phone.value===""){
      this.props.setmsg({msg:"请输入用户手机号或设备MAC号或设备IMEI号"});
      phone.focus();
      return false;
    }
    if(macimei.value!==""){
      if(!(macimei.value.length===12 || macimei.value.length===15)){
        this.props.setmsg({msg:"请输入正确的设备MAC或IMEI位数。"});
        macimei.focus()
        return false;
      }
      if(!macimei.value.match(/^\w+$/g)){
        this.props.setmsg({msg:"请输入合法的设备MAC或IMEI号。"});
        macimei.focus()
        return false;
      }
      data['macimei']=macimei.value;
    } else if(phone.value!==""){
      if(!(phone.value.length===11)){
        this.props.setmsg({msg:"请输入正确位数的手机号码。"});
        phone.focus()
        return false;
      }
      if(!phone.value.match(/^1[3456789]\d+$/g)){
        this.props.setmsg({msg:"请输入合法的手机号码。"});
        phone.focus()
        return false;
      }
      data['phone']=phone.value;
    }
    this.props.setmsg({loading:true})
    this.props.handleQuery(data);
  }
  render() {
    const {classes} = this.props;
    const {loading} = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          <span className={classes.wordshow}>查询方式：</span>
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
            <div className={classes.search}>
              <Button variant="raised" 
                      color="secondary" 
                      disabled={loading}
                      onClick={this.handleQuery.bind(this)}>
                <SearchIcon />
                查询
              </Button>
              {loading && <CircularProgress size={40} className={classes.buttonProgress} />}
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
QueryText.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(QueryText);
