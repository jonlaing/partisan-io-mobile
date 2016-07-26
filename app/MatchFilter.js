import React, {
  Component,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  SliderIOS,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Layout from './Layout';
import Colors from './Colors';

let {width, height} = Dimensions.get('window');

export default class MatchFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: 105,
      minAge: 18,
      maxAge: 150,
      lookingFor: 7
    };
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  _handleFinish() {
    this.props.onFinish(this.state);
  }

  _normalizeAges() {
    if(this.state.minAge > this.state.maxAge) {
      this.setState({minAge: this.state.maxAge});
    }
  }

  _style() {
    if(this.props.show === true) {
      return [styles.container, {top: 0}];
    }

    return styles.container;
  }

  _distance() {
    if(this.state.distance > 100) {
      return "from anywhere";
    }

    return `within ${this.state.distance} miles`;
  }

  render() {
    return (
      <View style={this._style()}>
        <Text style={styles.header}>Filter Matches</Text>
        <View style={styles.input}>
          <Text style={styles.label}>Distance</Text>
          <SliderIOS
            minimumValue={5}
            maximumValue={105}
            step={5}
            value={this.state.distance}
            onValueChange={(d) => this.setState({distance: d})}
          />
          <Text style={styles.slider}>Show results {this._distance()}</Text>
        </View>
        <TouchableHighlight style={styles.done} onPress={this._handleFinish.bind(this)}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

MatchFilter.propTypes = {
  show: React.PropTypes.bool,
  onFinish: React.PropTypes.func
};

MatchFilter.defaultProps = {
  show: false,
  onFinish: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: height,
    width: width,
    height: height,
    padding: Layout.lines(1),
    backgroundColor: 'white'
  },
  header: {
    fontSize: Layout.lines(1.2),
    textAlign: 'center',
    fontWeight: '200',
    color: Colors.darkGrey,
    marginBottom: Layout.lines(1)
  },
  input: {
    padding: Layout.lines(1),
    marginVertical: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: Layout.lines(0.25)
  },
  label: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  slider: {
    textAlign: 'center'
  },
  done: {
    backgroundColor: Colors.action,
    paddingVertical: Layout.lines(1),
    paddingHorizontal: Layout.lines(1.5),
    marginVertical: Layout.lines(1),
    borderRadius: Layout.lines(0.25)
  },
  doneText: {
    color: 'white',
    textAlign: 'center',
    fontSize: Layout.lines(1.2)
  }
});

module.exports = MatchFilter;
