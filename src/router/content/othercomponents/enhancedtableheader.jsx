import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import { lighten } from 'material-ui/styles/colorManipulator';

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
          <TableCell >报文时间</TableCell>
          <TableCell >订购手机号</TableCell>
          <TableCell >设备MAC/IMEI</TableCell>
          <TableCell >报文渠道</TableCell>
          <TableCell >报文类型</TableCell>
          <TableCell >订购来源</TableCell>
          <TableCell >解析结果</TableCell>
          <TableCell >处理结果</TableCell>
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
