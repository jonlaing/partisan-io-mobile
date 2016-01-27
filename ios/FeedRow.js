'use strict';
import React, {
  Component,
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

class FeedRow extends Component {
  constructor(props) {
    super(props);
  }

  _avatar(user) {
    if(user.avatar_thumbnail_url.length > 0) {
      return (
        <Image
          style={styles.avatar}
          source={{uri: this.props.item.record.user.avatar_thumbnail_url}}
        />
      );
    } else {
      return (<View style={styles.avatar}/>);
    }
  }

  _postImage(item) {
    if(item.record.image_attachment.image_url.length > 0) {
      return (
        <View style={styles.postImageContainer}>
          <Image
            source={{uri: item.record.image_attachment.image_url}}
            style={styles.postImage} />
        </View>
      );
    } else {
      return (<View />);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.postHead}>
          {this._avatar(this.props.item.record.user)}
          <View style={styles.postUser}>
            <Text style={styles.postUserText}>@{this.props.item.record.user.username}</Text>
            <Text style={styles.postDate}>{this.props.item.record.post.created_at}</Text>
          </View>
        </View>
        {this._postImage(this.props.item)}
        <View style={styles.postBody}>
          <Text style={styles.postBodyText}>{this.props.item.record.post.body}</Text>
        </View>
        <View>
          <Text>Like buttons will go here</Text>
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
    marginBottom: 10
  },
  postHead: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  avatar: {
    height: 60,
    width: 60,
    marginRight: 10,
    backgroundColor: 'rgb(242,242,242)'
  },
  postUser: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  postUserText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'rgb(210,21,179)'
  },
  postDate: {
    color: 'rgb(191,191,191)',
    fontSize: 14
  },
  postBody: {
    flex: 1
  },
  postBodyText: {
    fontSize: 14,
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
  }
});

module.exports = FeedRow;
