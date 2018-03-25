import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Login from './login'
import {userLoginIn} from '../../actions'

function mapStateToProps(state) {
  return {
    ...state.login,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    userLoginIn: bindActionCreators(userLoginIn, dispatch),
  }
}

export default connect(  
    mapStateToProps,
    mapDispatchToProps,
  )(Login);