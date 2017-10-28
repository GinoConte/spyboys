import React, { Component } from 'react';
import style from './style';

//material ui components
import {Card as WhatDoYaThink, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

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

    var leftSide = (
        <FontIcon className="material-icons" style={iconStyles}>stars</FontIcon>
    );


    var rightSide = (
        <FontIcon className="material-icons" style={iconStyles}>stars</FontIcon>
    );

    return (
      <MuiThemeProvider>

        <WhatDoYaThink style={{...style.clueboy}}>

            {leftSide}
            <CardTitle title={'\"JABRONI\"'} subtitle={this.props.team + ' clueboy'} style={style.clueboyrow}/>
            {rightSide}


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
