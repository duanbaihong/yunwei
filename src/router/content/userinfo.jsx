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
import back from '../../images/back.jpg';
const styles = theme=>({
  card: {
    width: 400,
    margin:"0 auto",
    marginTop: 50,
    position: "relative",
  },
  media: {
    height: 350,
  },
  topinfo:{
    width: "100%",
    position:"absolute",
    boxSizing: "border-box",
    backgroundColor: "rgba(218, 215, 215, 0.4117647058823529)",
    paddingTop:5,
    paddingBottom:5,
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
    width:48,
    height:48,
    backgroundColor: green[500],
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
  }
  handleChange(){
    this.setState({display:!this.state.display});
  }
  render() {
    const { classes,userInfo } = this.props;
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
                  <IconButton  >
                    <MoreVertIcon />
                  </IconButton>
              }
              title={
                <h3 className={classes.toptitle}>{userInfo.username+"-"+userInfo.loginuser}</h3>
              }
              subheader={<h4 className={classes.toptitle}>{userInfo.department}</h4>}
            />
          </Fade>
        <CardMedia
          className={classes.media}
          image={back}
          title={"点击修改图片"}
        />
        <CardContent>
          <Typography gutterBottom variant="display1">
             {userInfo.username}-{userInfo.loginuser}
          </Typography>
          <Typography >
            <span className={classes.tabothalign}>上次登陆IP<i></i></span>{this.props.userInfo.lastloginip}
          </Typography>
          <Typography >
            <span className={classes.tabothalign}>登陆时间<i></i></span>{this.props.userInfo.logintime}
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