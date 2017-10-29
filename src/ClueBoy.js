import React, { Component } from 'react';
import style from './style';

//material ui components
import {Card as WhatDoYaThink, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import imgf from './assets/unknown.jpg';


class ClueBoy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClue: '',
      isTurn: false,
    };

    //this.handleVoteClick = this.handleVoteClick.bind(this);
  }
  render() {
    var teamColour = '#ff715e';
    if (this.props.team === 'blue') {
      teamColour = '#6dd5ff';
    }
    var pigstyle = {
      backgroundColor: teamColour,
    }





    const iconStyles = {
      margin: 15,
      fontSize: 40,
      //backgroundColor: '#444'
    };

    //determine turn from props
    if (this.props.teamTurn === this.props.team) {
      iconStyles.color = '#f00';
    }

    var leftSide = (
        <FontIcon className="material-icons" style={iconStyles}>stars</FontIcon>
    );


    var rightSide = (
      <CardTitle title={<div><center><FlatButton label="9 LEFT" disabled={true}/><br></br><RaisedButton label="HISTORY"/></center></div>} style={style.clueboyinfo}/>
    );

    return (
      <MuiThemeProvider>

        <WhatDoYaThink style={{...style.clueboy}}>

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
