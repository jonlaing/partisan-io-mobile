'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  ImageEditor,
  ImageStore,
  Image,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Foundation';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import CameraRollView from './CameraRollView';

let _cropData = (width, height) => {
  let x = width > height ? (width - height) / 2 : 0;
  let y = height > width ? (height - width) / 2 : 0;

  return {
    offset: { x: x, y: y },
    size: { width: width > height ? height : width, height: width > height ? height : width }, // make it a square
    displaySize: { width: 1080, height: 1080 }, // max size on server. most images coming from camera roll are bigger than that
    resizeMode: 'cover'
  };
};


class UploadAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = { showCameraRoll: false, photo: {}, uploading: false, error: false };
  }

  _handleSelectPhoto(photos) {
    this.setState({showCameraRoll: false, photo: photos[0]});
  }

  _handleSubmit() {
    if(this.state.photo.uri === undefined) {
      return; // TODO: Error handling
    }

    this.setState({uploading: true});

    if(this.state.photo.width > 1080 || this.state.photo.height > 1080) {
      ImageEditor.cropImage(
        this.state.photo.uri,
        _cropData(this.state.photo.width, this.state.photo.height),
        (uri) => this._uploadPhoto(uri, true),
        (err) => this._handleError(err)
      );
      return;
    }

    this._uploadPhoto(this.state.photo.uri);
  }

  _uploadPhoto(uri, cropped = false) {
    this.setState({photo: {uri: uri}});
    Api.profile(this.props.token).avatarUpload(uri)
    .then(data => JSON.parse(data))
    .then(resp => this.props.onSuccess(resp.user))
    .then(() => this.setState({uploading: false}))
    .then(() => {
      if(cropped === true) {
        ImageStore.removeImageForTag(uri);
      }
    })
    .catch(err => this._handleError(err));
  }


  _handleError(err) {
    console.log(err);
    this.setState({ error: true, uploading: false });
  }

  _showError() {
    if(this.state.error !== true) {
      return <View style={{flex: 1}} />;
    }

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>An error has occurred, please try again</Text>
      </View>
    );
  }

  _previewImage() {
    if(this.state.photo.uri === undefined) {
      return (
        <TouchableHighlight style={styles.previewContainer} onPress={() => this.setState({showCameraRoll: true})}>
          <View style={styles.preview} />
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight style={styles.previewContainer} onPress={() => this.setState({showCameraRoll: true})}>
        <Image source={{ uri: this.state.photo.uri }} style={styles.preview} />
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
          {this._showError()}
          {this._submitButton()}
          <TouchableHighlight style={styles.skipButton} onPress={() => this.props.onCancel()}>
            <Text style={styles.skipButtonText}>{this.props.cancelText}</Text>
          </TouchableHighlight>
        </View>
        <CameraRollView show={this.state.showCameraRoll} onFinish={this._handleSelectPhoto.bind(this)} onCancel={() => this.setState({showCameraRoll: false})}/>
      </View>
    );
  }
}

UploadAvatar.propTypes = {
  token: React.PropTypes.string.isRequired,
  cancelText: React.PropTypes.string,
  onSucces: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

UploadAvatar.defaultProps = {
  cancelText: "Cancel",
  onSuccess: () => {},
  onCancel: () => {}
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
    height: Layout.lines(4)
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.lines(0.5),
    marginVertical: Layout.lines(1),
    backgroundColor: Colors.accent
  },
  errorText: {
    textAlign: 'center',
    color: 'white'
  },
  skipButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  skipButtonText: {
    textAlign: 'center',
    color: Colors.darkGrey
  }
});

module.exports = UploadAvatar;
