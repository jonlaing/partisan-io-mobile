'use strict';

import React, {
  Component,
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  ListView,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import Avatar from './Avatar';

var {height, width} = Dimensions.get('window');

export default class MessageFriendList extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { friends: [], dataSource: ds.cloneWithRows([]) };
  }

  componentWillMount() {
    // Animate creation
    LayoutAnimation.easeInEaseOut();
  }

  componentDidMount() {
    Api.friendships(this.props.token).list()
    .then(friends => this.setState({friends: friends, dataSource: this.state.dataSource.cloneWithRows(friends)}))
    .catch(err => console.log(err));
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  _containerStyle() {
    if(this.props.show === true) {
      return styles.containerShow;
    }

    return styles.containerHide;
  }

  _renderRow(friendship) {
    return (
      <TouchableHighlight style={styles.rowContainer} onPress={() => this.props.onSelect(friendship.user)}>
        <View style={styles.row}>
          <Avatar style={styles.avatar} url={friendship.user.avatar_thumbnail_url} />
          <Text style={styles.username}>{friendship.user.username}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={this._containerStyle()}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableHighlight style={styles.x} onPress={this.props.onClose}>
              <Icon name="close" size={24} color="white" />
            </TouchableHighlight>
            <Text style={styles.headerText}>Friend List</Text>
          </View>
        </View>
        <ListView
          scrollToTop={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

MessageFriendList.propTypes = {
  token: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

MessageFriendList.defaultProps = {
  show: false,
  onClose: () => {}
};

const styles = StyleSheet.create({
  containerShow: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'white'
  },
  containerHide: {
    flex: 1,
    position: 'absolute',
    top: height,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'white'
  },
  headerContainer: {
    height: Layout.lines(4)
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: Layout.lines(1),
    backgroundColor: Colors.base
  },
  x: {
    position: 'absolute',
    right: Layout.lines(0.5)
  },
  headerText: {
    fontSize: Layout.lines(1.375),
    color: 'white'
  },
  rowContainer: {
    padding: Layout.lines(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    height: Layout.lines(2),
    width: Layout.lines(2),
    marginRight: Layout.lines(2),
    borderRadius: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  username: {
    fontSize: Layout.lines(1.25)
  }
});

module.exports = MessageFriendList;
