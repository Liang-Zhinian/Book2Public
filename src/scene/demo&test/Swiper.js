import React, {
    Component
} from 'react';
import {
    View,
    Animated,
    PanResponder,
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        height: 240,
        backgroundColor: 'gray',
    },
    item: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});

export default class Swiper extends Component {
    position = new Animated.Value(0); //当前在那一页
    positionValue = 0;
    state = {
        width: null,
    };

    //构造函数
    constructor(props) {
        super(props);
        //记录滚动的位置
        this.position.addListener(v => {
            this.positionValue = v.value;
        });
    }

    responder = PanResponder.create({
        //前两天 用户点击的时候 出发回调事件
        onStartShouldSetPanResponder: (evt, gestureState) => false,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        //用户滑动的时候 出发的回调事件
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        //是否阻碍原声
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值， 决定当前组件是否应该阻止原生组件成为js响应者
            // 默认返回true。 目前暂时只支持android
            return true;
        },
        onPanResponderTerminationRequest: (evt, gestureState) => false,
        //开始处理触摸事件
        onPanResponderGrant: (evt, gestureState) => {
            //每次已记录的位置开始
            this.position.setOffset(this.positionValue);
            this.position.setValue(0);
        },
        //触摸事件移动的时候
        // onPanResponderMove: Animated.event([
        //  null, {
        //      dx: this.value
        //  },
        // ]),
        //触摸事件移动的时候
        onPanResponderMove: (evt, {
            dx
        }) => {
            this.position.setValue(dx / -this.state.width);
        },
        //触摸事件释放的时候 ,也就是 松手的时候
        onPanResponderRelease: (evt, {
            vx
        }) => {
            this.position.flattenOffset();
            const childrenCount = React.Children.count(this.props.children);
            //限制移动 不能循环
            // const left = Math.max(0, Math.floor(this.positionValue));
            // const right = Math.min(childrenCount - 1, left + 1);
            //循环 不在限制移动
            const left = Math.floor(this.positionValue);
            const right = left + 1;

            let result;
            if (vx > 0.05) {
                result = left;
            } else if (vx < -0.05) {
                result = right;
            } else {
                result = Math.round(this.positionValue);
            }

            //循环的判断条件
            if (result < 0) {
                result += childrenCount;
                this.position.setValue(this.positionValue + childrenCount);
            } else if (result >= childrenCount) {
                result -= childrenCount;
                //位置也调整过去
                this.position.setValue(this.positionValue - childrenCount);
            }

            Animated.spring(this.position, {
                toValue: result,
            }).start();
        },

    });

    onLayout = (ev) => {
        const width = ev.nativeEvent.layout.width;
        if (width != this.state.width) {
            this.setState({
                width,
            });
        }
    };
    render() {
        const {
            style,
            children
        } = this.props;
        const {
            width
        } = this.state;
        if (!width) {
            <View style={[].concat(style, styles.container)} onLayout={this.onLayout} />
        }
        //3d 旋转的中心, 半径 决定间距 Math.sqrt(3) * width;，间隙更远
        const r = Math.sqrt(3) / 2 * width;

        return (
            <View style={[].concat(style, styles.container)}
                  onLayout={this.onLayout}
                  {...this.responder.panHandlers}
            >
                {
                    React.Children.map(children, (child, i) => {
                        return (
                            <Animated.View key={i} style={[styles.item, {
                                transform: [
                                    //透视
                                    {perspective: 850},
                                    {scale: 0.8},

                                    //希望实现 {translateZ: r}
                                    {rotateY: '90deg'},
                                    {translateX: r},
                                    {rotateY: '-90deg'},
                                    // 2d 平移
                                    // {translateX: this.position.interpolate({
                                    // inputRange: [i,i+1],
                                    // outputRange: [0, -width],
                                    // })}
                                    //3d 旋转
                                    {
                                        rotateY: this.position.interpolate({
                                            inputRange: [i, i+1],
                                            outputRange: ['0deg','-30deg'],
                                        })
                                    },
                                    {rotateY: '-90deg'},
                                    {translateX: r},
                                    {rotateY: '90deg'},
                                ],
                            }]}>
                                {child}
                            </Animated.View>
                        )
                    })
                }
            </View>
        );
    }
}