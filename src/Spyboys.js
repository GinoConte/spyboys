//component that holds all the game components

import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import CardGrid from './CardGrid';
import ClueBoy from './ClueBoy';
import Header from './Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import { Route, Switch } from 'react-router-dom';

//material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';


//import img
import woodImg from './assets/wood.jpg';

class Spyboys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isFetchingCards: true,
      isGeneratingSpyBoard: true,
      startingTeam: 'red',
      roomid: '',
      teamTurn: '',
      redboy: {},
      blueboy: {},
      selectedTeam: '',
      isClueboy: false,
      gameover: false,
      winner: '',
    };

    this.fetchCardsFromServer = this.fetchCardsFromServer.bind(this);
    this.generateSpyBoard = this.generateSpyBoard.bind(this);
    this.handleCreateRoomClicked = this.handleCreateRoomClicked.bind(this);
    this.handleTokenSubmit = this.handleTokenSubmit.bind(this);
    this.advanceBoard = this.advanceBoard.bind(this);
    this.fetchWhosTurn = this.fetchWhosTurn.bind(this);
    this.fetchClueboysFromServer = this.fetchClueboysFromServer.bind(this);
    this.handlePickedATeam = this.handlePickedATeam.bind(this);
    this.handleClueSubmit = this.handleClueSubmit.bind(this);
    this.handleSkipClicked = this.handleSkipClicked.bind(this);
  }
  fetchCardsFromServer() {
    console.log("fetching for " + this.state.roomid);
    if (this.state.roomid) {
      //console.log("hi room id " + this.state.roomid);
      this.setState({isFetchingCards: true });
      axios.get('http://localhost:3001/api/room/' + this.state.roomid + '/fetchcards')
        .then(res => {
          this.setState({ cards: res.data, isFetchingCards: true },
            function() {
              //console.log(this.state.cards);
              this.setState({isFetchingCards : false});
              //this.generateSpyBoard();
            });
        })
    } else {
      this.setState({isFetchingCards: false });
    }
  }
  fetchWhosTurn() {
    //console.log("CARDS", this.state.cards);
    if (this.state.roomid) {
      axios.get('http://localhost:3001/api/room/' + this.state.roomid)
        .then(res => {
          this.setState({teamTurn: res.data.teamTurn});
        })
    } else {
      this.setState({isFetchingCards: false });
    }
  }
  fetchClueboysFromServer() {
    //this.setState({isFetchingCards: true });
    if (this.state.roomid) {
      axios.get('http://localhost:3001/api/room/' + this.state.roomid + '/fetchclueboys')
        .then(res => {
          this.setState({clueboys: res.data},
            function() {
              let redboy = this.state.clueboys[0];
              let blueboy = this.state.clueboys[1];
              if (this.state.clueboys[0].team === 'blue') {
                redboy = this.state.clueboys[1];
                blueboy = this.state.clueboys[0];
              }
              this.setState({redboy:redboy, blueboy:blueboy, isFetchingCards:false});
            });
        })
    } else {
      this.setState({isFetchingCards: false });
    }
  }
  advanceBoard(cardid, roomid, cardcolour) {

    let body = {};
    let hitIncorrectColour = false;
    
    if (cardid && cardcolour) {
      //(1)update card and change state to revealed
      body = {
        state : 'revealed',
      }
      axios.put('http://localhost:3001/api/cards/'+ cardid, body)
        .catch(err => {
          console.log(err);
      });

      //(2)check if revealed card is an assassin
      if (cardcolour === 'black') {
        hitIncorrectColour = true;
        this.setState({gameover: true});
        //game over, change state to true and render small gameover alert
      } else { //(3)handle other card types, decrement score counter
        if (cardcolour === 'blue') {
          if (this.state.selectedTeam === 'red') {
            hitIncorrectColour = true;
          }
          body = {
            decrease: true,
          }
          let blueboyid = this.state.blueboy._id;
          axios.put('http://localhost:3001/api/clueboys/'+ blueboyid, body)
          .then(res => {
            this.fetchClueboysFromServer();
          })
            .catch(err => {
              console.log(err);
          });
        } else if (cardcolour === 'red') {
          if (this.state.selectedTeam === 'blue') {
            hitIncorrectColour = true;
          };
          body = {
            decrease: true,
          }
          let redboyid = this.state.redboy._id;
          axios.put('http://localhost:3001/api/clueboys/'+ redboyid, body)
          .then(res => {
            this.fetchClueboysFromServer();
          })
            .catch(err => {
              console.log(err);
          });
        } else if (cardcolour === 'green') {
          hitIncorrectColour = true;
        }
      }
    }


    //(4)add current clue to list of past clues (low prio)

    //(5)reset cluesubmitted flag on enemy currentTurn's (before advancing) clueboy
    let clueboyid = this.state.blueboy._id;
    if (this.state.teamTurn === 'blue') {
      clueboyid = this.state.redboy._id;
    }
    body = {
      clueSubmitted: 'false',
    }
    axios.put('http://localhost:3001/api/clueboys/'+ clueboyid, body)
    .then(res => {
      this.fetchClueboysFromServer();
    })
      .catch(err => {
        console.log(err);
    });



    //(6) change the current turn -----------
    //if guessesremaining == 0 or hit incorrect colour or skipped
    let guesses = this.state.redboy.guessesRemaining;
    if (this.state.selectedTeam === 'blue') {
      guesses = this.state.blueboy.guessesRemaining;
    }
    if (hitIncorrectColour || guesses == 0) {
      //advance turn
      let nextTeamTurn = 'blue';
      if (this.state.teamTurn === 'blue') {
        nextTeamTurn = 'red';
      }
      this.setState({teamTurn: nextTeamTurn});
  
      body = {
        teamTurn: nextTeamTurn,
      }
      axios.put('http://localhost:3001/api/room/'+ roomid, body)
        .catch(err => {
          console.log(err);
      });
      //also reset guesses remaining
      body = {
        guessesRemaining: 0,
      }
      axios.put('http://localhost:3001/api/clueboys/'+ clueboyid, body)
      .then(res => {
        this.fetchClueboysFromServer();
      })
        .catch(err => {
          console.log(err);
      });
    }



  }
  generateSpyBoard() {
    //moved to server
  }
  handleCreateRoomClicked() {
    axios.post('http://localhost:3001/api/room')
      .then(res => {
        // this.setState({roomid:res.roomid, isFetchingCards: true},
        //       function() {
        //         this.fetchCardsFromServer();
        //       });
        console.log(res.data.roomid);
        this.handleTokenSubmit(res.data.roomid);
      })
  }
  handleTokenSubmit(token) {
    //this.setState({roomid:token});
    console.log("Fetching your submitted token: " + token);
    this.setState({roomid:token},
          function() {
            this.fetchCardsFromServer();
            this.fetchWhosTurn();
            this.fetchClueboysFromServer();
          });

    console.log(token);
  }
  handlePickedATeam(teamstring) {
    var team = "red";
    if (teamstring.includes("blue")) {
      team = "blue";
    }
    var pickedclueboy = false;
    if (teamstring.includes("clue")) {
      pickedclueboy = true;
    }
    this.setState({selectedTeam: team, isClueboy: pickedclueboy});
  }
  handleClueSubmit(clueboyid, clue, guesses) {
    let guessesRemaining = parseInt(guesses) + 1;
    let body = {
      currentClue : clue,
      guessesRemaining : guessesRemaining,
      clueSubmitted: true,
    }
    axios.put('http://localhost:3001/api/clueboys/'+ clueboyid, body)
      .then(res => {
        this.fetchClueboysFromServer();
      })
        .catch(err => {
          console.log(err);
    });
  }
  handleSkipClicked() {
    this.setState({skipclicked:true},
      function() {
        this.advanceBoard(null, this.state.roomid, null);
      });
  }
  handleGameoverClose() {
    this.setState({gameover: false})
  }
  componentDidMount() {
    this.fetchCardsFromServer();

    // setInterval(this.fetchCardsFromServer, 2000);
    // setInterval(this.fetchClueboysFromServer, 2000);
    // setInterval(this.fetchWhosTurn, 2000);
    
  }
  render() {

    var woodTexture = {
      background: "url(" + woodImg + ")",
      backgroundSize: "cover",
    };

    //console.log("params", this.props.match.params);

    // const SpyboysToken = (props) => (
    //   <div style={woodTexture}>
    //     <Header
    //       onCreateRoomClicked={this.handleCreateRoomClicked}
    //       onTokenSubmit={this.handleTokenSubmit}
    //       cards={this.state.cards}
    //       loadFromURL={true}
    //       roomid={props.match.params.token}
    //       />
    //     {(this.state.roomid) ?
    //       (<center><div style={style.clueboyholder}>
    //         <ClueBoy
    //           team={'blue'}
    //           teamTurn={this.state.teamTurn}
    //           currentClue={this.state.blueboy.currentClue}
    //           pastClues={this.state.blueboy.pastclues}
    //         />
    //         <ClueBoy
    //           team={'red'}
    //           teamTurn={this.state.teamTurn}
    //           currentClue={this.state.redboy.currentClue}
    //           pastClues={this.state.redboy.pastclues}
    //         />

    //       </div>
    //       <CardGrid
    //         cards={this.state.cards} advanceBoard={this.advanceBoard}/>
    //     </center>)
    //     : null }
    //   </div>
    // );

    if (this.state.isFetchingCards) {
      return(
        <MuiThemeProvider>
          <LinearProgress mode="indeterminate" />
        </MuiThemeProvider>
      );
    } else {
      return (
        <div style={woodTexture}>
          <Header
            onCreateRoomClicked={this.handleCreateRoomClicked}
            onTokenSubmit={this.handleTokenSubmit}
            onSelectTeam={this.handlePickedATeam}
            onSkipClicked={this.handleSkipClicked}
            roomid={this.state.roomid}
            loadFromURL={false}
            cards={this.state.cards}
            selectedTeam={this.state.selectedTeam}
            isClueboy={this.state.isClueboy}
            teamTurn={this.state.teamTurn}
            redboyGuesses={this.state.redboy.guessesRemaining}
            blueboyGuesses={this.state.blueboy.guessesRemaining}
            redboyClueSubmitted={this.state.redboy.clueSubmitted}
            blueboyClueSubmitted={this.state.blueboy.clueSubmitted}
            />
          {(this.state.roomid) ?
            (<center><div style={style.clueboyholder}>
              <ClueBoy
                team={'blue'}
                teamTurn={this.state.teamTurn}
                id={this.state.blueboy._id}
                cardsRemaining={this.state.blueboy.cardsRemaining}
                guessesRemaining={this.state.blueboy.guessesRemaining}
                currentClue={this.state.blueboy.currentClue}
                pastClues={this.state.blueboy.pastclues}
                selectedTeam={this.state.selectedTeam}
                isClueboy={this.state.isClueboy}
                onClueSubmit={this.handleClueSubmit}
                clueSubmitted={this.state.blueboy.clueSubmitted}
              />
              <ClueBoy
                team={'red'}
                teamTurn={this.state.teamTurn}
                id={this.state.redboy._id}
                cardsRemaining={this.state.redboy.cardsRemaining}
                guessesRemaining={this.state.redboy.guessesRemaining}
                currentClue={this.state.redboy.currentClue}
                pastClues={this.state.redboy.pastclues}
                selectedTeam={this.state.selectedTeam}
                isClueboy={this.state.isClueboy}
                onClueSubmit={this.handleClueSubmit}
                clueSubmitted={this.state.redboy.clueSubmitted}
              />

            </div>
            <CardGrid
              cards={this.state.cards}
              advanceBoard={this.advanceBoard}
              selectedTeam={this.state.selectedTeam}
              isClueboy={this.state.isClueboy}
              teamTurn={this.state.teamTurn}
              />
              <MuiThemeProvider>
              <Snackbar
                open={this.state.gameover}
                message="Gameover!"
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
              />
              </MuiThemeProvider>

          </center>)
          : null }
        </div>
      );
    }
  }
}

export default Spyboys;

//          <Route exact path='/play' component={SpyboysNoToken}/>
