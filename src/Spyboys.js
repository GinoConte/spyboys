import React, { Component } from 'react';
import axios from 'axios';
import style from './style';
import CardGrid from './CardGrid';
import ClueBoy from './ClueBoy';
import Header from './Header';

//material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';

class Spyboys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isFetchingCards: true,
      isGeneratingSpyBoard: true,
      startingTeam: 'red',
      roomId: '',
    };

    this.fetchCardsFromServer = this.fetchCardsFromServer.bind(this);
    this.generateSpyBoard = this.generateSpyBoard.bind(this);
    this.handleCreateRoomClicked = this.handleCreateRoomClicked.bind(this);
  }
  fetchCardsFromServer() {
    //this.setState({isFetchingCards: true});
    axios.get(this.props.url)
      .then(res => {
        let testcard = res.data[0];
        let testarray = [];
        for (var i = 0; i < 25; i++) {
          var testcopy = Object.assign({}, testcard);
          testcopy.gridorder = i;
          testarray.push(testcopy);
        }
        this.setState({ cards: testarray, isFetchingCards: false },
          function() {
            this.generateSpyBoard();
          });
      })
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
        this.setState({roomId : res.roomid});
      })
  }
  componentDidMount() {
    this.fetchCardsFromServer();
  }
  render() {
    if (this.state.isFetchingCards) {
      return(
        <MuiThemeProvider>
          <LinearProgress mode="indeterminate" />
        </MuiThemeProvider>
      );
    } else {
      return (
        <div style={style.spyboys}>
          <Header onCreateRoomClicked={this.handleCreateRoomClicked}/>
          <center><div style={style.clueboyholder}>
            <ClueBoy team={'blue'}/>
            <ClueBoy team={'red'}/>
          </div></center>
          <center>
          <CardGrid
            cards={this.state.cards}/>
        </center>
        </div>
      );
    }
  }
}

export default Spyboys;
