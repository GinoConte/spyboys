import React, { Component } from 'react';
import style from './style';
import ReactStars from 'react-stars'

//voting symbol
import starImg from './assets/circle.png';


class CardVotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: 0,
    };

    //this.fetchVotes = this.fetchVotes.bind(this);
  }

  render() {
    return (
      <div style={style.votes}>
        <ReactStars
          count={5}
          value={this.props.votes}
          size={28}
          char={'★'}
          half={false}
          edit={false}
          color2={'#74f442'}
          className={style.rating}
        />
      </div>
    );
  }
}

export default CardVotes;
