import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import QueryText from './othercomponents/querytext';
import Snack from '../components/snackbar';
import EnhancedTableHead from './othercomponents/enhancedtableheader';
import EnhancedTableToolbar from './othercomponents/enhancedtabletoolbar';
import md5 from 'md5';
import { parseString } from 'xml2js';
import { CircularProgress } from 'material-ui/Progress';
import Zoom from 'material-ui/transitions/Zoom';

import { ajax } from '../../commons/ajax'
let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

const styles = theme => ({
  rootdiv: {
    width: '100%',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1000,
  },
  tabletr:{
    height:40,
    "&>td":{
      padding:5,
    },
    "&>td:last-child":{
      padding:1,
      textAlign:"center"
      },
    "&>td:first-child":{
      padding:1,
      textAlign:"center"
      }
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  dialogtitle:{
    padding:10
  },
  dialogContent:{
    padding:"0px 5px"
  },
  dialogActions:{
    padding:"0px 5px"
  }
});
function Transition(props) {
  return <Zoom timeout={700} {...props} />;
}
class PackageInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      data: [].sort((a, b) => (a.time < b.time ? -1 : 1)),
      page: 0,
      rowsPerPage: 6,
      msg: "",
      loading:false,
      modelopen:false,
      messages:''
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleClick = (event, id) => {
   
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  handleModalClose
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleModalClose(){
    this.setState({modelopen:false})
  }
  handleModalOpen(msg){
    this.setState({modelopen:true,messages:msg})
  }
  handleQuery(data){
    console.log(data)

    let macimei=data.macimei
    let phone=data.phone
    let orderno=data.orderno
    let params={
      MsgType: "ACTION_QUERY_BUYREPORTS_INFO",
      Token: sessionStorage.token,
    }
    if(phone!=="" && phone!== undefined){
      params['phone']= phone
      params['Sign']= md5("ACTION_QUERY_BUYREPORTS_INFO"+sessionStorage.token+phone);
    }else if(macimei!=="" && macimei!== undefined){
      params['macimei']= macimei
      params['Sign']= md5("ACTION_QUERY_BUYREPORTS_INFO"+sessionStorage.token+ macimei);
    }else{
      params['orderno']= orderno
      params['Sign']= md5("ACTION_QUERY_BUYREPORTS_INFO"+sessionStorage.token+ orderno);
    }
    this.setState({data:[]})
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case "10000":
          // console.log(req.data)
          if(req.data.hasOwnProperty('resultData') && req.data.resultData!==''){
            let dhdata=[]
              req.data.resultData.reports.forEach((n)=>{
                console.log(typeof n.msgbody)
                
                parseString(n.msgbody,{explicitArray : false},(err,result)=>{
                  if(!err){
                    let devmac=""
                    if(result.OwnPlatForm.Content.BizProcReq.hasOwnProperty('DeviceInfo')){
                      devmac=result.OwnPlatForm.Content.BizProcReq.DeviceInfo.DevMac;
                    }
                    dhdata.push(
                      { time:n.time,
                        devMac:devmac,
                        phoneNum:result.OwnPlatForm.Content.BizProcReq.IDValue||"",
                        oprCode:result.OwnPlatForm.Content.BizProcReq.OprCode||"",
                        oprSrc:result.OwnPlatForm.OprSrc||"",
                        verifyresult:n.verifyresult,
                        result:n.result,
                        messages:n.msgbody
                      })
                  }else{
                    try {
                      result=JSON.parse(n.msgbody)
                      dhdata.push({
                          time:n.time,
                          devMac:result.devMac,
                          phoneNum:result.phoneNum,
                          oprCode:result.oprCode,
                          oprSrc:result.funCode,
                          verifyresult:n.verifyresult,
                          result:n.result,
                          messages:JSON.stringify(result,null,4)
                      })
                    }catch(err){
                      if(n.msgbody.match("REQ|")){
                        let tmpres=n.msgbody.split("|");
                        dhdata.push({
                                time:n.time,
                                devMac:tmpres[4],
                                phoneNum:tmpres[3]||"",
                                oprCode:tmpres[0],
                                oprSrc:"",
                                verifyresult:n.verifyresult,
                                result:n.result,
                                messages:n.msgbody
                        })
                      }else{
                        console.log("解析报文，存在失败情况 ！请检查！"+err)
                      }
                    }
                  }
                })
              })
            this.setState({loading:false,msg:"",data:dhdata})
          }else{
             this.setState({loading:false,msg:"",data:[]})
          }
          break;
        case "22222":
          this.setState({msg:req.data.resultMsg,loading:false});
          setTimeout(()=>{this.props.userLoginOut()}, 1000);
          break;
        default:
          this.setState({msg:req.data.resultMsg,loading:false});
      }
    }).catch(()=>{
      console.log('')
    })

  }
  setStateMsg(msg){
    this.setState(msg);
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    let index=0;
    const pkgType={
      MSG_PACKAGE_ORDER_REQ:"套餐订购",
      MSG_PACKAGE_UNSUBSCRIBE_REQ:"未知",
      MSG_DEVSN_CHANGE_REQ:"设备变更",
      MSG_PACKAGE_CHANGE_REQ:"套餐变更",
      "01":"套餐订购",
      "04":"套餐订购",
      "05":"套餐暂停",
      "06":"套餐退订",
    }
    return (
      <div className={classes.rootdiv}>
        <QueryText 
            setmsg={this.setStateMsg.bind(this)} 
            handleQuery={this.handleQuery.bind(this)}
            loading={this.state.loading} 
            disSearial={true}
            />
        <Paper className={classes.root} >
          <EnhancedTableToolbar />
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      tabIndex={-1}
                      key={n.id}
                      className={classes.tabletr}
                    >
                      <TableCell padding="none" >{index++}</TableCell>
                      <TableCell padding="none">{new Date(parseInt(n.time,10)*1000).Format("yyyy-MM-dd hh:mm:ss")}</TableCell>
                      <TableCell >{n.phoneNum}</TableCell>
                      <TableCell >{n.devMac}</TableCell>
                      <TableCell >{pkgType.hasOwnProperty(n.oprCode)?pkgType[n.oprCode]:""}</TableCell>
                      <TableCell >{n.carbs}</TableCell>
                      <TableCell >{n.verifyresult==="0"?"成功":"解析失败"}</TableCell>
                      <TableCell >{n.result}</TableCell>
                      <TableCell numeric>
                        <Button 
                          variant="flat"  
                          size="small" 
                          color="primary"
                          onClick={this.handleModalOpen.bind(this,n.messages)}>
                          详细报文
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 40 * emptyRows }}>
                    <TableCell colSpan={9} style={{textAlign:"center"}}>
                      {this.state.loading && <CircularProgress size={100} />}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={9}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                      'aria-label': '上一页',
                    }}
                    nextIconButtonProps={{
                      'aria-label': '下一页',
                    }}
                    rowsPerPageOptions={[6,12]}
                    labelRowsPerPage={"每页显示："}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <Snack title={this.state.msg} vertical={"bottom"} />
        </Paper>
        <Dialog
          open={this.state.modelopen}
          transition={Transition}
          keepMounted
          maxWidth={"md"}
          onClose={this.handleModalClose.bind(this)}
          aria-labelledby="form-dialog-title"
           >
          <DialogTitle id="form-dialog-title" className={classes.dialogtitle}>详细报文</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <pre style={{ backgroundColor: "#1f1e1e",
                          color: "#a0a0a0",
                          padding: 10,
                          lineHeight:1.7,
                          borderRadius:3,
                          margin:0}}>
              {this.state.messages}
            </pre>           
          </DialogContent>
          <DialogActions className={classes.dialogActions} >
            <Button onClick={this.handleModalClose.bind(this)} color="primary">
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

PackageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PackageInfo);
