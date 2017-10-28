import React, { Component } from 'react';
import style from './style';
import CardVotes from './CardVotes';

// import { Card as ThatsBone, CardImg, /*CardText,*/ CardBody,
//   CardTitle, CardSubtitle, Button as ButtonRS } from 'reactstrap';
// import unknownImg from './assets/unknown.jpg';



//material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Card as WhatDoYaThink, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

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
    //e.preventDefault();
    console.log("fdgijhifosghsfh");
    this.setState({state: "revealed"})
    //reveal & reset highlights
  }
  handleHighlight(e) {
    e.preventDefault();
    //highlight card
    this.setState({highlighted: !this.state.highlighted})
  }
  render() {

    if (this.state.state === "none") {
      var cardColour = '#FFF59D';


    } else {
      var cardColour = '#ffa09b';
      if (this.props.colour === 'blue')
        cardColour = '#b5f1ff';
      if (this.props.colour === 'black')
        cardColour = '#bfbfbf';
      if (this.props.colour === 'green')
        cardColour = '#c9ffba';
    }




    var pigstyle = {backgroundColor: cardColour,
                    margin: '5px',};

    if (this.state.highlighted) {
      pigstyle.outline = "2px solid black";
    }
    var textStyle = {color: '#666'};


    return (
      <MuiThemeProvider>
        <WhatDoYaThink style={{...style.card}} zDepth={1}>
          <CardTitle title={this.props.word} subtitle={this.props.theme} style={pigstyle}/>
          <FlatButton label="Highlight" onClick={this.handleHighlight} style={textStyle}/>
          <FlatButton label="Lock In" onClick={this.handleLockIn}/>
        </WhatDoYaThink>
      </MuiThemeProvider>
    );
  }
}

export default Card;

//<CardImg top width="100%" src={unknownImg} alt="Card image cap" />

// <div style={style.card}>
//   <ThatsBone className="text-center" color="info" body inverse>
//     <CardImg top width="100%" src={unknownImg} alt="Card image cap" />
//     <CardBody>
//       <CardTitle><b>{this.props.word}</b></CardTitle>
//       <CardSubtitle><i>{this.props.theme}</i></CardSubtitle>
//       <center><CardVotes votes={this.state.votes}/></center>
//       <div style={style.cardbuttonrow}>
//         <ButtonRS style={style.cardbutton}>Suspect</ButtonRS>
//         <ButtonRS style={style.cardbutton} onClick={this.handleVoteClick}>Vote</ButtonRS>
//       </div>
//     </CardBody>
//   </ThatsBone>
// </div>
