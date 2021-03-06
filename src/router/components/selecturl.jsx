import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Zoom from 'material-ui/transitions/Zoom';
import Select from 'material-ui/Select';
import green from 'material-ui/colors/green';
import { CircularProgress } from 'material-ui/Progress';

const suggestions = [
  {label: "ELK模版",url: "https://192.168.111.66:9200/_template"},
  {label: "ELK节点",url: "https://192.168.111.66:9200/_nodes"},
  {label: "一级家开查询",url: "http://192.168.20.16:8017/fcha/auth/fch/queryOrderDetails"},
  {label: "一级家开",url: "http://192.168.20.16:8017/fcha/auth/fch/normalRequestHandler"},
  {label: "云南BOSS",url: "http://192.168.20.16:8017/bossagent/auth/yn/normalRequestHandler"},
  {label: "山西BOSS",url: "http://192.168.20.16:8017/bossagent/auth/sx/normalRequestHandler"},
  {label: "上海BOSS",url: "http://192.168.20.16:8017/bossagent/auth/sh/normalRequestHandler"},
  {label: "山东BOSS",url: "http://192.168.20.16:8017/bossagent/auth/sd/normalRequestHandler"},
  {label: "四川BOSS",url: "http://192.168.20.16:8017/bossagent/auth/scsc/normalRequestHandler"},
  {label: "新四川BOSS",url: "http://192.168.20.16:8017/bossagent/auth/scscnew/normalRequestHandler"},
  {label: "test",url: "http://192.168.20.16:8017/bossagent/auth/ln/normalRequestHandler"},
  {label: "江西BOSS",url: "http://192.168.20.16:8017/bossagent/auth/jx/normalRequestHandler"},
  {label: "江苏BOSS",url: "http://192.168.20.16:8017/bossagent/auth/js/normalRequestHandler"},
  {label: "河北BOSS",url: "http://192.168.20.16:8017/bossagent/auth/hebei/normalRequestHandler"},
  {label: "广州BOSS",url: "http://192.168.20.16:8017/bossagent/auth/gz/normalRequestHandler"},
  {label: "广西BOSS",url: "http://192.168.20.16:8017/bossagent/auth/gx/normalRequestHandler"},
  {label: "安徽BOSS",url: "http://192.168.20.16:8017/bossagent/auth/ah/normalRequestHandler"},
  {label: "ELK日志查询",url: "http://192.168.111.66:9200/"},
];

function getSuggestionValue(suggestion) {
  return suggestion.url;
}

function getSuggestions(inputValue) {
  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 || suggestion.url.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) 
    return keep;
  });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 221,
    padding:10
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  buttonSubmit:{
    marginTop:60
  },
  paper:{
    left: 0,
    right: 0,
    zIndex: 1,
    position: "absolute",
    margin: "3px 10px",
    maxHeight:300,
    overflow:"auto",
  },
  formControl:{
    marginTop:1,
  },
  input:{
    fontSize: "0.8rem",
    height:15
  },
  itemmenu:{
    padding:"2px 10px",
    fontSize:"0.5rem"
  },
  itemmenu1:{
    padding:"2px 10px",
    fontSize:"0.7rem"
  },
  label:{
    fontSize:"0.7rem",
    height:32,
    marginLeft:-8,
    marginRight:10,
  },
  radio:{
    width:30,
    height:30,
    fontSize:18,
    "&>span>svg":{
      fontSize:18
    }
  },
  buttonProgress: {
    color: green[300],
    position: 'absolute',
    left: '50%',
    marginTop:59,
    marginLeft: -19,
  },
});

