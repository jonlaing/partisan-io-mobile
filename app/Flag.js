'use strict';

import React, {
  Component,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Picker,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';

export default class Flag extends Component {
  constructor(props) {
    super(props);

    this.state = { showReason: false, reason: "", comment: '' };
  }

  reason(r) {
    switch(r) {
            case "offensive":
                    return "Offensive Content";
            case "copyright":
                    return "Copyrighted Material";
            case "spam":
                    return "Spam";
            case "other":
                    return "Other";
            default:
                    return "Select reason for flagging";
    }
  }


  renderReason() {
    if(this.state.showReason === true) {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={this.state.reason}
            onValueChange={(val) => this.setState({ showReason: false, reason: val})}>
            <Picker.Item label={this.reason("")} value={""} />
            <Picker.Item label={this.reason("offensive")} value={"offensive"} />
            <Picker.Item label={this.reason("copyright")} value={"copyright"} />
            <Picker.Item label={this.reason("spam")} value={"spam"} />
            <Picker.Item label={this.reason("other")} value={"other"} />
          </Picker>
        </View>
      );
    }

    return <View />;
  }

  handlePost() {
    Api.flag(this.props.recordType, this.props.recordID, this.state.reason, this.state.comment, this.props.token)
    .then(() => this.props.navigator.pop())
    .catch((err) => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reason:</Text>
          <TouchableHighlight onPress={() => this.setState({ showReason: true })}>
            <TextInput
              style={styles.reason}
              editable={false}
              placeholder="Select reason for flagging"
              value={this.reason(this.state.reason)}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comment:</Text>
          <TextInput
            style={styles.comment}
            placeholder="Type additional comments here (optional)"
            onFocus={() => this.setState({ showReason: false })}
            onChangeText={(text) => this.setState({ comment: text })}
            multiline={true}
          />
        </View>
        <NavBar
          title="Flag content"
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={() => this.props.navigator.pop()}
          rightButton={<Text style={{ fontSize: Layout.lines(1), fontWeight: 'bold', color: 'white' }}>Done</Text>}
          rightButtonPress={this.handlePost.bind(this)}
        />
        {this.renderReason()}
      </View>
    );
  }
}

Flag.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  recordType: React.PropTypes.string.isRequired,
  recordID: React.PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: Colors.lightGrey,
    paddingTop: Layout.lines(4)
  },
  inputContainer: {
    padding: Layout.lines(1)
  },
  reason: {
    padding: Layout.lines(0.5),
    height: Layout.lines(2),
    backgroundColor: 'white'
  },
  comment: {
    padding: Layout.lines(0.5),
    height: Layout.lines(8),
    fontSize: Layout.lines(1),
    backgroundColor: 'white'
  },
  pickerContainer: {
    position: 'absolute',
    flex: 1,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  }
});

module.exports = Flag;
