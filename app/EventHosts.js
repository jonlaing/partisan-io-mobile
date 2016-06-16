'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import SwipeOut from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Api from './Api';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

import Avatar from './Avatar';
import NavBar from './NavBar';
import FriendPicker from './FriendPicker';

export default class EventHosts extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { hosts: this.props.hosts, ds: ds.cloneWithRows(this.props.hosts), showFriends: false };
  }

  _buttons(host) {
    return [{
      text: "Remove",
      backgroundColor: 'red',
      onPress: () => this._removeHost(host)
    }];
  }

  _addHost(host) {
    let hosts = JSON.parse(JSON.stringify(this.state.hosts)); // stupid deep copy
    hosts.push(host);

    this.setState({hosts: hosts, ds: this.state.ds.cloneWithRows(hosts), showFriends: false});

    Api.events(this.props.token).addHost(this.props.eventID, host.id)
    .then(resp => console.log(resp))
    .catch(err => console.log("err:", err));
  }

  _removeHost(host) {
    let hosts = this.state.hosts.filter(h => h.id !== host.id);
    this.setState({hosts: hosts, ds: this.state.ds.cloneWithRows(hosts)});

    Api.events(this.props.token).removeHost(this.props.eventID, host.id)
    .then(resp => console.log(resp))
    .catch(err => console.log("err:", err));
  }

  _renderRow(host) {
    return (
      <SwipeOut key={host.id} backgroundColor="white" right={this._buttons(host)}>
        <View style={styles.item}>
          <Avatar url={host.avatar_thumbnail_url} style={styles.avatar} />
          <TouchableHighlight style={{flex: 1}} onPress={() => this.props.navigator.push(Router.profile(this.props.token, host.id))}>
            <Text style={{color: Colors.action}}>@{host.username}</Text>
          </TouchableHighlight>
          <View style={{flex: 1}} />
        </View>
      </SwipeOut>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          scrollToTop={true}
          dataSource={this.state.ds}
          renderRow={this._renderRow.bind(this)}
        />
        <NavBar
          title="Manage hosts"
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={32} /> }
          leftButtonPress={() => { this.props.navigator.props.eventEmitter.emit('update-event'); this.props.navigator.pop(); }}
          rightButton={ <Icon name="add" color="rgb(255,255,255)" size={32} /> }
          rightButtonPress={() => this.setState({ showFriends: true }) }
        />
        <FriendPicker token={this.props.token} show={this.state.showFriends} onClose={() => this.setState({showFriends: false})} onSelect={this._addHost.bind(this)} />
      </View>
    );
  }
}

EventHosts.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  eventID: React.PropTypes.string.isRequired,
  hosts: React.PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: Layout.lines(4)
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.lines(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey
  },
  avatar: {
    height: Layout.lines(2),
    width: Layout.lines(2),
    marginRight: Layout.lines(2),
    borderRadius: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  }
});

module.exports = EventHosts;