class SelectUrl extends React.Component {
  state = {
    value: '',
    suggestions: [],
    optionValue:"GET",
    bodytype: "text"
  };
  renderSuggestion(suggestion, { isHighlighted }) {
    return (
      <MenuItem 
        className={this.props.classes.itemmenu1}
        selected={isHighlighted} 
        component="div">
        {suggestion.label+"-["+suggestion.url+']'}
      </MenuItem>
    );
  }
  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} className={this.props.classes.paper} >
        {children}
      </Paper>
    );
  }
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };
  handleChange1 = key => (event, value) => {
    this.setState({
      [key]: value,
    });
  };
  handleChange2(value="POST"){
    this.setState({
      optionValue:value
    })
  }
  handleSubmit(){
    if(this.address.value===""){
      this.address.focus();
      this.props.handleSetStatus({msg:"请输入URL地址，或者选择URL"})
      return false;
    }
    let subval={ProxyUrl:this.address.value,Method:this.state.optionValue};
    if(this.state.optionValue==="POST"){
      subval['Header']={"Content-Type":this.state.bodytype}
    }
    this.props.handleQuery(subval);
  }
  renderInput(inputProps) {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        label="请输入URL地址，或者选择URL"
        InputProps={{
          inputRef: (c)=>{this.address=c},
          classes: {
            input: classes.input,
          },
          ...other,
        }}
      />
    );
  }
  handleSelectChange(e){
    this.setState({bodytype:e.target.value})
  }
  render() {
    const { classes,theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };
    const menu=[
        {id:1,name: "TEXT" ,val:"text"},
        {id:2,name: "XML(application/xml)" ,val:"application/xml"},
        {id:3,name: "javascript(application/javascript)" ,val:"application/javascript"},
        {id:4,name: "JSON(application/json)" ,val:"application/json"},
        {id:5,name: "TEXT(text/plain)" ,val:"text/plain"},
        {id:6,name: "XML(text/xml)" ,val:"text/xml"},
        {id:7,name: "HTML(text/html)" ,val:"text/html"},
      ]
    return (
      <div className={classes.container}>
      <Autosuggest
        theme={{
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={this.renderInput.bind(this)}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={this.renderSuggestionsContainer.bind(this)}
        focusInputOnSuggestionClick={false}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion.bind(this)}
        inputProps={{
          classes,
          placeholder: '请输入URL地址，或者选择URL',
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
      <RadioGroup
        row
        aria-label="transformOriginHorizontal"
        name="transformOriginHorizontal"
        value={this.state.transformOriginHorizontal}
        onChange={this.handleChange1('transformOriginHorizontal')}
      >
        <FormControlLabel className={classes.label} value="GET" control={<Radio className={classes.radio} checked={this.state.optionValue==="GET"} onChange={this.handleChange2.bind(this,"GET")} />} label="GET" />
        <FormControlLabel className={classes.label}  value="POST" control={<Radio className={classes.radio} checked={this.state.optionValue==="POST"} onChange={this.handleChange2.bind(this,"POST")} />} label="POST" />
        <Zoom in={this.state.optionValue==="POST"} 
          timeout={transitionDuration}
          style={{
            transitionDelay: this.state.optionValue==="POST" ? transitionDuration.exit : 0,
          }} unmountOnExit >
          <FormControl className={classes.formControl}>
            <Select
                value={this.state.bodytype}
                onChange={this.handleSelectChange.bind(this)}
                className={classes.select}
                inputProps={{
                  name: 'bodytype',
                  id: 'bodytype',
                  className: classes.input
                }}
              >
                {menu.map((n)=>{
                  return <MenuItem key={n.id} value={n.val} className={classes.itemmenu} >
                          {n.name}
                        </MenuItem>
                })}             
              </Select>
          </FormControl>
        </Zoom>
      </RadioGroup>   
      <Button
          className={classes.buttonSubmit}
          fullWidth={true}
          color={"primary"}
          disabled={this.props.loading}
          variant={"raised"} 
          size={"medium"}
          onClick={this.handleSubmit.bind(this)}>提交报文</Button>
      {this.props.loading && <CircularProgress size={38} className={classes.buttonProgress} />}
    </div>
    );
  }
}

SelectUrl.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles,{ withTheme: true })(SelectUrl);