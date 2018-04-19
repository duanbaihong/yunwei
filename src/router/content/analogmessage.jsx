import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Snack from '../components/snackbar';
import SelectUrl from '../components/selecturl';
import md5 from 'md5';
import { parseString,Builder } from 'xml2js';
// import Zoom from 'material-ui/transitions/Zoom';
import { LinearProgress } from 'material-ui/Progress';
import { ajax } from '../../commons/ajax'
import Zoom from 'material-ui/transitions/Zoom';
const styles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    padding:15
  },
  messages:{
    width:"100%",
    height:"100%",
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
  paper:{
    height:"100%"
  },
  textField: {
    flexBasis: 200,
  }
});
class HomeMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      urlvalue: '',
      msg:'',
      currency:'',
      loading:false,
      returndata:"",
      completed:0
    };
  }
  handleSetStatus(msg){
    this.setState(msg)
  }
  handleChange = key => (event, value) => {
    this.setState({
      [key]: value,
    });
  };
  handleQuery(data){
    if(this.refs.messages.value==="" && data.Method!=="GET"){
      this.refs.messages.focus();
      this.handleSetStatus({msg:"请输入报文内容。"})
      return false;
    }
    let params={
      MsgType: "ACTION_SEND_MESSAGE_REQ",
      Params: this.refs.messages.value,
      Token: sessionStorage.token,
    }
    if(typeof data === 'object'){
      params=Object.assign(params,data)
    }
    let tmpSign=""
    Object.keys(params).sort().forEach((n)=>{
      tmpSign+=params[n]
    })
    params['Sign']=md5(tmpSign);
    this.setState({loading:true,msg:""})
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case "10000":
          this.setState({loading:false,returndata:req.data.resultData})
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
  progress = () => {
    const { completed } = this.state;
    if (completed === 100) {
      this.setState({ completed: 0 });
    } else {
      const diff = Math.random() * 10;
      this.setState({ completed: Math.min(completed + diff, 100) });
    }
  }
  render() { 
    let {classes}=this.props   
    return (
      <Zoom in={true}>
        <div className={classes.root}>
          <Paper>
            <Typography variant="title" className={classes.title}>模拟报文发送</Typography>
          </Paper>
          {this.state.completed>0 && this.state.completed<100?<LinearProgress color="secondary" variant="determinate" value={this.state.completed} />:""}
          <Paper className={classes.context} >
            <Grid container spacing={8}>
              <Grid item md={7} sm={7} xs={12}>
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
              <Grid item md={5} sm={5} xs={12}>
                <Paper className={classes.paper}>
                  <SelectUrl loading={this.state.loading} 
                  handleQuery={this.handleQuery.bind(this)}
                  handleSetStatus={this.handleSetStatus.bind(this)} />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.context} >
            <pre style={{overflow:"auto",
                  backgroundColor: "#191919",
                  color: "#36fb3d",
                  padding: 10,
                  lineHeight: 1.4,
                  borderRadius: 2}}>
            {(typeof(this.state.returndata)==='object'?JSON.stringify(this.state.returndata,null,5):this.state.returndata)||"返回内容"}
            </pre>
          </Paper>
          <Snack title={this.state.msg} vertical={"bottom"} />
        </div>
      </Zoom>
    );
  }
}

HomeMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeMessage);
