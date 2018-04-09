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
  DialogTitle,
} from 'material-ui/Dialog';
import Tooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import QueryText from './othercomponents/querytext';
import Snack from '../components/snackbar';
import EnhancedTableHead from './othercomponents/enhancedtableheader';
import EnhancedTableToolbar from './othercomponents/enhancedtabletoolbar';
import md5 from 'md5';
import { parseString,Builder } from 'xml2js';
import { CircularProgress } from 'material-ui/Progress';
import Zoom from 'material-ui/transitions/Zoom';

import { ajax } from '../../commons/ajax'

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
      padding:3,
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
  return <Zoom {...props} key={"test"} timeout={500}/>;
}
class OrderMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: 'asc',
      orderBy: 'time',
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
    let macimei=data.macimei
    let phone=data.phone
    let orderno=data.orderno
    let params={
      MsgType: "ACTION_QUERY_BUYREPORTS_INFO",
      Token: sessionStorage.token,
    }    
    if(phone!=="" && phone!== undefined){
      params['phone']= phone
    }else if(macimei!=="" && macimei!== undefined){
      params['macimei']= macimei
    }else{
      params['orderno']= orderno
    }
    let tmpSign=""
    Object.keys(params).sort().forEach((n)=>{
      tmpSign+=params[n]
    })
    params['Sign']=md5(tmpSign);
    this.setState({data:[]})
    ajax('/api',params).then((req,rsp,next)=>{
      switch(req.data.resultCode){
        case "10000":
          // console.log(req.data)
          if(req.data.hasOwnProperty('resultData') && req.data.resultData!==''){
            let dhdata=[]
              req.data.resultData.reports.forEach((n)=>{
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
                        bossCode:result.OwnPlatForm.Content.BizProcReq.BossCode||"",
                        verifyresult:n.verifyresult,
                        result:n.result,
                        messages:new Builder().buildObject(result)
                      })
                  }else{
                    try {
                      result=JSON.parse(n.msgbody)
                      dhdata.push({
                          time:n.time,
                          devMac:params['Type']==='homeopen'?result.idValue:result.devMac,
                          phoneNum:params['Type']==='homeopen'?result.idValue:result.phoneNum,
                          oprCode:params['Type']==='homeopen'?result.orderType:result.oprCode,
                          oprSrc:result.funCode,
                          bossCode:result.area||"",
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
                                bossCode:tmpres[2]||"",
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
      "01":"套餐开通",
      "03":"套餐退订",
      "05":"套餐暂停",
      "06":"套餐恢复",
      "07":"套餐变更",
      "08":"设备MAC变更",
      "11":"开通检查",
      "13":"退订检查",
      "15":"套餐暂停检查",
      "16":"套餐恢复检查",
      "17":"套餐变更检查",
      "18":"设备MAC变更检查", 
    }
    const area={
      "471":"内蒙古",
      "100":"北京",
      "220":"天津",
      "531":"山东省",
      "311":"河北省",
      "351":"山西省",
      "551":"安徽省",
      "210":"上海",
      "250":"江苏省",
      "571":"浙江省",
      "591":"福建省",
      "898":"海南省",
      "200":"广东省",
      "771":"广西自治区",
      "971":"青海省",
      "270":"湖北省",
      "731":"湖南省",
      "791":"江西省",
      "371":"河南省",
      "891":"西藏自治区",
      "280":"四川省",
      "230":"重庆",
      "290":"陕西省",
      "851":"贵州省",
      "871":"云南省",
      "931":"甘肃省",
      "951":"宁夏自治区",
      "991":"新疆自治区",
      "431":"吉林省",
      "240":"辽宁省",
      "451":"黑龙江省",
      "7777":"互联网渠道",
      "8888":"自有渠道",
      "6666":"省渠道",
      "9191":"铁通",
      "7000":"一级家开",
      "36":"内蒙古",
      "32":"北京",
      "33":"天津",
      "46":"山东省",
      "34":"河北省",
      "35":"山西省",
      "43":"安徽省",
      "40":"上海",
      "41":"江苏省",
      "42":"浙江省",
      "44":"福建省",
      "51":"海南省",
      "50":"广东省",
      "52":"广西自治区",
      "59":"青海省",
      "48":"湖北省",
      "49":"湖南省",
      "45":"江西省",
      "47":"河南省",
      "62":"西藏自治区",
      "54":"四川省",
      "53":"重庆",
      "57":"陕西省",
      "55":"贵州省",
      "56":"云南省",
      "58":"甘肃省",
      "60":"宁夏自治区",
      "61":"新疆自治区",
      "38":"吉林省",
      "37":"辽宁省",
      "39":"黑龙江省",
      "77":"互联网渠道",
      "88":"自有渠道",
      "66":"省渠道",
      "91":"铁通",
      "110":"一级家开"
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
          <EnhancedTableToolbar titlemsg={this.props.hasOwnProperty('match')?"家开订购报文明细":"订购报文明细"} />
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
                      tabIndex={-1}
                      key={index}
                      className={classes.tabletr}
                    >
                      <TableCell padding="none" >{index++}</TableCell>
                      <TableCell padding="none">{new Date(parseInt(n.time,10)*1000).Format("yyyy-MM-dd hh:mm:ss")}</TableCell>
                      <TableCell >{n.phoneNum}</TableCell>
                      <TableCell >{n.devMac}</TableCell>
                      <TableCell >{area.hasOwnProperty(n.bossCode)?area[n.bossCode]:""}</TableCell>
                      <TableCell >{pkgType.hasOwnProperty(n.oprCode)?pkgType[n.oprCode]:""}</TableCell>
                      <TableCell >{n.oprSrc==="01"?"BOSS正向":(n.oprSrc==="09"?"APP反向":"")}</TableCell>
                      <TableCell >{n.verifyresult==="0"?"成功":"解析失败["+n.verifyresult+"]"}</TableCell>
                      <TableCell >
                        <Tooltip title={n.result}>
                          <div style={{maxWidth:200,overflow: "hidden"}}>{n.result}</div>
                        </Tooltip>
                      </TableCell>
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
                    <TableCell colSpan={10} style={{textAlign:"center"}}>
                      {this.state.loading && <CircularProgress size={100} />}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={10}
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

OrderMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderMessage);
