'use strict';

import React, {
  Component,
  View
} from 'react-native';

import Messenger from 'react-native-gifted-messenger';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Api from './Api';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
  }

  componentDidMount() {
    this._getMessages();
    this._openSocket();
  }

  _getMessages() {
    Api.messages(this.props.token).list(this.props.threadID)
    .then(res => res.json())
    .then(data => this._parseMessages(data.messages))
    .then(msgs => this.setState({messages: msgs}))
    .catch(err => console.log(err));
  }

  _parseMessages(msgs) {
    console.log(msgs);
    return msgs.map(msg => {
      return {
        text: msg.body,
        name: msg.user.username,
        position: msg.user.username === this.props.navigator.props.username ? 'right' : 'left',
        date: msg.created_at
      };
    });
  }

  _openSocket() {
    Api.messages(this.props.token).socket(this.props.threadID,
      function (res) {
        console.log(res.data);
        let data = JSON.parse(res.data);
        let msgs = this._parseMessages(data.messages);
        if(msgs.length > 0) {
          this.refs.chat.appendMessages(msgs);
        }
      }.bind(this),
      (err) => console.log("err:", err));
  }

  render() {
    return (
      <View style={{flex: 1}} >
        <Messenger
          messages={this.state.messages}
          ref="chat"
        />
      </View>
    );
  }
}

module.exports = Chat;
