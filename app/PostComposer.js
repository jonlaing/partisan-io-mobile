'use strict';

import React, {
  Alert,
  ActionSheetIOS,
  Component,
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Colors from './Colors';
import Layout from './Layout';

import CameraRollView from './CameraRollView';
import NavBar from './NavBar';

class PostComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', image: "", showCameraRoll: false, isSubmitting: false };
  }

  _changeText(text) {
    this.setState({value: text});
  }

  _handlePost() {
    let api = () => Api.posts(this.props.token).create(this.state.value, [this.state.image]);

    if(this._hasParent()) {
      switch(this.props.parentType) {
              case "event":
                      api = () => Api.events(this.props.token).post(this.props.parentID, this.state.value, [this.state.image]);
                      break;
              default:
                      throw "Unknown parent type";
      }
    }

    if(this.state.isSubmitting !== true && (this.state.value.length > 0 || this.state.image.length > 0)) {
      this.setState({isSubmitting: true});

      api().then(() => this.props.navigator.props.eventEmitter.emit('post-success'))
      .then(() => this.props.navigator.pop())
      .then(() => this.setState({ isSubmitting: false }) )
      .catch(err => {
        let message;

        if(err == null) {
          message = "An unknown error has occured.";
        } else {
          message = `An error has occurred:\n\n${err}`;
        }

        Alert.alert( 'Error', message,
          [
            {text: 'Try again', onPress: () => this.setState({ isSubmitting: false }) },
            {text: 'Cancel', onPress: () => { this.setState({ isSubmitting: false }); this.props.navigator.pop(); }}
          ]);
      });
    }
  }

  _handleCancel() {
    this.props.navigator.pop();
  }

  _rightButton() {
    let style = this.state.value.length < 1 || this.state.isSubmitting ? [styles.navBarRightText, {color: Colors.baseLight}] : styles.navBarRightText;
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicatorIOS animating={this.state.isSubmitting} color='white' size="small" />
        <Text style={style}>Post</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.text}
          multiline={true}
          onChangeText={this._changeText.bind(this)}
          value={this.state.value}
          autoFocus={true}
          keyboardType="twitter"
          returnKeyType="done"
          editable={!this.state.isSubmitting}
          ref="text"
        />
        <View style={styles.postFooter}>
          {this._imagePreview()}
        </View>
        <KeyboardSpacer />
        <NavBar
          title="Write a Post"
          leftButton={<Text style={styles.navBarLeftText}>Cancel</Text>}
          leftButtonPress={this._handleCancel.bind(this)}
          rightButton={this._rightButton()}
          rightButtonPress={this._handlePost.bind(this)}
        />
        <CameraRollView show={this.state.showCameraRoll} onFinish={(images) => { this.setState({ image: images[0].uri, showCameraRoll: false }); this.refs.text.focus(); }}/>
      </View>
    );
  }

  _imagePreview() {
    if(this.state.image.length > 0) {
      return (
        <TouchableHighlight onPress={this._showActionSheet.bind(this)}>
          <Image style={styles.preview} source={{ uri: this.state.image }} />
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight style={styles.camera} onPress={() => { this.refs.text.blur(); this.setState({ showCameraRoll: true }); }}>
        <Icon name="camera-retro" color={Colors.darkGrey} size={24} />
      </TouchableHighlight>
    );
  }

  _showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Select a different photo',
        'Remove photo',
        'Cancel'
      ],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1
    },
    (buttonIndex) => {
      switch(buttonIndex) {
        case 0:
          this.refs.text.blur();
          this.setState({ image: "", showCameraRoll: true });
          break;
        case 1:
          this.setState({ image: "" });
          break;
        default:
          break;
      }
    });
  }

  _hasParent() {
    return this.parentType !== '' && this.parentID !== '';
  }
}

PostComposer.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  parentType: React.PropTypes.string,
  parentID: React.PropTypes.string
};

PostComposer.defaultProps = {
  parentType: '',
  parentID: ''
};

const styles = StyleSheet.create({
  navBarLeftText: {
    fontSize: 16,
    color: 'white'
  },
  navBarTitle: {
    flex: 1
  },
  navBarTitleText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white'
  },
  navBarRightText: {
    marginLeft: Layout.lines(0.5),
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Layout.lines(4),
    backgroundColor: Colors.lightGrey
  },
  postFooter: {
    paddingVertical: Layout.lines(0.5),
    paddingHorizontal: Layout.lines(0.75)
  },
  camera: {
    width: 24,
    height: 24,
    alignSelf: 'flex-end'
  },
  preview: {
    width: Layout.lines(3),
    height: Layout.lines(3),
    alignSelf: 'flex-end'
  },
  text: {
    flex: 1,
    fontSize: 18,
    lineHeight: Layout.lines(1.5),
    height: 200,
    padding: Layout.lines(0.75),
    color: 'black',
    backgroundColor: 'white'
  }
});

module.exports = PostComposer;
