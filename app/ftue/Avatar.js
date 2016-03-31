'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';
import ExNavigator from '@exponent/react-native-navigator';

import Api from '../Api';
import Router from '../Router';
import Layout from '../Layout';
import Colors from '../Colors';

import CameraRollView from '../CameraRollView';

class AvatarFTUE extends Component {
  constructor(props) {
    super(props);

    this.state = { showCameraRoll: false, uri: '', uploading: false };
  }

  _handleSelectPhoto(uris) {
    this.setState({showCameraRoll: false, uri: uris[0]});
  }

  _handleSubmit() {
    if(this.state.uri.length < 1) {
      return; // TODO: Error handling
    }

    this.setState({uploading: true});

    Api.profile(this.props.token).avatarUpload(this.state.uri)
    .then(resp => console.log("success:", resp))
    .then(() => this.setState({uploading: false}))
    .then(() => this.props.navigator.push(Router.feed(this.props.token)))
    .catch(err => console.log("error:", err));
  }

  _previewImage() {
    if(this.state.uri.length < 1) {
      return (
        <TouchableHighlight style={styles.previewContainer} onPress={() => this.setState({showCameraRoll: true})}>
          <View style={styles.preview} />
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight style={styles.previewContainer} onPress={() => this.setState({showCameraRoll: true})}>
        <Image source={{ uri: this.state.uri }} style={styles.preview} />
      </TouchableHighlight>
    );
  }

  _submitButton() {
    if(this.state.uploading === true) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicatorIOS animating={this.state.uploading} color={Colors.darkGrey} size="large" />
        </View>
      );
    }

    return (
      <TouchableHighlight style={styles.actionButton} onPress={this._handleSubmit.bind(this)}>
        <View style={styles.buttonInner}>
          <Icon name="check" color={Colors.base} size={Layout.lines(1.5)} style={{flex: 2}} />
          <Text style={styles.actionText}>Finish</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.header}>Upload an Avatar</Text>
          {this._previewImage()}
          {this._submitButton()}
        </View>
        <CameraRollView show={this.state.showCameraRoll} onFinish={this._handleSelectPhoto.bind(this)}/>
      </View>
    );
  }
}

AvatarFTUE.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: Layout.lines(2)
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: Layout.lines(2),
    fontWeight: '200',
    color: Colors.darkGrey
  },
  previewContainer: {
    flex: 5,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  preview: {
    width: 300,
    height: 300,
    backgroundColor: Colors.grey
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.base,
    borderRadius: Layout.lines(0.5),
    padding: Layout.lines(1),
    maxHeight: Layout.lines(4)
  },
  actionText: {
    flex: 3,
    fontSize: Layout.lines(1.5),
    fontWeight: "bold",
    color: Colors.base
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: Layout.lines(2)
  }
});

module.exports = AvatarFTUE;
