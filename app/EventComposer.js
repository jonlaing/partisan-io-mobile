'use strict';

import React, {
  Component,
  Dimensions,
  ActivityIndicatorIOS,
  LayoutAnimation,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TextInput,
  ImageEditor,
  ImageStore,
  Image,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import moment from 'moment';

import Api from './Api';
import Layout from './Layout';
import Colors from './Colors';

import NavBar from './NavBar';
import LocationSelector from './LocationSelector';
import CameraRollView from './CameraRollView';
import DatePicker from './DatePicker';

let {height} = Dimensions.get('window');

let _cropData = (w, h) => {
  let x = w > h ? (w - h) / 2 : 0;
  let y = h > w ? (h - w) / 2 : 0;

  return {
    offset: { x: x, y: y },
    size: { width: w, height: h},
    displaySize: { width: 1080, height: 1080 }, // max size on server. most images coming from camera roll are bigger than that
    resizeMode: 'contain'
  };
};

export default class EventComposer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
      coverPhoto: null,
      summary: '',
      changedPhoto: false,

      showStartDate: false,
      showEndDate: false,
      showLocation: false,
      showCameraRoll: false,
      isSubmitting: false
    };
  }

  componentWillMount() {
    this._getEvent();
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  _getEvent() {
    if(this.props.eventID === '') {
      return;
    }

    Api.events(this.props.token).get(this.props.eventID)
    .then(data => data.event)
    .then(event => this.setState({
      title: event.title,
      startDate: new Date(event.start_date),
      endDate: new Date(event.end_date),
      coverPhoto: {uri: event.cover_photo_url},
      location: event.location,
      summary: event.summary
    }))
    .catch(err => console.log("could not load event", err));
  }

  _handleSubmit() {
    console.log(this.props.eventID);
    if(this.props.eventID === '') {
      this._handleCreate();
    } else {
      this._handleUpdate();
    }
  }

  _handleCreate() {
    let event = {
      title: this.state.title,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      location: this.state.location,
      summary: this.state.summary
    };

    this._getPhoto()
    .then((photo) => {
      event.coverPhoto = photo;

      Api.events(this.props.token).create(event)
      .then(() => this.props.navigator.props.eventEmitter.emit('create-event'))
      .then(() => this.props.navigator.pop())
      .then(() => ImageStore.removeImageForTag(photo))
      .catch(err => console.log("err:", err));
    }).catch(err => console.log("err:", err));
  }

  _handleUpdate() {
    let event = {
      title: this.state.title,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      location: this.state.location,
      summary: this.state.summary
    };

    this._getPhoto()
    .then((photo) => {
      event.coverPhoto = photo;

      Api.events(this.props.token).update(this.props.eventID, event)
      .then(() => this.props.navigator.props.eventEmitter.emit('update-event'))
      .then(() => this.props.navigator.pop())
      .then(() => ImageStore.removeImageForTag(photo))
      .catch(err => console.log("err:", err));
    }).catch(err => console.log("err:", err));
  }

  _getPhoto() {
    return new Promise((resolve, reject) => {
      if(this.state.changedPhoto === true) {
        if(this.state.coverPhoto.width > 1080 || this.state.coverPhoto.height > 1080) {
          ImageEditor.cropImage(
            this.state.coverPhoto.uri,
            _cropData(this.state.coverPhoto.width, this.state.coverPhoto.height),
            (uri) => resolve(uri),
            (err) => reject(err)
          );
        }

        resolve(this.state.coverPhoto.uri);
      }

      return resolve(null);
    });
  }

  _handleSelectPhoto(photos) {
    this.setState({showCameraRoll: false, coverPhoto: photos[0], changedPhoto: true});
  }

  _handleSummaryFocus() {
    this.summary.measure((fx, fy, w, h, px, py) => this.scrollView.scrollTo({y: py - Layout.lines(8)}));
  }

  _startDateStyle() {
    if(this.state.showStartDate === true) {
      return [styles.dateEdit, {top: height * 2 / 3 - Layout.lines(1)}];
    }

    return styles.dateEdit;
  }

  _endDateStyle() {
    if(this.state.showEndDate === true) {
      return [styles.dateEdit, {top: height * 2 / 3 - Layout.lines(1)}];
    }

    return styles.dateEdit;
  }

  _rightButton() {
    let style = this.state.isSubmitting ? [styles.navBarRightText, {color: Colors.baseLight}] : styles.navBarRightText;
    let label = this.props.eventID === '' ? 'Create' : 'Update';
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicatorIOS animating={this.state.isSubmitting} color='white' size="small" />
        <Text style={style}>{label}</Text>
      </View>
    );
  }

  _coverPhoto() {
    if(this.state.coverPhoto == null) {
      return (
        <TouchableHighlight style={styles.previewContainer} onPress={() => this.setState({showCameraRoll: true})}>
          <View style={styles.coverPhoto} >
            <Text>Upload Cover Photo</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight style={styles.previewContainer} onPress={() => this.setState({showCameraRoll: true})}>
        <Image source={{ uri: this.state.coverPhoto.uri }} style={styles.coverPhoto} />
      </TouchableHighlight>
    );
  }

  render() {
    let date = (d) => moment(d).format("MMMM Do YYYY");
    let time = (t) => moment(t).format("LT");

    return (
      <View style={styles.container}>
        <ScrollView ref={c => this.scrollView = c} style={styles.inner}>
          {this._coverPhoto()}
          <View style={styles.labelInput}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: March against the bourgeiosie"
              placeholderTextColor={Colors.darkGrey}
              value={this.state.title}
              onChangeText={text => this.setState({title: text})}
              onFocus={() => this.setState({showStartDate: false, showEndDate: false})}
            />
          </View>
          <TouchableHighlight onPress={() => this.setState({showStartDate: true, showEndDate: false})}>
            <View style={styles.labelInput}>
              <Text style={styles.label}>Start Date:</Text>
              <TextInput
                style={styles.input}
                placeholder="Start Date"
                placeholderTextColor={Colors.darkGrey}
                value={`${date(this.state.startDate)} at ${time(this.state.startDate)}`}
                editable={false}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.setState({showStartDate: false, showEndDate: true})}>
            <View style={styles.labelInput}>
              <Text style={styles.label}>End Date:</Text>
              <TextInput
                style={styles.input}
                placeholder="End Date"
                placeholderTextColor={Colors.darkGrey}
                value={`${date(this.state.endDate)} at ${time(this.state.endDate)}`}
                editable={false}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.setState({showLocation: true, showStartDate: false, showEndDate: false})}>
            <View style={styles.labelInput}>
              <Text style={styles.label}>Location:</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 1 Capital St, New York, NY"
                placeholderTextColor={Colors.darkGrey}
                value={this.state.location}
                editable={false}
              />
            </View>
          </TouchableHighlight>
          <View style={styles.labelInputBig}>
            <Text style={styles.labelBig}>Description:</Text>
            <TextInput
              style={styles.inputBig}
              ref={c => this.summary = c}
              placeholder="Describe your event"
              placeholderTextColor={Colors.darkGrey}
              value={this.state.summary}
              onChangeText={text => this.setState({summary: text})}
              onFocus={this._handleSummaryFocus.bind(this)}
              multiline={true}
            />
          </View>
        </ScrollView>
        <KeyboardSpacer />
        <NavBar
          title="Create Event"
          leftButton={<Text style={styles.navBarLeftText}>Cancel</Text>}
          leftButtonPress={() => this.props.navigator.pop()}
          rightButton={this._rightButton()}
          rightButtonPress={this._handleSubmit.bind(this)}
        />
        <DatePicker
          title="Start Date"
          value={this.state.startDate}
          onFinish={(d) => this.setState({showStartDate: false, startDate: d, endDate: moment(d).isAfter(this.state.endDate) ? d : this.state.endDate })}
          show={this.state.showStartDate}
          minimumDate={new Date()}
        />
        <DatePicker
          title="End Date"
          value={this.state.endDate}
          onFinish={(d) => this.setState({showEndDate: false, endDate: d, startDate: moment(d).isBefore(this.state.startDate) ? d : this.state.startDate })}
          show={this.state.showEndDate}
          minimumDate={new Date()}
        />
        <LocationSelector
          show={this.state.showLocation}
          onSelect={(data) => this.setState({location: data.description, showLocation: false}) }
          onCancel={() => this.setState({showLocation: false}) }
        />
        <CameraRollView show={this.state.showCameraRoll} onFinish={this._handleSelectPhoto.bind(this)} onCancel={() => this.setState({showCameraRoll: false})}/>
      </View>
    );
  }
}

