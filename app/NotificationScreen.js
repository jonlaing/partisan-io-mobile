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
import NotificationRow from './NotificationRow';

class NotificationScreen extends Component {
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
    this._getNotifs();
  }

  _getNotifs() {
    Api.notifications(this.props.token).list()
    .then(notifs => this.setState({ items: notifs, dataSource: this.state.dataSource.cloneWithRows(notifs)}))
    .catch(err => console.log(err));
  }

  _renderRow(notif) {
    console.log(notif);
    return <NotificationRow key={notif.id}
      userID={notif.user.id}
      username={notif.user.username}
      avatar={notif.user.avatar_thumbnail_url}
      recordID={notif.record_id}
      recordType={notif.record_type}
      action={notif.action}
      createdAt={notif.created_at}
      token={this.props.token}
      navigator={this.props.navigator} />;
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
                this._getNotifs();
              }}
              tintColor="rgb(191,191,191)"
              title="Loading..."
            />
          }
        />
        <NavBar
          title="Notifications"
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

NotificationScreen.propTypes = {
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

module.exports = NotificationScreen;
