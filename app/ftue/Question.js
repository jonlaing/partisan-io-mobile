'use strict';
import React, {
  Component,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Dimensions from 'Dimensions';

const windowWidth = Dimensions.get('window').width;

import Layout from '../Layout';
import Colors from '../Colors';

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = { pan: new Animated.ValueXY(), threshold: false };
  }

  componentWillMount() {
    this._animatedValueX = 0;
    this._animatedValueY = 0;

    this.state.pan.x.addListener((value) => this._animatedValueX = value.value);
    this.state.pan.y.addListener((value) => this._animatedValueY = value.value);
      this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
        onPanResponderGrant: (e, gestureState) => {
          this.state.pan.setOffset({x: this._animatedValueX, y: this._animatedValueY});
          this.state.pan.setValue({x: 0, y: 0}); //Initial value
        },
        onPanResponderMove: (e, gestureState) => {
          if(this._shouldFlyOff(gestureState.moveX)) {
            this._flyOff(gestureState.moveX);
          } else {
            this.state.pan.setValue({x: gestureState.dx, y: gestureState.dy});
          }
        }, // Creates a function to handle the movement and set offsets
        // onPanResponderMove: Animated.event([
        //   null, {dx: this.state.pan.x, dy: this.state.pan.y}
        // ]), // Creates a function to handle the movement and set offsets
        onPanResponderRelease: (e, gestureState) => {
          if(this._shouldFlyOff(gestureState.moveX)) {
             this._flyOff(gestureState.moveX);
          } else {
            Animated.spring(this.state.pan, {
              toValue: 0
            }).start();
          }
        }
      });
  }

  componentWillUnmount() {
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
  }

  _shouldFlyOff(moveX) {
    return moveX < windowWidth / 4 || moveX > windowWidth * 3 / 4;
  }

  _flyOff(moveX) {
    if(this.state.threshold) {
      return;
    }
    this.setState({threshold: true});

    let dest;

    if(moveX < windowWidth / 2) {
      dest = -windowWidth - 100;
    }

    if(moveX > windowWidth / 2) {
      dest = windowWidth + 100;
    }

    Animated.timing(this.state.pan, {
      duration: 300,
      toValue: {x: dest, y: this._animatedValueY }
    }).start(() => this.props.onFlick(dest > 0));
  }

  handleArrowPress(agree = false) {
    return () => {
      if(!agree) {
        this._flyOff(windowWidth / 2 - 1);
      } else {
        this._flyOff(windowWidth / 2 + 1);
      }
    };
  }

  _cardStyle() {
    return [
      styles.card,
      {
        transform: [
          {
            translateX: this.state.pan.x
          },
          {
            translateY: this.state.pan.y
          },
          {
            rotate: this.state.pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]})
          }
        ],
        backgroundColor: this.state.pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [Colors.action, "rgb(255,255,255)", Colors.base]})
      }
    ];
  }

  _arrowStyle(agree = false) {
    if(!agree) {
      return [
        styles.disagree,
        {
          transform: [
            {
              scale: this.state.pan.x.interpolate({inputRange: [-200, 0], outputRange: [1.5, 1]})
            }
          ]
        }
      ];
    }

    return [
      styles.agree,
      {
        transform: [
          {
            scale: this.state.pan.x.interpolate({inputRange: [0, 200], outputRange: [1, 1.5]})
          }
        ]
      }
    ];
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={this._cardStyle()} {...this._panResponder.panHandlers} >
          <Text style={styles.cardNumber}>{this.props.index + 1} of {this.props.maxQuestions}</Text>
          <Text style={styles.questionText}>{this.props.prompt}</Text>
        </Animated.View>
        <Animated.View style={this._arrowStyle(false)} {...this._panResponder.panHandlers}>
          <View style={styles.disagreeArrow}/>
          <TouchableHighlight onPress={this.handleArrowPress(false).bind(this)}>
            <Text style={{color: 'white'}}>Disagree</Text>
          </TouchableHighlight>
        </Animated.View>
        <Animated.View style={this._arrowStyle(true)} {...this._panResponder.panHandlers}>
          <View style={styles.agreeArrow}/>
          <TouchableHighlight onPress={this.handleArrowPress(true).bind(this)}>
            <Text style={{color: 'white'}}>Agree</Text>
          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
}

Question.propTypes = {
  index: React.PropTypes.number.isRequired,
  prompt: React.PropTypes.string.isRequired,
  maxQuestions: React.PropTypes.number,
  onFlick: React.PropTypes.func
};

Question.defaultProps = {
  maxQuestions: 20,
  onFlick: function(didAgree) { return didAgree; }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: Layout.lines(3)
  },
  card: {
    flex: 1,
    position: 'relative',
    width: windowWidth - Layout.lines(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: Layout.lines(2),
    backgroundColor: 'white'
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center'
  },
  cardNumber: {
    position: 'absolute',
    top: Layout.lines(1),
    right: Layout.lines(1),
    padding: Layout.lines(0.25),
    borderRadius: Layout.lines(0.25),
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white'
  },
  disagree: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -Layout.lines(1),
    left: 0,
    width: 100,
    height: Layout.lines(2),
    borderRadius: Layout.lines(0.17),
    paddingRight: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2) / 2,
    backgroundColor: Colors.action
  },
  disagreeArrow: {
    position: 'absolute',
    width: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2),
    height: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2),
    left: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2) / -2,
    top: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2) / 4,
    transform: [{ rotate: '45deg' }],
    borderRadius: Layout.lines(0.17),
    backgroundColor: Colors.action
  },
  agree: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -Layout.lines(1),
    right: 0,
    width: 100,
    height: Layout.lines(2),
    borderRadius: Layout.lines(0.17),
    paddingLeft: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2) / 2,
    backgroundColor: Colors.base
  },
  agreeArrow: {
    position: 'absolute',
    width: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2),
    height: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2),
    right: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2) / -2,
    top: Math.sqrt(Math.pow(Layout.lines(2), 2) / 2) / 4,
    transform: [{ rotate: '45deg' }],
    borderRadius: Layout.lines(0.17),
    backgroundColor: Colors.base
  }
});

module.exports = Question;
