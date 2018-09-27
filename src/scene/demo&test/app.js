import React, { Component, PropTypes } from 'react';
import {
    Dimensions,
    PanResponder,
    View,
    Animated, Easing,
} from 'react-native';
import { transformOrigin, rotateXY, rotateXZ } from './utils';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
    container: {
      flex:1,
        // position: 'absolute',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
        // padding: 50
    },
    rectangle: {
        position: 'absolute',
        // left: 0,
        // top: 0,
        width: 300,
        height:300,
        zIndex: 10,
        justifyContent: 'center',
        alignItems:'center',
        opacity: 0.9

    },
    text: {
        color: '#2e71c8',
        textAlign:'center',
        fontSize : 36,
        fontFamily: 'Tungsten-Semibold',
        width:'100%'
    }
};

export default class Cube extends Component {
    position = new Animated.Value(0);//当前在那一页
    positionValue = 0;
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove.bind(this),
        onPanResponderRelease: this.handlePanResponderRelease.bind(this),
    });
  }

  handlePanResponderMove (e, gestureState) {
    let { dx ,dy} = gestureState;
    Math.abs(dx)<Math.abs(dy)?dy=0:dx=0;

    const origin = { x: 0, y: 0, z: -170 };
    let matrix = rotateXY(dx, dy);
    transformOrigin(matrix, origin);
    this.refViewFront.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = rotateXY(dx + 180, dy);
    transformOrigin(matrix, origin);
    this.refViewBack.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = rotateXY(dx + 90, dy);
    transformOrigin(matrix, origin);
    this.refViewRight.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = rotateXY(dx - 90, dy);
    transformOrigin(matrix, origin);
    this.refViewLeft.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = rotateXZ(dx, dy - 90);
    transformOrigin(matrix, origin);
    this.refViewTop.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = rotateXZ(-dx, dy + 90);
    transformOrigin(matrix, origin);
    this.refViewBottom.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

  }

    handlePanResponderRelease(evt, {vx, vy}) {
        // this.state.colORrow === true ? (vx = vy) : vx = vx
        this.position.flattenOffset();
        // const childrenCount = React.Children.count(this.props.children);
        const childrenCount = 4;
        const left = Math.floor(this.positionValue);
        const right = left + 1;
        let result;
        if (vx > 0.05) {
            result = left;
            //左滑动
            // this.setState({slide: false});
            // this.props.reduceface()
        }
        else if (vx<-0.05) {
            result = right;
            //右滑动
            // this.setState({slide: false});
            // this.props.addface()
        }
        else {
            result = Math.round(this.positionValue);
        }
        if (result < 0) {
            result += childrenCount;
            this.position.setValue(this.positionValue + childrenCount);
        } else if (result >= childrenCount) {
            result -= childrenCount;
            this.position.setValue(this.positionValue - childrenCount);
        }

        Animated.spring(this.position, {
            toValue: result,
            duration: 2000,
            easing: Easing.cubic,
        }).start();



// this.setState({faceIndex: result})
//
// if (vx > 0.05) {
//     //左滑动
//     this.setState({faceIndex: this.state.faceIndex+1 })
// } else if (vx < -0.05) {
//     //右滑动
//     this.setState({faceIndex: this.state.faceIndex-1 })
// } else {
// }

// console.log('prev: ', this.state.faceIndex, result);

        // result = result % childrenCount + childrenCount;
        // if (result > 4) result -= 4;
        // this.setState({faceIndex: result}, () => {
        // })


    }


  renderLeft(color) {
    return (
      <Animated.View
        ref={component => this.refViewRight = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderRight(color) {
    return (
      <Animated.View
        ref={component => this.refViewLeft = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderFront(color) {
    return (
      <Animated.View
        ref={component => this.refViewFront = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderBack(color) {
    return (
      <Animated.View
        ref={component => this.refViewBack = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderTop(color) {
    return (
      <Animated.View
        ref={component => this.refViewTop = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderBottom(color) {
    return (
      <Animated.View
        ref={component => this.refViewBottom = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
                      <Animated.View key={i} style={[styles.item, {
                          transform: [
                              { perspective: 850 },
                              { scale: 0.9 },
                              { rotateY: '90deg' },
                              { translateX: r },
                              { rotateY: '-90deg' },
                              //{translateX:width*0.5},
                              {
                                  rotateY: this.position.interpolate({
                                      inputRange: [i, i + 1],
                                      outputRange: ['0deg', '-90deg'],
                                  })
                              },
                              { rotateY: '-90deg' },
                              { translateX: r },
                              { rotateY: '90deg' },
                          ]
                      }, i == this.state.faceIndex ? { zIndex: 999 } : (this.state.faceIndex - i == 2 || this.state.faceIndex - i == -2 ? { zIndex: 1 } : { zIndex: 99 })]}>
                          {child}
                      </Animated.View>
                  )
              )

              {this.renderFront('#4c72e0')}
              {this.renderBack('#8697df')}
              {this.renderLeft('#b5bce2')}
              {this.renderRight('#e5afb9')}
              {this.renderTop('#de7c92')}
              {this.renderBottom('#d1426b')}
      </View>
    );
  }
}
