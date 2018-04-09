import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControlLabel } from 'material-ui/Form';

const suggestions = [
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
    marginTop:80
  },
  item:{
    padding:5,
  },
  paper:{
    left: 0,
    right: 0,
    zIndex: 1,
    position: "absolute",
    margin: 10,
    maxHeight:300,
    overflow:"auto",

}
});

class SelectUrl extends React.Component {
  state = {
    value: '',
    suggestions: [],
  };
  renderSuggestion(suggestion, { isHighlighted }) {
    return (
      <MenuItem 
        className={this.props.classes.item}
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

  handleSubmit(){
    if(this.address.value===""){
      this.address.focus();
      this.props.handleSetStatus({msg:"请输入URL地址，或者选择URL"})
      return false;
    }
    this.props.handleQuery(this.address.value);
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

  render() {
    const { classes } = this.props;

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
        <FormControlLabel value="POST" control={<Radio checked />} label="POST" />
        <FormControlLabel value="GET" control={<Radio />} label="GET" />
      </RadioGroup>   
      <Button
          className={classes.buttonSubmit}
          fullWidth={true}
          color={"primary"}
          disabled={this.props.loading}
          variant={"raised"} 
          size={"medium"}
          onClick={this.handleSubmit.bind(this)}>提交报文</Button>
    </div>
    );
  }
}

SelectUrl.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectUrl);