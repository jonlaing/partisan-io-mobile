'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  ListView,
  RefreshControl,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import SideMenuNav from 'react-native-side-menu';
import ExNavigator from '@exponent/react-native-navigator';

import Layout from './Layout';
import Colors from './Colors';

import SideMenu from './SideMenu';

class MatchList extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { matches: [], dataSource: ds.cloneWithRows([]), page: 1, isRefreshing: true };
  }

  _handleHamburger() {
    this.refs.sidemenu.openMenu(true);
  }

  _navBarLeft() {
    if(this.props.sideMenu === false) {
      return (
        <TouchableHighlight style={styles.navBarLeft} onPress={() => this.props.navigator.pop()}>
          <Icon name="chevron-left" color="rgb(255,255,255)" size={24} />
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight style={styles.navBarLeft} onPress={this._handleHamburger.bind(this)}>
        <Icon name="bars" color="rgb(255,255,255)" size={24} />
      </TouchableHighlight>
    );
  }

  _renderRow(match) {
    return (
      <View><Text>I am a row: {match}</Text></View>
    );
  }

  render() {
    return (
      <SideMenuNav ref="sidemenu" menu={<SideMenu navigator={this.props.navigator} token={this.props.token} />}>
        <View style={styles.container}>
          <View style={styles.navBar}>
            {this._navBarLeft()}
            <View style={styles.navBarTitle}>
              <Text style={styles.navBarTitleText}>Matches</Text>
            </View>
            <View style={styles.navBarRight} />
          </View>
          <ListView
            scrollToTop={true}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => {
                  this.setState({isRefreshing: true});
                }}
                tintColor="rgb(191,191,191)"
                title="Loading..."
              />
            }
          />
        </View>
      </SideMenuNav>
    );
  }
}

MatchList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  sideMenu: React.PropTypes.bool
};

MatchList.defaultProps = {
  sideMenu: true
};

let styles = StyleSheet.create({
  navBar: {
    height: Layout.lines(4),
    padding: Layout.lines(0.75),
    position: 'absolute',
    top: 0,
    left: 0,
    right: -Layout.lines(1.5), // to offset the padding of the container
    backgroundColor: Colors.base,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  navBarLeft: {
    width: 24
  },
  navBarTitle: {
    flex: 1
  },
  navBarTitleText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white'
  },
  navBarRight: {
    width: 24
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: Colors.lightGrey,
    paddingTop: Layout.lines(4),
    paddingHorizontal: Layout.lines(0.75)
  }
});

module.exports = MatchList;
