'use strict';
import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Image
} from 'react-native';

import moment from 'moment';
import Markdown from 'react-native-markdown';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from './Colors';

class FeedRow extends Component {
  constructor(props) {
    super(props);
  }

  _avatar(user) {
    let url = user.avatar_thumbnail_url;
    if(url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      return (
        <Image
          style={styles.avatar}
          source={{uri: url}}
        />
      );
    } else {
      return (<View style={styles.avatar}/>);
    }
  }

  _postImage(item) {
    let url = item.record.image_attachment.image_url;

    if(url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      return (
        <View style={styles.postImageContainer}>
          <Image
            source={{uri: url}}
            style={styles.postImage} />
        </View>
      );
    } else {
      return (<View />);
    }
  }

  render() {
    let record = this.props.item.record;
    let user = record.user;

    return (
      <View style={styles.container}>
        <View style={styles.postHead}>
          {this._avatar(record.user)}
          <View style={styles.postUser}>
            <Text style={styles.postUserText}>@{user.username}</Text>
            <Text style={styles.postDate}>{moment(record.post.created_at).fromNow()}</Text>
          </View>
        </View>
        {this._postImage(this.props.item)}
        <View style={styles.postBody}>
          <Text style={styles.postBodyText}>{record.post.body}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableHighlight style={styles.action} >
            <View style={styles.actionContainer}>
              <Icon name="star" color={Colors.grey} size={14} style={styles.actionIcon} />
              <Text style={styles.actionText} >Favorites ({record.like_count})</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.action} >
            <View style={styles.actionContainer}>
              <Icon name="comments-o" color={Colors.grey} size={14} style={styles.actionIcon} />
              <Text style={styles.actionText} >Comments ({record.comment_count})</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 2,
    marginTop: 10
  },
  postHead: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  avatar: {
    height: 45,
    width: 45,
    marginRight: 10,
    backgroundColor: Colors.lightGrey
  },
  postUser: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  postUserText: {
    fontSize: 18,
    color: Colors.action
  },
  postDate: {
    color: Colors.grey,
    fontSize: 12
  },
  postBody: {
    flex: 1
  },
  postBodyText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    lineHeight: 24
  },
  postImageContainer: {
    flex: 1,
    height: 350,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  postImage: {
    flex: 1
  },
  actions: {
    flex: 1,
    marginTop: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  action: {
    flex: 1
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  actionIcon: {
    width: 14,
    marginRight: 10
  },
  actionText: {
    fontSize: 12
  }
});

module.exports = FeedRow;
