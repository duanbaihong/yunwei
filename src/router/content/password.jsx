import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Snack from '../components/snackbar';
import { ajax } from '../../commons/ajax'
import md5 from 'md5';
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
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft:  theme.spacing.unit * 2,
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
        substatus: false,
        in: false,
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
    let opass=md5(this.oldpassword.value)
    let npass=md5(this.newpassword.value)
    let repass=md5(this.renewpassword.value)
    let params={
      MsgType: "ACTION_CHANGE_PASSWORD",
      Token: sessionStorage.token,
      oldpassword: opass,
      newpassword: npass,
      renewpassword: repass,
      Sign:md5(sessionStorage.token+opass+npass+repass)
    }
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case '11001':
          this.oldpassword.focus();
          break;
        case '11002':
          this.oldpassword.focus();
          break;
        case '11003':
          this.oldpassword.focus();
          break;
        case '22222' :
          setTimeout(()=>this.props.userLoginOut(),1000)
          break
        case '10000':
          this.oldpassword.value=""
          this.newpassword.value=""
          this.renewpassword.value=""
          setTimeout(()=>this.props.userLoginOut(),1000)
          break;
        default:
          this.setState({msg:req.data.resultMsg!==""?req.data.resultMsg:"数据报文异常！",substatus:false});
          return false;
      }
      this.setState({msg:req.data.resultMsg,substatus:false})

    }).catch(error=>{
      this.setState({msg:"数据提交错误！或网络异常！",substatus:false});
      console.log(error)
    })
  }
  componentDidMount() {
    this.setState({in:true})
  }
  render() {

    let {classes} =this.props;
    return (
      <Slide direction="left" in={this.state.in} timeout={500}>
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
      </Slide>
      );
  }
}
Password.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Password);
