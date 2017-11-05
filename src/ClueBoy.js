import React, { Component } from 'react';
import style from './style';

//material ui components
import {Card as WhatDoYaThink, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';


import imgf from './assets/unknown.jpg';


class ClueBoy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClue: '',
      isTurn: false,
      historyOpen: false,
      clueinput: '',
      clueguessesinput: '',
      clueSubmitted: this.props.clueSubmitted,
      //anchorTo: '',
    };

    //this.handleVoteClick = this.handleVoteClick.bind(this);
    this.handleHistoryOpen = this.handleHistoryOpen.bind(this);
    this.handleHistoryClose = this.handleHistoryClose.bind(this);
    this.handleClueChange = this.handleClueChange.bind(this);
    this.handleClueNumberChange = this.handleClueNumberChange.bind(this);
    this.handleClueSubmit = this.handleClueSubmit.bind(this);
  }
  handleHistoryOpen(e) {
    e.preventDefault();
    this.setState({
      historyOpen: true,
      anchorEl: e.currentTarget,
    });
  }
  handleHistoryClose(e) {
    this.setState({
      historyOpen: false,
    })
  }
  handleClueChange(e) {
    let cleanInput  = e.target.value.replace(/\s+/g, '');
    console.log("clearinput", cleanInput);
    this.setState({
      clueinput: cleanInput,
    })
  }
  handleClueNumberChange(e) {
    //clean input to be numbers only
    let cleanInput  = e.target.value.replace(/[^0-9]+/, '');
    this.setState({
      clueguessesinput: cleanInput,
    })
  }
  handleClueSubmit(e) {
    //e.preventDefault();
    //console.log("submitting clue", this.state.clueinput + " with " + this.state.clueguessesinput);
    this.setState({submittedclue: true, clueinput: '', clueguessesinput: ''}); //required
    this.props.onClueSubmit(this.props.id, this.state.clueinput, this.state.clueguessesinput);
  }
  componentDidMount() {

  }
  render() {
    var teamColour = '#ff715e';
    if (this.props.team === 'blue') {
      teamColour = '#6dd5ff';
    }
    var pigstyle = {
      backgroundColor: teamColour,
    }

    //style the turn token (font icon)
    const iconStyles = {
      margin: 15,
      //marginBottom: 55,
      fontSize: 45,
    };

    //console.log("clue submitted for " + this.props.team, this.props.clueSubmitted);
    //determine turn from props
    if (this.props.teamTurn === this.props.team) {
      this.props.team === 'red' ? iconStyles.color = '#F44336' : iconStyles.color = '#03A9F4';
    } else {
      iconStyles.color = '#777';
    }

    var leftSide = (
      <div style={style.clueboytoken}>
        <FontIcon className="material-icons" style={{...iconStyles, ...style.clueboyicon}}>stars</FontIcon>
      </div>
    );

    var centerText;
    if (!this.props.currentClue) {
      centerText = 'No clue yet';
    } else {
      centerText = '"' + this.props.currentClue + '" (' + this.props.currentGuessNumber + ')';
    }
    var centerComponent = (
      <div style={style.clueboytext}>{centerText}</div>
    );
    if (this.props.isClueboy && this.props.selectedTeam === this.props.team && !this.props.clueSubmitted && this.props.team === this.props.teamTurn) {
    //if (!this.props.clueSubmitted) {
      centerComponent = (
        <div style={style.clueboyclueentry}>
          <form onSubmit={this.handleClueSubmit}>
          <TextField
            onKeyPress = { (e) => {
              if (e.key === 'Enter') {
                this.handleClueSubmit();
              }
            }}
            hintText="clue"
            hintStyle={style.cluetexthint}
            underlineFocusStyle={style.cluetextunderline}
            inputStyle={style.cluetexthint}
            onChange={this.handleClueChange}
            value={this.state.clueinput}
            style={style.clueboytextentry}
            maxLength={15}
          />
          <TextField
            onKeyPress = { (e) => {
              if (e.key === 'Enter') {
                this.handleClueSubmit();
              }
            }}
            hintText="words(#)"
            hintStyle={style.cluetexthint}
            underlineFocusStyle={style.cluetextunderline}
            inputStyle={style.cluetexthint}
            onChange={this.handleClueNumberChange}
            value={this.state.clueguessesinput}
            style={style.clueboynumberentry}
            maxLength={2}
          />
          </form>
        </div>
      )
    }

    var subtitleComponent = (
      <span>
        {this.props.team === 'blue' ? 'blue\'s clues boy\'s clue' : 'red clueboy\'s clue, boy'}
      </span>
    );
    if (this.props.isClueboy && this.props.selectedTeam === this.props.team && !this.props.clueSubmitted) {
      subtitleComponent = (
        <span>&nbsp;</span>
      );
    }

    var historyMenuText = {
      color: '#444',
    }
    var cardsRemainingText = {};
    this.props.team === 'red' ? cardsRemainingText.color = '#F44336' : cardsRemainingText.color = '#03A9F4';
    var clueboyState = (
      <div style={style.clueboystate}>
        <FlatButton label={this.props.cardsRemaining ? this.props.cardsRemaining + ' left' : 'loading...'} disabled={true} style={cardsRemainingText}/><br></br>
        <RaisedButton label="HISTORY" onClick={this.handleHistoryOpen}/>
          <Popover
            open={this.state.historyOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleHistoryClose}>
            <Menu>
              <MenuItem primaryText="CLUE #1" disabled={true} style={historyMenuText} />
              <MenuItem primaryText="CLUE #2" disabled={true} style={historyMenuText} />
            </Menu>
          </Popover>
      </div>

    );

    var rightSide = (
      <CardTitle title={clueboyState} style={style.clueboyinfo}/>
    );

    //console.log("number input", this.state.clueinput);
    return (
      <MuiThemeProvider>

        <WhatDoYaThink style={{...style.clueboy}} zDepth={3}>

            {(this.props.team === 'red') ? (leftSide) : (rightSide)}
            <CardTitle title={centerComponent} subtitle={subtitleComponent} style={style.clueboyrow}/>
            {(this.props.team === 'red') ? (rightSide) : (leftSide)}


        </WhatDoYaThink>
      </MuiThemeProvider>
    );
  }
}

export default ClueBoy;

//      <div style={{...style.clueboy, ...pigstyle}}>
//
// <CardHeader
//   title="Henry"
//   subtitle={this.props.team + " clueboy"}
//   avatar={imgf}
// />
