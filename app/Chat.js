'use strict';

import React, {
  Component,
  Dimensions,
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

  _getMessages(stamp = -1) {
    Api.messages(this.props.token).list(this.props.threadID, stamp)
    .then(res => res.json())
    .then(data => this._parseMessages(data.messages))
    .then(msgs => stamp === -1 ? msgs : this.state.messages.concat(msgs))
    .then(msgs => this.setState({messages: msgs}))
    .catch(err => console.log(err));
  }

  _parseMessages(msgs) {
    return msgs.map(msg => {
      return {
        uniqueId: msg.id,
        text: msg.body,
        name: `@${msg.user.username}`,
        position: msg.user.id === this.props.navigator.props.user.id ? 'right' : 'left',
        date: msg.created_at,
        image: { uri: msg.user.avatar_thumbnail_url }
      };
    });
  }

  _openSocket() {
    Api.messages(this.props.token).socket(this.props.threadID,
      function (res) {
        let data = JSON.parse(res.data);
        let msgs = data.messages;
        let stamp = data.stamp;
        if(msgs > 0) {
          this._getMessages(stamp);
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
          onCustomSend={this._handleSend.bind(this)}
          styles={{ listView: styles.container, bubbleRight: styles.bubbleRight }}
          ref="chat"
        />
        <NavBar
          title={`@${this.props.user.username}`}
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={() => { this.props.navigator.props.eventEmitter.emit('message_finish'); this.props.navigator.pop(); }}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    marginTop: Layout.lines(4)
  },
  bubbleRight: {
    marginLeft: 70,
    alignSelf: 'flex-end',
    backgroundColor: Colors.base
  }
});

module.exports = Chat;
