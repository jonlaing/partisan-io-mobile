import React, {
  Component,
  StyleSheet,
  Dimensions,
  DatePickerIOS,
  View,
  Text
} from 'react-native';

let {height} = Dimensions.get('window');

import Layout from './Layout';
import Colors from './Colors';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = { date: this.props.value };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.state.date) {
      this.setState({date: nextProps.value});
    }
  }

  _pickerStyle() {
    if(this.props.show === true) {
      return [styles.dateEdit, {top: height * 2 / 3 - Layout.lines(1), shadowOpacity: 0.5}];
    }

    return styles.dateEdit;
  }

  _handleDone() {
    this.props.onFinish(this.state.date);
  }

  render() {
    return (
      <View style={this._pickerStyle()}>
        <Text style={styles.dateEditText}>{this.props.title}</Text>
        <Text style={styles.done} onPress={this._handleDone.bind(this)}>Done</Text>
        <DatePickerIOS
          style={{flex: 1, alignSelf: 'center'}}
          date={this.state.date}
          onDateChange={(d) => this.setState({date: d})}
          minimumDate={this.props.minimumDate}
          maximumDate={this.props.maximumDate}
          mode={this.props.mode}
        />
    </View>
    );
  }
}

DatePicker.propTypes = {
  title: React.PropTypes.string,
  value: React.PropTypes.instanceOf(Date),
  minimumDate: React.PropTypes.instanceOf(Date),
  show: React.PropTypes.bool,
  mode: React.PropTypes.oneOf(['date', 'time', 'datetime']),
  onFinish: React.PropTypes.func
};

DatePicker.defaultProps = {
  title: '',
  value: new Date(),
  minimumDate: null,
  maximumDate: null,
  show: false,
  mode: 'datetime',
  onFinish: () => {}
};

const styles = StyleSheet.create({
  dateEdit: {
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    height: height / 3 + Layout.lines(1),
    paddingTop: Layout.lines(1),
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: Colors.lightGrey,
    shadowOffset: { width: 0, height: -Layout.lines(1) },
    shadowColor: 'black',
    shadowRadius: Layout.lines(1),
    shadowOpacity: 0
  },
  dateEditText: {
    fontSize: Layout.lines(1),
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.darkGrey
  },
  done: {
    position: 'absolute',
    right: Layout.lines(1),
    top: Layout.lines(1),
    color: Colors.action,
    fontWeight: 'bold'
  }
});

module.exports = DatePicker;
