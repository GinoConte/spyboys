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
    };

    this.fetchCardsFromServer = this.fetchCardsFromServer.bind(this);
    this.generateSpyBoard = this.generateSpyBoard.bind(this);
    this.handleCreateRoomClicked = this.handleCreateRoomClicked.bind(this);
    this.handleTokenSubmit = this.handleTokenSubmit.bind(this);
    this.advanceBoard = this.advanceBoard.bind(this);
    this.fetchWhosTurn = this.fetchWhosTurn.bind(this);
    this.fetchClueboysFromServer = this.fetchClueboysFromServer.bind(this);
    this.handlePickedATeam = this.handlePickedATeam.bind(this);
  }
  fetchCardsFromServer() {
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
    this.setState({isFetchingCards: true });
    if (this.state.roomid) {
      axios.get('http://localhost:3001/api/room/' + this.state.roomid + '/fetchclueboys')
        .then(res => {
          this.setState({clueboys: res.data, isFetchingCards: true},
            function() {
              let redboy = this.state.clueboys[0];
              let blueboy = this.state.clueboys[1];
              if (this.state.clueboys[0].team === 'blue') {
                redboy = this.state.clueboys[1];
                blueboy = this.state.clueboys[0];
              }

              //console.log("REDBOY", redboy);
              this.setState({isFetchingCards: false});
            });
        })
    } else {
      this.setState({isFetchingCards: false });
    }
  }
  advanceBoard(cardid, roomid, cardcolour) {
    //(1)update card and change state to revealed
    let body = {
      state : 'revealed',
    }
    //(2)check if revealed card is an assassin
    //(3)handle other card types, decrement score counter
    //(4)add current clue to list of past clues

    axios.put('http://localhost:3001/api/cards/'+ cardid, body)
      .catch(err => {
        console.log(err);
    });

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


  }
  generateSpyBoard() {
    if (this.state.cards) {
      let redLeft = 9;//subject to rules
      let blueLeft = 9;
      let blackLeft = 1;
      let greenLeft = 25 - redLeft - blueLeft - blackLeft;

      //pick a starting team
      let coinFlip = Math.floor(Math.random() * 2) + 1;
      if (coinFlip == 1) {
        this.setState({startingTeam: 'red'});
      } else {
        this.setState({startingTeam: 'blue'});
      }

      let cards = this.state.cards;
      //loop and pick card types
      for (let i = 0; i < 25; i++) {
        let card = cards[i];
        //console.log("Card BEFORE", cards[i]);

        let possibleCardTypes = [];
        blackLeft > 0 ? possibleCardTypes.push("black") : null;
        for (let j = 0; j < redLeft; j++) {
          possibleCardTypes.push("red")
        } //add for better randomness, probability reflects how many there are left
        for (let j = 0; j < greenLeft; j++) {
          possibleCardTypes.push("green")
        }
        for (let j = 0; j < blueLeft; j++) {
          possibleCardTypes.push("blue")
        }
        var selectedCardType = possibleCardTypes[Math.floor(Math.random()*possibleCardTypes.length)];
        //console.log("Selected: ", selectedCardType);

        //reduce count of selected type
        if (selectedCardType === 'red')
          redLeft--;
        if (selectedCardType === 'black')
          blackLeft--;
        if (selectedCardType === 'blue')
          blueLeft--;
        if (selectedCardType === 'green')
          greenLeft--;

        cards[i].type = selectedCardType;
        //console.log("Card AFTER", cards[i]);


      }
      this.setState({cards: cards})
      //console.log("STATE", this.state.cards)

      //this.generateSpyBoard();

    }
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
    console.log("Handling " + token);
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
  componentDidMount() {
    this.fetchCardsFromServer();
    //setInterval(this.fetchCardsFromServer(), 1000);
  }
  // render() {
  //
  //   var woodTexture = {
  //     background: "url(" + woodImg + ")",
  //     backgroundSize: "cover",
  //   };
  //
  //   if (this.state.isFetchingCards) {
  //     return(
  //       <MuiThemeProvider>
  //         <LinearProgress mode="indeterminate" />
  //       </MuiThemeProvider>
  //     );
  //   } else {
  //     return (
  //       <div style={woodTexture}>
  //         <Header
  //           onCreateRoomClicked={this.handleCreateRoomClicked}
  //           onTokenSubmit={this.handleTokenSubmit}
  //           roomid={this.state.roomid}
  //           />
  //         {(this.state.roomid) ?
  //           (<center><div style={style.clueboyholder}>
  //             <ClueBoy
  //               team={'blue'}
  //               teamTurn={this.state.teamTurn}
  //               currentClue={this.state.blueboy.currentClue}
  //               pastClues={this.state.blueboy.pastclues}
  //             />
  //             <ClueBoy
  //               team={'red'}
  //               teamTurn={this.state.teamTurn}
  //               currentClue={this.state.redboy.currentClue}
  //               pastClues={this.state.redboy.pastclues}
  //             />
  //
  //           </div>
  //           <CardGrid
  //             cards={this.state.cards} advanceBoard={this.advanceBoard}/>
  //         </center>)
  //         : null }
  //       </div>
  //     );
  //   }
  // }
  render() {

    var woodTexture = {
      background: "url(" + woodImg + ")",
      backgroundSize: "cover",
    };

    //console.log("params", this.props.match.params);

    const SpyboysToken = (props) => (
      <div style={woodTexture}>
        <Header
          onCreateRoomClicked={this.handleCreateRoomClicked}
          onTokenSubmit={this.handleTokenSubmit}
          cards={this.state.cards}
          loadFromURL={true}
          roomid={props.match.params.token}
          />
        {(this.state.roomid) ?
          (<center><div style={style.clueboyholder}>
            <ClueBoy
              team={'blue'}
              teamTurn={this.state.teamTurn}
              currentClue={this.state.blueboy.currentClue}
              pastClues={this.state.blueboy.pastclues}
            />
            <ClueBoy
              team={'red'}
              teamTurn={this.state.teamTurn}
              currentClue={this.state.redboy.currentClue}
              pastClues={this.state.redboy.pastclues}
            />

          </div>
          <CardGrid
            cards={this.state.cards} advanceBoard={this.advanceBoard}/>
        </center>)
        : null }
      </div>
    );


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
            roomid={this.state.roomid}
            loadFromURL={false}
            cards={this.state.cards}
            selectedTeam={this.state.selectedTeam}
            />
          {(this.state.roomid) ?
            (<center><div style={style.clueboyholder}>
              <ClueBoy
                team={'blue'}
                teamTurn={this.state.teamTurn}
                currentClue={this.state.blueboy.currentClue}
                pastClues={this.state.blueboy.pastclues}
              />
              <ClueBoy
                team={'red'}
                teamTurn={this.state.teamTurn}
                currentClue={this.state.redboy.currentClue}
                pastClues={this.state.redboy.pastclues}
              />

            </div>
            <CardGrid
              cards={this.state.cards} advanceBoard={this.advanceBoard}/>
          </center>)
          : null }
        </div>
      );
    }
  }
}

export default Spyboys;

//          <Route exact path='/play' component={SpyboysNoToken}/>
