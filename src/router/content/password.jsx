import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Divider from 'material-ui/Divider';
import Snack from '../components/snackbar';
import { ajax } from '../../commons/ajax'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 2,
  }),
  rootPaper:{
    padding:30,
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'right',
    color: theme.palette.text.error,
    lineHeight:4
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Password extends Component {
  constructor(props) {
      super(props);
      this.state={
        msg:"",
        substatus: false
      }
  }
  handleSubmit(){
    if(this.oldpassword.value==="") {
      this.oldpassword.focus(); 
      this.setState({msg:"请输入原用户密码。",substatus:false});
      return false;
    }
    if(this.newpassword.value==="") {
      this.newpassword.focus(); 
      this.setState({msg:"请输入新用户密码。",substatus:false});
      return false;
    }
    if(this.renewpassword.value==="") {
      this.renewpassword.focus();
      console.log(this)
      this.setState({msg:"请重新输入新用户密码。",substatus:false});
      return false;
    }
    if(this.renewpassword.value!==this.newpassword.value) {
      this.renewpassword.focus(); 
      this.setState({msg:"两次输入的新密码不一致。",substatus:false})
      return false;
    }

    this.setState({substatus: true,msg:''})
    let params={
      userToken: "test",
      oldpassword: this.oldpassword.value,
      newpassword: this.newpassword.value,
      renewpassword: this.renewpassword.value
    }
    ajax('/api',params).then((req,rsp,next)=>{
      // error 11001 原密码错误！
      // 11002 新密码不一致！
      // 11003 新密码与旧密码一样。
      switch(req.data.resultCode){
        case '11001':
          this.setState({msg:"原密码效验错误。",substatus:false});
          this.oldpassword.focus();
          break;
        case '11002':
          this.setState({msg:"新密码不一致。"});
          this.oldpassword.focus();
          break;
        case '11003':
          this.setState({msg:"新密码与旧密码一样，修改不成功！",substatus:false});
          this.oldpassword.focus();
          break;
        case '10000':
          this.setState({msg:"密码修改成功！",substatus:false});
          this.oldpassword.value=""
          this.newpassword.value=""
          this.renewpassword.value=""
          break;
        default:
          this.setState({msg:"数据报文异常！",substatus:false});
      }

    }).catch(error=>{
      this.setState({msg:"数据提交错误！或网络异常！",substatus:false});
      console.log(error)
    })
  }
  render() {
    let {classes} =this.props;
    return (
      <Paper className={classes.rootPaper} >
      <Grid container spacing={8} >
        <Grid container >
          <Grid item xs={4} className={classes.paper} >原密码</Grid>
          <Grid item xs={5}  className={classes.paper}>
            <TextField
              id="old_password"
              label="原密码"
              placeholder="请输入原密码"
              required={true}
              fullWidth={true}
              type={'password'}
              autoFocus={true}
              inputRef={(c) => this.oldpassword = c}
            />
          </Grid>
        </Grid>
        <Grid container >
          <Grid item xs={4} className={classes.paper} >新密码</Grid>
          <Grid item xs={5} className={classes.paper} >
            <TextField
              id="new_password"
              label="新密码"
              placeholder="请输入新密码"
              required={true}
              type={'password'}
              fullWidth={true}
              autoFocus={true}
              inputRef={(c) => this.newpassword = c}
            />
          </Grid>
        </Grid>
        <Grid container >
          <Grid item xs={4} className={classes.paper} >确认新密码</Grid>
          <Grid item xs={5} className={classes.paper} >
            <TextField
              id="renew_password"
              type={'password'}
              label="确认新密码"
              placeholder="请确认新密码"
              required={true}
              fullWidth={true}
              autoFocus={true}
              inputRef={(c) => this.renewpassword = c}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.paper}>
        <Divider />
          <Button variant="raised" 
            color="primary" 
            className={classes.button}
            onClick={this.handleSubmit.bind(this)} disabled={this.state.substatus}>
          保存
          </Button>
        </Grid>
        </Grid>

        <Snack title={this.state.msg} vertical={"bottom"} />
      </Paper>
      );
  }
}
Password.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Password);
