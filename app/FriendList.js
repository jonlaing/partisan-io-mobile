'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  RefreshControl,
  View,
  Text
} from 'react-native';

import SideMenuNav from 'react-native-side-menu';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import SideMenu from './SideMenu';
import NavBarMain from './NavBarMain';
import FriendRow from './FriendRow';
import NoFriends from './NoFriends';

class FriendList extends Component {
  constructor(props) {
    super(props);

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

  _handleHamburger() {
    this.refs.sidemenu.openMenu(true);
  }

  _renderRow(friendship) {
    return (
      <FriendRow
        key={friendship.user.username}
        navigator={this.props.navigator}
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
      <SideMenuNav ref="sidemenu" menu={<SideMenu navigator={this.props.navigator} token={this.props.token} />}>
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
        <NavBarMain
          token={this.props.token}
          navigator={this.props.navigator}
          onLogoPress={this._handleHamburger.bind(this)}
          currentTab="friends"
        />
      </SideMenuNav>
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
    paddingTop: Layout.lines(7),
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
