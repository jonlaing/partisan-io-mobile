'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  RefreshControl,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import FriendRow from './FriendRow';
import NoFriends from './NoFriends';

class FriendList extends Component {
  constructor(props) {
    super(props);

    this.parentNav = this.props.navigator.props.parentNavigator ? this.props.navigator.props.parentNavigator : this.props.navigator;

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { friendships: [], dataSource: ds.cloneWithRows([]), page: 1, isRefreshing: false, showFilters: false };
  }

  componentDidMount() {
    this.getFriendships();
  }

  getFriendships() {
    Api.friendships(this.props.token).list()
    .then(friendships => this.setState({
      friendships: friendships,
      dataSource: this.state.dataSource.cloneWithRows(friendships),
      isRefreshing: false
    }))
    .catch(err => {this.setState({isRefreshing: false}); console.log("error:", err); });
  }

  _renderRow(friendship) {
    return (
      <FriendRow
        key={friendship.user.username}
        navigator={this.parentNav}
        token={this.props.token}
        user={friendship.user}
        username={friendship.user.username}
        birthdate={friendship.user.birthdate}
        location={friendship.user.location}
        match={friendship.match}
      />
    );
  }

  _searchFilters() {
    if(this.state.showFilters === true) {
      return (
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeader}>Search Parameters</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._searchFilters()}
        {this._noFriends()}
        <ListView
          scrollToTop={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.getFriendships(true);
                this.setState({isRefreshing: true});
              }}
              tintColor="rgb(191,191,191)"
              title="Loading..."
            />
          }
        />
      </View>
    );
  }

  _noFriends() {
    if(this.state.friendships.length < 1 && this.state.isRefreshing === false) {
      return <NoFriends token={this.props.token} navigator={this.props.navigator} />;
    }
  }
}

FriendList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: Layout.lines(0.75)
  },
  filterContainer: {
    backgroundColor: Colors.baseDark,
    padding: Layout.lines(1),
    marginHorizontal: -Layout.lines(0.75)
  },
  filterHeader: {
    color: 'white'
  }
});

module.exports = FriendList;
