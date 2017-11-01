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


import imgf from './assets/unknown.jpg';


class ClueBoy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClue: '',
      isTurn: false,
      historyOpen: false,
      clueinput: '',
      clueSubmitted: this.props.clueSubmitted,
      //anchorTo: '',
    };

    //this.handleVoteClick = this.handleVoteClick.bind(this);
    this.handleHistoryOpen = this.handleHistoryOpen.bind(this);
    this.handleHistoryClose = this.handleHistoryClose.bind(this);
    this.handleClueChange = this.handleClueChange.bind(this);
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
    this.setState({
      clueinput: e.target.value,
    })
  }
  handleClueSubmit(e) {
    e.preventDefault();
    //console.log("submitting clue", this.props.id);
    this.setState({submittedclue: true, clueinput: ''});
    this.props.onClueSubmit(this.props.id, this.state.clueinput);
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
      fontSize: 40,
    };

    //console.log("clue submitted for " + this.props.team, this.props.clueSubmitted);
    //determine turn from props
    if (this.props.teamTurn === this.props.team) {
      this.props.team === 'red' ? iconStyles.color = '#F44336' : iconStyles.color = '#03A9F4';
    } else {
      iconStyles.color = '#777';
    }

    var leftSide = (
        <FontIcon className="material-icons" style={iconStyles}>stars</FontIcon>
    );

    var centerText = '"' + this.props.currentClue + '"';
    var centerComponent = (
      <div style={style.clueboytext}>{centerText}</div>
    );
    if (this.props.isClueboy && this.props.selectedTeam === this.props.team && !this.props.clueSubmitted) {
    //if (!this.props.clueSubmitted) {
      centerComponent = (
        <form onSubmit={this.handleClueSubmit}>
        <TextField
          hintText="enter clue"
          hintStyle={style.cluetexthint}
          underlineFocusStyle={style.cluetextunderline}
          inputStyle={style.cluetexthint}
          onChange={this.handleClueChange}
          value={this.state.clueinput}
          style={style.clueboytextentry}
          maxLength={25}
        />
        </form>
      )
    }

    var historyMenuText = {
      color: '#444',
    }
    var cardsRemainingText = {};
    this.props.team === 'red' ? cardsRemainingText.color = '#F44336' : cardsRemainingText.color = '#03A9F4';
    var clueboyState = (
      <div>
        <FlatButton label={this.props.cardsRemaining + ' left'} disabled={true} style={cardsRemainingText}/><br></br>
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

    return (
      <MuiThemeProvider>

        <WhatDoYaThink style={{...style.clueboy}} zDepth={3}>

            {(this.props.team === 'red') ? (leftSide) : (rightSide)}
            <CardTitle title={centerComponent} subtitle={this.props.team === 'blue' ? 'blue\'s clues boy\'s clue' : 'red clueboy\'s clue, boy'} style={style.clueboyrow}/>
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
