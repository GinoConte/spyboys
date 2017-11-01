import React, { Component } from 'react';
import style from './style';
import Card from './Card';

// import {Grid, Row, Column} from 'react-cellblock';


//constructs and organises Card components using db data
class CardGrid extends Component {
  render() {
    let CardComponents = this.props.cards.map(card => {
      return (
        <Card
          id={card._id}
          parentRoom={card._parentRoom}
          word={card.word}
          theme={card.theme}
          colour={card.colour}
          key={card._id}
          isClueboy={this.props.isClueboy}
          selectedTeam={this.props.selectedTeam}
          advanceBoard={this.props.advanceBoard} 
          state={card.state}>
          {card.text}
        </Card>
      )
    })
    return (
      <div style={style.cardgrid}>
        {CardComponents}
      </div>
    );
  }
}

export default CardGrid;
