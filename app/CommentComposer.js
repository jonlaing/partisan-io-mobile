'use strict';

import React, {
  Component,
  ActionSheetIOS,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Image,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Api from './Api';

import Layout from './Layout';
import Colors from './Colors';


class CommentComposer extends Component {
  constructor(props) {
    super(props);
    this.state = { height: Layout.lines(3), comment: '', photos: [], submitting: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.comment !== nextState.comment || this.state.photos !== nextState.photos;
  }

  focus() {
    this.refs.textInput.focus();
  }

  blur() {
    this.refs.textInput.blur();
  }

  _handleSubmit() {
    if(this.state.submitting === false) {
      this.setState({ submitting: true });
      this.blur();

      Api.comments(this.props.token).create(this.props.postID, this.state.comment, this.state.photos)
      .then(res => JSON.parse(res))
      .then(data => this.props.onFinish(data))
      .then(() => this.setState({ comment: '', photos: [], height: Layout.lines(3), submitting: false }))
      .catch(err => console.log(err));
    }
  }

  _inputStyle() {
    if(this.state.photos.length > 0) {
      return [styles.inputContainer, {height: this.state.height + Layout.lines(4)}];
    }

    return [styles.inputContainer, {height: this.state.height}];
  }

  _onChange(event) {
    let height = Math.ceil(event.nativeEvent.contentSize.height / Layout.lines(2)) * Layout.lines(3);
    let text = event.nativeEvent.text;

    if(height < Layout.lines(3)) {
      height = Layout.lines(3);
    } else if(height > Layout.lines(10)) {
      height = Layout.lines(10);
    }

    this.setState({comment: text, height: height});
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
          this.refs.textInput.blur();
          this.setState({photos: []});
          this.props.onCameraPress();
          break;
        case 1:
          this.setState({photos: []});
          break;
        default:
          break;
      }
    });
  }

  _preview() {
    if(this.state.photos.length > 0) {
      return (
        <TouchableHighlight onPress={this._showActionSheet.bind(this)}>
          <Image source={{uri: this.state.photos[0].uri}} style={{height: Layout.lines(3), width: Layout.lines(3)}} resizeMode="contain" />
        </TouchableHighlight>
      );
    }

    return <View />;
  }

  addPhotos(photos) {
    this.setState({ photos: photos });
    this.refs.textInput.focus();
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.inner} >
          <TouchableHighlight style={{marginHorizontal: Layout.lines(0.5), alignSelf: 'center'}} onPress={() => {this.refs.textInput.blur(); this.props.onCameraPress(); }}>
            <Icon name="add-a-photo" size={24} color={Colors.darkGrey} />
          </TouchableHighlight>
          <View style={this._inputStyle()}>
            {this._preview()}
            <TextInput
              style={styles.input}
              onChange={this._onChange.bind(this)}
              value={this.state.comment}
              autoFocus={this.props.autoFocus}
              multiline={true}
              placeholder="Write a comment..."
              keyboardAppearance="dark"
              ref="textInput"
            />
          </View>
          <TouchableHighlight underlayColor={this._underlayColor()} style={this._buttonStyle()} onPress={this._handleSubmit.bind(this)}>
            <Text style={this._buttonTextStyle()}>Post</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _underlayColor() {
    if(this.state.comment.length < 1) {
      return Colors.grey;
    }

    return Colors.actionHighlight;
  }

  _buttonStyle() {
    if(this.state.comment.length < 1 && this.state.photos.length < 1) {
      return [styles.button, {backgroundColor: Colors.grey}];
    }

    return styles.button;
  }

  _buttonTextStyle() {
    if(this.state.comment.length < 1 && this.state.photos.length < 1) {
      return [styles.buttonText, {color: Colors.darkGrey}];
    }

    return styles.buttonText;
  }
}

CommentComposer.propTypes = {
  token: React.PropTypes.string.isRequired,
  postID: React.PropTypes.string.isRequired,
  autoFocus: React.PropTypes.bool,
  onFinish: React.PropTypes.func,
  onCameraPress: React.PropTypes.func
};

CommentComposer.defaultProps = {
  onFinish: () => {},
  onCameraPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    padding: Layout.lines(0.5),
    backgroundColor: Colors.grey
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  inputContainer: {
    flex: 1,
    height: Layout.lines(3),
    paddingVertical: Layout.lines(0.5),
    paddingHorizontal: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    marginRight: Layout.lines(0.5),
    borderRadius: Layout.lines(0.25),
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    fontSize: Layout.lines(1)
  },
  button: {
    flexDirection: 'row',
    width: Layout.lines(4),
    height: Layout.lines(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.lines(0.25),
    backgroundColor: Colors.action
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = CommentComposer;
