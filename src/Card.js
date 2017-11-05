import React, { Component } from 'react';
import style from './style';
//import CardVotes from './CardVotes';

// import { Card as ThatsBone, CardImg, /*CardText,*/ CardBody,
//   CardTitle, CardSubtitle, Button as ButtonRS } from 'reactstrap';
// import unknownImg from './assets/unknown.jpg';

//material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Card as WhatDoYaThink, /*CardActions, CardHeader, CardMedia,*/ CardTitle, /*CardText*/} from 'material-ui/Card';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: 0,
      state: this.props.state, //states: None, Suspected, SpyViewRed, SpyViewBlue, SpyViewGreen, SpyViewBlack
      highlighted: false,
    };

    this.handleVoteClick = this.handleVoteClick.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleLockIn = this.handleLockIn.bind(this);

  }
  handleVoteClick(e) {
    e.preventDefault();
    let currentPlayers = 5; //per team
    let currentVotes = this.state.votes;
    if (currentVotes + 1 > 5) {
      //reset or do nothin
    } else {
      currentVotes++;
      this.setState({votes: currentVotes});
      if (currentVotes > (currentPlayers / 2)) {
        //got a majority i.e trigger 'lock in' function
      }
    }
  }
  handleLockIn() {
    //reveal & reset highlights
    this.setState({state: "revealed"})

    //advance the turn
    this.props.advanceBoard(this.props.id, this.props.parentRoom, this.props.colour);

  }
  handleHighlight(e) {
    e.preventDefault();
    //highlight card
    this.setState({highlighted: !this.state.highlighted})
  }
  render() {

    var cardColour;
    //assign colour based on state
    if (this.props.state === "none" && !this.props.isClueboy) {
      cardColour = '#FFF59D';
    } else {
      cardColour = '#ffa09b';
      if (this.props.colour === 'blue')
        cardColour = '#b5f1ff';
      if (this.props.colour === 'black')
        cardColour = '#bfbfbf';
      if (this.props.colour === 'green')
        cardColour = '#c9ffba';
    }
    var pigstyle = {backgroundColor: cardColour,
                    margin: '5px',};

    //assign styling based on whether or not card is highlighted
    var depth = 1;
    if (this.state.highlighted && !(this.state.state === 'revealed')) {
      depth = 4;
      pigstyle.background = "repeating-linear-gradient(45deg,#FFF59D,#FFF59D 10px,#fffad3 10px,#fffad3 20px)";
    } else {
      pigstyle.background = cardColour;
    }

    //assign styling based on whether or not player is a clueboy
    if (this.props.isClueboy && this.state.state === 'revealed') {
      pigstyle.background = "repeating-linear-gradient(45deg,#FFF59D,#FFF59D 10px,#fffad3 10px,#fffad3 20px)";
    } else {
      pigstyle.background = cardColour;
    }

    //disable lock in button based on revealed
    if (this.state.state === "revealed") {
      var isRevealed = true;
    }

    return (
      <MuiThemeProvider>
        <WhatDoYaThink style={{...style.card}} zDepth={depth}>
          <CardTitle title={isRevealed ? ( <span> &nbsp;</span>) : this.props.word} subtitle={isRevealed ? (<span> &nbsp;</span>) : this.props.theme} style={pigstyle}/>
          <FlatButton label="Highlight" onClick={this.handleHighlight} disabled={(isRevealed || this.props.isClueboy)}/>
          <FlatButton label="Lock In" onClick={this.handleLockIn} primary={true} disabled={(isRevealed || this.props.isClueboy || !(this.props.teamTurn === this.props.selectedTeam))}/>
        </WhatDoYaThink>
      </MuiThemeProvider>
    );
  }
}

export default Card;
