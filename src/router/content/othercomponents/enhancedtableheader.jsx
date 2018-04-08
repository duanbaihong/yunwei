import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';

const toolbarStyles = theme => ({
  thead: {
    height: 45,
    borderTop: "1px solid rgba(224, 224, 224, 1)",
    "&>th":{
      fontSize:'0.98rem',
      padding:0
    },
    "&>th:last-child":{
      paddingRight:0
    },
  },
  firstth:{
    padding:1,
    textAlign:"center",
    width: 35
  },
  labelsort:{
    "&>svg":{
      margin:0
    }
  },
  lastth:{
    padding:1,
    textAlign:"center",
    width: 85,
    paddingRight:5,
  },
  title: {
    flex: '0 0 auto',
  },
});

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };
  render() {
    const {order, orderBy, classes } = this.props;
    return (
      <TableHead >
        <TableRow className={classes.thead}>
          <TableCell className={classes.firstth} >#</TableCell>
          <TableCell >
            <TableSortLabel 
              active={orderBy === "time"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('time')}>
              报文时间
            </TableSortLabel>
          </TableCell>
          <TableCell >
            <TableSortLabel 
              active={orderBy === "phoneNum"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('phoneNum')}>
                订购手机号
            </TableSortLabel>
          </TableCell>
          <TableCell >
            <TableSortLabel 
              active={orderBy === "devMac"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('devMac')}>
                设备MAC/IMEI
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel 
              active={orderBy === "bossCode"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('bossCode')}>
                报文渠道
            </TableSortLabel>
          </TableCell>
          <TableCell >
            <TableSortLabel 
              active={orderBy === "oprCode"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('oprCode')}>
                报文类型
            </TableSortLabel>
          </TableCell>
          <TableCell >
            <TableSortLabel 
              active={orderBy === "oprSrc"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('oprSrc')}>
                订购来源
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel 
              active={orderBy === "verifyresult"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('verifyresult')}>
                解析结果
            </TableSortLabel>
          </TableCell>
          <TableCell >
            <TableSortLabel 
              active={orderBy === "result"}
              direction={order}
              className={classes.labelsort}
              onClick={this.createSortHandler('result')}>
                处理结果
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.lastth}>详细报文</TableCell>
              
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableHead);
