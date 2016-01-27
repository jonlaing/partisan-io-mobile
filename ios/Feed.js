'use strict';
import React, {
  Component,
  StyleSheet,
  ListView,
  View
} from 'react-native';

import feedItems from '../FeedMock';
import FeedRow from './FeedRow';

class Feed extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = { dataSource: ds.cloneWithRows(feedItems) };
  }

  renderRow(item) {
    return (
      <FeedRow
        key={item.id}
        item={item}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
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

module.exports = Feed;
