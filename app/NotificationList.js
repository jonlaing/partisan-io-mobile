/*global fetch */
'use strict';
import React, {
  Component,
  StyleSheet,
  ListView,
  View
} from 'react-native';

import notifs from '../NotificationMock';
import NotificationRow from './NotificationRow';

class NotificationList extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.notification.id !== r2.notification.id});
    this.state = { dataSource: ds.cloneWithRows(notifs) };
  }

  componentWillMount() {
    console.log('trying');
    fetch('http://localhost:4000/api/v1/notifications')
      .then(res => console.log(res))
      .then(res => res.json());
      // .then(res => this.setState({ list: res }));
  }

  _renderRow(notif) {
    return (
      <NotificationRow
        key={notif.notification.id}
        notif={notif}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgb(242,242,242)',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10
  }
});

module.exports = NotificationList;