EventComposer.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  eventID: React.PropTypes.string
};

EventComposer.defaultProps = {
  eventID: ''
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    paddingTop: Layout.lines(5)
  },
  inner: {
    paddingHorizontal: Layout.lines(1)
  },
  navBarLeftText: {
    fontSize: Layout.lines(1),
    color: 'white'
  },
  navBarRightText: {
    marginLeft: Layout.lines(0.5),
    fontSize: Layout.lines(1),
    fontWeight: 'bold',
    color: 'white'
  },
  input: {
    flex: 3,
    height: Layout.lines(3),
    fontSize: Layout.lines(0.85),
    padding: Layout.lines(1),
    marginBottom: Layout.lines(1),
    borderRadius: Layout.lines(0.25),
    backgroundColor: Colors.lightGrey
  },
  inputBig: {
    height: Layout.lines(8),
    fontSize: Layout.lines(0.85),
    padding: Layout.lines(0.5),
    marginBottom: Layout.lines(1),
    borderRadius: Layout.lines(0.25),
    backgroundColor: Colors.lightGrey
  },
  labelInput: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  labelInputBig: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: Layout.lines(1)
  },
  label: {
    flex: 1,
    fontSize: Layout.lines(0.85),
    marginBottom: Layout.lines(1)
  },
  labelBig: {
    fontSize: Layout.lines(0.85),
    marginBottom: Layout.lines(1)
  },
  coverPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.lines(8),
    marginBottom: Layout.lines(1),
    backgroundColor: Colors.lightGrey,
    borderRadius: Layout.lines(0.25)
  },
  done: {
    position: 'absolute',
    right: Layout.lines(1),
    top: Layout.lines(1),
    color: Colors.action,
    fontWeight: 'bold'
  }
});

module.exports = EventComposer;
