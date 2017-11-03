import React, { Component } from 'react';
import style from './style';

//material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenField: '',
      submitted: !(this.props.roomid === ''),
      selectTeamOpen: false,
      selectedTeam: '',
    };

    this.handleCreateRoom = this.handleCreateRoom.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleSelectTeamOpen = this.handleSelectTeamOpen.bind(this);
    this.handleSelectTeamClose = this.handleSelectTeamClose.bind(this);
    this.handleTeamSelect = this.handleTeamSelect.bind(this);
    this.handleSkipClicked = this.handleSkipClicked.bind(this);
  }
  handleCreateRoom(e) {
    this.props.onCreateRoomClicked();
  }
  handleTokenChange(e) {
    this.setState({tokenfield: e.target.value});
    //console.log(this.state.tokenfield);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({tokenfield: '', submitted: true});
    //this.props.onTokenSubmit(this.state.tokenfield);
    this.props.onTokenSubmit('59fbf3cf3daaf2ba5db7d8b2');

  }
  handleSelectTeamOpen(e) {
    e.preventDefault();
    this.setState({
      selectTeamOpen: true,
      anchorEl: e.currentTarget,
    });
  }
  handleSelectTeamClose(e) {
    this.setState({
      selectTeamOpen: false,
    })
  }
  handleTeamSelect(e, value) {
    this.props.onSelectTeam(value);
    this.setState({selectedTeam: value},
      function() {
        this.handleSelectTeamClose();
      });

  }
  handleSkipClicked(e) {
    e.preventDefault();
    this.props.onSkipClicked();
  }
  componentDidMount() {
    // console.log('header cards', this.props.cards);
    // console.log('params', this.props.params);
    // if (this.props.loadFromURL) {
    //   if (this.props.cards.length == 0) {
    //     console.log("Submitting: " + this.props.roomid);
    //     this.props.onTokenSubmit(this.props.roomid);
    //   }
    // }
  }
  render() {
    var currentClueboySubmitted = "Guessboys" + " (" + 
    (this.props.teamTurn === 'red' ? this.props.redboyGuesses : this.props.blueboyGuesses)
    + " guesses remaining)";
    if (this.props.teamTurn === 'blue') {
      if (!this.props.blueboyClueSubmitted) {
        currentClueboySubmitted = "Clueboy";
      }
    } else {
      if (!this.props.redboyClueSubmitted) {
        currentClueboySubmitted = "Clueboy";
      }
    }
    var currentTurnText = "Waiting on: " + this.props.teamTurn + " team " + currentClueboySubmitted;
    var showSkipButton = false;
    if (this.props.teamTurn === this.props.selectedTeam) {
      showSkipButton = true;
    }
    var gameinterface = (
      <div style={style.gameinterface}>
        <span>{this.props.roomid}</span>
        <FlatButton label="COPY ROOM ID" style={style.headerbuttonflat} />
        <FlatButton label={currentTurnText} style={style.headerbuttontext} disabled={true}/>
        {!this.props.isClueboy ? 
          <FlatButton 
            label="END TURN EARLY" 
            style={style.headerbuttonflatimportant} 
            onClick={this.handleSkipClicked} 
            disabled={!showSkipButton}/>: null}
      </div>
    );

    //determine title text based on whether or not a token has been submitted
    var titleTextEntry = (
      <div style={style.tokenfield}><center>
      {(!this.state.submitted) ?
      (<form onSubmit={this.handleSubmit}>
        <TextField
          hintText="enter a room id"
          hintStyle={style.tokenhintstyle}
          underlineFocusStyle={style.tokenfieldunderline}
          inputStyle={style.tokenhintstyle}
          onChange={this.handleTokenChange}
          value={this.state.tokenfield}
        />
      <FlatButton type="Submit" label="Submit" style={style.tokenhintstyle} />
      </form>) : (gameinterface) }

      </center></div>

    );

    var teamMenuText = {
      color: '#444',
    }
    var selectTeam = (
      <span>
        <FlatButton label={this.props.selectedTeam ? "Change team" : "Select a team"} onClick={this.handleSelectTeamOpen} style={style.selectteambutton}/>
        <Popover
          open={this.state.selectTeamOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleSelectTeamClose}>
          <Menu value={this.state.selectedTeam} onChange={this.handleTeamSelect}>
            <MenuItem primaryText="Blue guessboy" value="blue" style={teamMenuText} />
            <MenuItem primaryText="Blue clueboy"  value="blue clue" style={teamMenuText} />
            <MenuItem primaryText="Red guessboy"  value="red" style={teamMenuText} />
            <MenuItem primaryText="Red clueboy"  value="red clue"  style={teamMenuText} />
          </Menu>
        </Popover>
      </span>
    );

    //check and change team colour
    var teamColour = {};
    if (this.props.selectedTeam) {
      if (this.props.selectedTeam == 'red') {
        teamColour.backgroundColor = '#F44336';
        if (this.props.isClueboy) {
          teamColour.backgroundColor = '#B71C1C';
        }
      } else {
        if (this.props.isClueboy) {
          teamColour.backgroundColor = '#01579B';
        }
      }
    }

    return (
      <MuiThemeProvider>
        <AppBar
          title={titleTextEntry}
          iconElementRight={<FlatButton label="Create Room" onClick={this.handleCreateRoom}/>}
          iconElementLeft={this.props.cards.length > 0 ? selectTeam : <span></span>}
          style={{...style.navbar, ...teamColour}}
          >
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

export default Header;
