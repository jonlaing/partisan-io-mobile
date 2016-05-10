'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from '../Layout';
import Colors from '../Colors';

import Avatar from '../Avatar';

export default class PostHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={{flex: 1}} onPress={this.props.onPress} >
          <View style={styles.postHead}>
            <Avatar user={this.props.user} style={styles.avatar} />
            <View style={styles.postUser}>
              <Text style={styles.postUserText}>@{this.props.user.username}</Text>
              <Text style={styles.postDate}>{moment(this.props.post.created_at).fromNow()}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight>
          <Icon name="more-vert" size={32} color={Colors.grey} />
        </TouchableHighlight>
      </View>
    );
  }
}

PostHeader.propTypes = {
  user: React.PropTypes.shape({ username: React.PropTypes.string }).isRequired,
  post: React.PropTypes.shape({
    id: React.PropTypes.number,
    created_at: React.PropTypes.oneOfType([ React.PropTypes.number, React.PropTypes.string ]),
    body: React.PropTypes.string
  }).isRequired,
  onPress: React.PropTypes.func
};

PostHeader.defaultProps = {
  onPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Layout.lines(1),
    marginRight: -Layout.lines(1)
  },
  postHead: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  avatar: {
    height: Layout.lines(2),
    width: Layout.lines(2),
    marginRight: Layout.lines(2),
    borderRadius: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  postUser: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  postUserText: {
    fontSize: Layout.lines(1),
    color: Colors.action
  },
  postDate: {
    color: Colors.grey,
    fontSize: Layout.lines(0.75)
  }
});

module.exports = PostHeader;
