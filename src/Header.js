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
    };

    this.handleCreateRoom = this.handleCreateRoom.bind(this);
  }
  handleCreateRoom(e) {
    this.props.onCreateRoomClicked();
  }
  handleTokenChange(e) {
    this.setState({tokenfield: e.target.value});
  }
  render() {
    var navBarButtons = (
      <div>
        <FlatButton label="Submit"/>
        <FlatButton label="Login"/>
      </div>
    );
    var titleTextEntry = (
      <div style={style.tokenfield}><center>
      <TextField
        hintText="Enter a room token"
        hintStyle={style.tokenhintstyle}
        underlineFocusStyle={style.tokenfieldunderline}
        inputStyle={style.tokenhintstyle}
      />
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
