import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardMedia,CardHeader } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Typography from 'material-ui/Typography';
import Fade from 'material-ui/transitions/Fade';
import Zoom from 'material-ui/transitions/Zoom';
import green from 'material-ui/colors/green';
import user from '../../images/user.png';
const styles = theme=>({
  card: {
    width: 400,
    margin:"0 auto",
    marginTop: 60,
    position: "relative",
  },
  media: {
    height: 360,
    backgroundSize:"100% 100%",
    cursor: "pointer"
  },
  topinfo:{
    width: "100%",
    position:"absolute",
    boxSizing: "border-box",
    backgroundColor: "rgba(218, 215, 215, 0.4117647058823529)",
    paddingTop:10,
    paddingBottom:10,
    "&>div":{
      marginTop:0,
    }
  },
  toptitle:{
    margin:2,
    color:'#eae9e9'
  },
  greenAvatar: {
    color: '#fff',
    width:55,
    height:55,
    fontSize:"2rem",
    backgroundColor: green[500],
  },
  useriptime:{
    float:"right",
    fontSize:"1.1rem",
    color:"#B9B9B9"
  },
  carcontent:{
    "&:last-child":{
      paddingBottom:0
    }
  },
  pushicon:{
    marginTop:6
  },
  typography:{
    height:32
  },
  tabothalign: {
    width:90,
    display: "inline-block",
    fontSize:"1.1rem",
    textAlign:"justify",
    "&>i":{
      display: "inline-block",
      width:"100%"
    }
  }
});

export class UserInfo extends Component {
  constructor(props) {
      super(props);
      this.state={
        display:false,
        in:false
          };
    }
  componentDidMount() {
    this.setState({in:true})
    const { upload }=this.refs
    upload.onchange=()=>{
      if(upload.value!=""){
        this.handleUpload(upload.files);
      }
    }
  }
  handleChange(){
    this.setState({display:!this.state.display});
  }
  handleUpload(files){
    var form = new FormData(),   
    url = '/api/upload', //服务器上传地址  
    file = files[0];  
    form.append('file', file); 
    form.append('Token', sessionStorage.token); 
    form.append('MsgType', "ACTION_AVATER_UPLOAD"); 

    var xhr = new XMLHttpRequest();  
    xhr.open("post", url, true);  
    //上传进度事件  
    xhr.upload.addEventListener("progress", function(result) {  
        if (result.lengthComputable) {  
            //上传进度  
            var percent = (result.loaded / result.total * 100).toFixed(2); 
            console.log(percent)  
        }  
    }, false);  
    const _logout=this.props.userLoginOut 
    xhr.addEventListener("readystatechange", function() {  
        var result = xhr; 
        if(result.readyState===4){
          if (result.status != 200 ) { //error  
              console.log('上传失败', result.status, result.statusText, result.response);  
          } else { //finished  
              try{
                const data=JSON.parse(result.response);
                switch(data.resultCode){
                  case "10000":
                    console.log('上传成功', result);  
                    break;
                  case "22222":
                    _logout()
                    break;
                  default:
                    console.log(data)
                }
              }catch(err){

              }
            }
        }
    });  
    xhr.send(form); //开始上传 
  }
  handleChangeUpload(){
    this.refs.upload.click()
  }
  render() {
    const { classes,userInfo } = this.props;
    const options={
        baseUrl:'http://127.0.0.1',
        param:{
            fid:0
        }
    }
    return (
    <Zoom timeout={500} in={this.state.in}>
      <Card className={classes.card} onMouseOver={this.handleChange.bind(this)} onMouseOut={this.handleChange.bind(this)}>
        <Fade timeout={600} in={this.state.display}>
          <CardHeader
              avatar={
                <Avatar aria-label="用户" className={classes.greenAvatar}>
                  {userInfo.username.substr(0,1)}
                </Avatar>
              }
              className={classes.topinfo}
              action={
                  <IconButton className={classes.pushicon} >
                    <MoreVertIcon />
                  </IconButton>
              }
              title={
                <h2 className={classes.toptitle}>{userInfo.username+"-"+userInfo.loginuser}</h2>
              }
              subheader={<h4 className={classes.toptitle}>{userInfo.department}</h4>}
            />
          </Fade>
        <CardMedia
          className={classes.media}
          image={user}
          title={"点击修改图片"}
          onClick={this.handleChangeUpload.bind(this)}
        />
        <input ref="upload" type="file" 
              multiple="multiple"
              accept="image/png,image/jpeg,image/gif,image/jpg" 
              style={{display:"none"}} />  
        <CardContent className={classes.carcontent}>

          <Typography gutterBottom variant="display1">
             {userInfo.username}-{userInfo.loginuser}
          </Typography>
          <Typography className={classes.typography}>
            <span className={classes.tabothalign}>上次登陆IP<i></i></span>
            <span className={classes.useriptime}>{this.props.userInfo.lastloginip}</span>
          </Typography>
          <Typography className={classes.typography}>
            <span className={classes.tabothalign}>登陆时间<i></i></span>
            <span className={classes.useriptime}>{this.props.userInfo.logintime}</span>
          </Typography>
        </CardContent>
       </Card>
      </Zoom>
    );
  }
}
UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
export default connect(mapStateToProps,null)(withStyles(styles)(UserInfo));