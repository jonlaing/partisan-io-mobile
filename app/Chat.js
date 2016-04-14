'use strict';

import React, {
  Component,
  StyleSheet,
  View
} from 'react-native';

import Messenger from 'react-native-gifted-messenger';
import Icon from 'react-native-vector-icons/FontAwesome';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';

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
    return msgs.map(msg => {
      return {
        text: msg.body,
        name: `@${msg.user.username}`,
        position: msg.user.username === this.props.navigator.props.username ? 'right' : 'left',
        date: msg.created_at,
        image: { uri: msg.user.avatar_thumbnail_url }
      };
    });
  }

  _openSocket() {
    Api.messages(this.props.token).socket(this.props.threadID,
      function (res) {
        let data = JSON.parse(res.data);
        let msgs = this._parseMessages(data.messages);
        if(msgs.length > 0) {
          this.refs.chat.appendMessages(msgs);
        }
      }.bind(this),
      (err) => console.log("err:", err));
  }

  _handleSend(msg) {
    Api.messages(this.props.token).send(this.props.threadID, msg.text)
    .then(() => this.refs.chat.onChangeText(''))
    .catch(err => console.log("err:", err));
  }

  render() {
    return (
      <View style={{flex: 1 }} >
        <Messenger
          messages={this.state.messages}
          autoScroll={true}
          forceRenderImage={true}
          onCustomSend={this._handleSend.bind(this)}
          styles={{ container: styles.container, bubbleRight: styles.bubbleRight }}
          ref="chat"
        />
        <NavBar
          title={`@${this.props.user.username}`}
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Layout.lines(4)
  },
  bubbleRight: {
    marginLeft: 70,
    alignSelf: 'flex-end',
    backgroundColor: Colors.base
  }
});

module.exports = Chat;
