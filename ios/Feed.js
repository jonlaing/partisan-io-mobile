'use strict';
import React, {
  Component,
  StyleSheet,
  ListView,
  View,
  TextInput
} from 'react-native';

import feedItems from '../FeedMock';
import FeedRow from './FeedRow';

class Feed extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = { dataSource: ds.cloneWithRows(feedItems) };
  }

  _renderHeader() {
    return (
      <TextInput
        style={styles.postComposer}
        onChangeText={(text) => this.setState({text: text})}
        value={this.state.text}
        autoCapitalize="sentences"
        multiline={true}
        placeholder="Write a new post"
        placeholderTextColor={'rgb(191,191,191)'}
        returnKeyType='done'
        blurOnSubmit={true}
      />
    );
  }

  _renderRow(item) {
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
          renderHeader={this._renderHeader.bind(this)}
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
  },
  postComposer: {
    flex: 1,
    height: 50,
    marginBottom: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderColor: 'rgb(210,21,179)',
    borderBottomWidth: 2,
    fontSize: 18,
    backgroundColor: 'white'
  }
});

module.exports = Feed;
