import React, { Component } from 'react';
import style from './style';

//material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenField: '',
      submitted: false,
    };

    this.handleCreateRoom = this.handleCreateRoom.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
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
    this.props.onTokenSubmit('59f47eeee765da3935bbf599');

  }
  render() {
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
      </form>) : (<span>Joined room: {this.props.roomid}</span>) }

      </center></div>

    );


    return (
      <MuiThemeProvider>
        <AppBar
          title={titleTextEntry}
          iconElementRight={<FlatButton label="Create Room" onClick={this.handleCreateRoom}/>}
          style={style.navbar}
          >
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

export default Header;
