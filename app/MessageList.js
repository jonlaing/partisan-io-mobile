'use strict';

import React, {
  Component,
  StyleSheet,
  RefreshControl,
  ListView,
  View
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';

import Api from './Api';

import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';
import MessageThread from './MessageThread';
import ActionButton from './ActionButton';
import FriendPicker from './FriendPicker';

class MessageList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.last_message !== r2.last_message });
    this.state = {
      items: [],
      dataSource: ds.cloneWithRows([]),
      isRefreshing: false,
      showFriends: false
    };
  }

  componentDidMount() {
    this._getThreads();
    this.threadListener = this.props.navigator.props.eventEmitter.addListener('message_finish', this._getThreads.bind(this));
  }

  componentWillUnmount() {
    try {
      this.threadListener.remove();
    } catch(e) {
      console.log(e);
    }
  }

  _getThreads() {
    Api.messages(this.props.token).threads()
    .then(data => this.setState({items: data.threads, dataSource: this.state.dataSource.cloneWithRows(data.threads), isRefreshing: false}))
    .then(() => console.log(this.state.items))
    .catch(err => console.log(err));
  }

  _handleHamburger() {
    this.refs.sidemenu.openMenu(true);
  }

  _handleCreate() {
    this.setState({showFriends: true});
  }

  _handleFriendSelect(friend) {
    Api.messages(this.props.token).createThread(friend.id)
    .then(data => console.log(data))
    .then(() => this.setState({showFriends: false}))
    .then(() => this._getThreads())
    .catch(err => console.log(err));
  }

  _renderRow(thread) {
    console.log(thread);
    let user = this.props.navigator.props.user.id === thread.users[0].user_id ? thread.users[1].user : thread.users[0].user;
    return <MessageThread key={thread.id} thread={thread} user={user} token={this.props.token} navigator={this.props.navigator} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          scrollToTop={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.setState({isRefreshing: true});
                this._getThreads();
              }}
              tintColor="rgb(191,191,191)"
              title="Loading..."
            />
          }
        />
        <NavBar
          title="Conversations"
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={() => this.props.navigator.pop()}
        />
        <ActionButton icon="add" onPress={this._handleCreate.bind(this)} />
        <FriendPicker token={this.props.token} show={this.state.showFriends} onClose={() => this.setState({showFriends: false})} onSelect={this._handleFriendSelect.bind(this)} />
      </View>
    );
  }
}

MessageList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: Layout.lines(4),
    backgroundColor: Colors.lightGrey
  }
});

module.exports = MessageList;
