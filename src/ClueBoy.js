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


import imgf from './assets/unknown.jpg';


class ClueBoy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClue: '',
      isTurn: false,
      historyOpen: false,
      //anchorTo: '',
    };

    //this.handleVoteClick = this.handleVoteClick.bind(this);
    this.handleHistoryOpen = this.handleHistoryOpen.bind(this);
    this.handleHistoryClose = this.handleHistoryClose.bind(this);
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

    //determine turn from props
    if (this.props.teamTurn === this.props.team) {
      this.props.team === 'red' ? iconStyles.color = '#f00' : iconStyles.color = '#00f';
    } else {
      iconStyles.color = '#777';
    }

    var leftSide = (
        <FontIcon className="material-icons" style={iconStyles}>stars</FontIcon>
    );

    var historyMenuText = {
      color: '#444',
    }
    var clueboyState = (
      <div>
        <FlatButton label="9 LEFT" disabled={true}/><br></br>
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
            <CardTitle title={'\"JABRONI\"'} subtitle={this.props.team + ' clueboy'} style={style.clueboyrow}/>
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
