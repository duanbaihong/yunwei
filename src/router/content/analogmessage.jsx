import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';


// import Dialog, {
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from 'material-ui/Dialog';
import Tooltip from 'material-ui/Tooltip';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import {InputLabel} from 'material-ui/Input';

import InputAdornment from 'material-ui/Input';
import MenuItem from 'material-ui/Menu/MenuItem';
import { FormControl, FormHelperText } from 'material-ui/Form';

import Snack from '../components/snackbar';
import SelectUrl from '../components/selecturl';
import md5 from 'md5';
import { parseString,Builder } from 'xml2js';
import { CircularProgress } from 'material-ui/Progress';
import Zoom from 'material-ui/transitions/Zoom';
import AccountCircle from 'material-ui-icons/AccountCircle';

import { ajax } from '../../commons/ajax'

const styles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    padding:15
  },
  messages:{
    width:"100%",
    boxSizing: "border-box",
    padding:8,
    borderRadius:4,
    resize:"none",
    border: "1px solid #00000059",
    outline:"none",
    backgroundColor:"#f1dda517",
    boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.03), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"

  },
  context:{
    marginTop:10,
    padding:10
  },
  title:{
    padding:10,
    paddingLeft:20,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
  }
});
function Transition(props) {
  return <Zoom {...props} key={"test"} timeout={500}/>;
}
class HomeMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      urlvalue: '',
      msg:'',
      currency:'',
      loading:false
    };
  }
  handleSetStatus(msg){
    this.setState(msg)
  }
  handleQuery(data){
    if(this.refs.messages.value===""){
      this.refs.messages.focus();
      this.handleSetStatus({msg:"请输入报文内容。"})
      return false;
    }
    let params={
      MsgType: "ACTION_QUERY_BUYREPORTS_INFO",
      Token: sessionStorage.token,
    }
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case "10000":
          // console.log(req.data)
         
          break;
        case "22222":
          this.handleSetStatus({msg:req.data.resultMsg,loading:false});
          setTimeout(()=>{this.props.userLoginOut()}, 1000);
          break;
        default:
          this.handleSetStatus({msg:req.data.resultMsg,loading:false});
      }
    }).catch(()=>{
      console.log('')
    })

  }
  
  render() { 
    let {classes}=this.props   
    const currencies = [
        {
          value: 'USD',
          label: '$',
        },
        {
          value: 'EUR',
          label: '€',
        },
        {
          value: 'BTC',
          label: '฿',
        },
        {
          value: 'JPY',
          label: '¥',
        },
      ];
    return (
      <div className={classes.root}>
        <Paper>
          <Typography variant="title" className={classes.title}>模拟报文发送</Typography>
        </Paper>
        <Paper className={classes.context} >
          <Grid container spacing={8}>
            <Grid item md={7} sm={7} xs={7}>
                <textarea 
                  ref={"messages"}
                  className={classes.messages}
                  aria-invalid="false" 
                  aria-required="false" 
                  id="messages_content" 
                  placeholder="{}"
                  rows="15"
                  type="text"></textarea>
            </Grid>
            <Grid item md={5} sm={5} xs={5}>
              <Paper className={classes.paper}>
                <SelectUrl loading={this.state.loading} 
                handleQuery={this.handleQuery.bind(this)}
                handleSetStatus={this.handleSetStatus.bind(this)}/>   
              </Paper>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.context} >
          <pre>
          返回内容
          </pre>
        </Paper>
        <Snack title={this.state.msg} vertical={"bottom"} />
      </div>
    );
  }
}

HomeMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeMessage);
