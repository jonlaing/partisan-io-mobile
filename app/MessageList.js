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
import SideMenuNav from 'react-native-side-menu';

import Api from './Api';

import Layout from './Layout';
import Colors from './Colors';

import SideMenu from './SideMenu';
import NavBar from './NavBar';
import MessageThread from './MessageThread';

class MessageList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      items: [],
      dataSource: ds.cloneWithRows([]),
      isRefreshing: false
    };
  }

  componentDidMount() {
    this._getThreads();
  }

  _getThreads() {
    Api.messages(this.props.token).threads()
    .then(res => res.json())
    .then(data => this.setState({items: data.threads, dataSource: this.state.dataSource.cloneWithRows(data.threads)}))
    .then(() => console.log(this.state.items))
    .catch(err => console.log(err));
  }

  _handleHamburger() {
    this.refs.sidemenu.openMenu(true);
  }

  _renderRow(thread) {
    return <MessageThread key={thread.id} thread={thread} token={this.props.token} navigator={this.props.navigator} />;
  }

  render() {
    return (
      <SideMenuNav ref="sidemenu" menu={ <SideMenu navigator={this.props.navigator} token={this.props.token} /> }>
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
        </View>
        <NavBar
          title="Conversations"
          leftButton={ <Icon name="bars" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={this._handleHamburger.bind(this)}
        />
      </SideMenuNav>
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
    paddingTop: Layout.lines(4),
    backgroundColor: Colors.lightGrey
  }
});

module.exports = MessageList;
