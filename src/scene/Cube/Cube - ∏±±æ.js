import React, {Component} from 'react';
import {Animated, Dimensions, PanResponder, StyleSheet, Easing, View,} from 'react-native';
import screen from "../../common/screen";
// import SearchBox from './SearchBox'
const styles = StyleSheet.create({
    container: {
        width:Math.round(screen.width) ,
        height: Math.round(screen.width),
        backgroundColor: '#8ec9ff00',
        // padding: 100
    },
    item: {
        position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
    },

});

type
Props = {
    navigation: any,
    touchState: any
}

type
State = {
    discounts: Array < Object >,
    dataList: Array < Object >,
    refreshing: boolean,
}
export default class Cube extends Component {
    // static navigationOptions = ({ navigation }: any) => ({
    //     headerTitle: (
    //         <SearchBox navigation={navigation}  />
    //         // <SearchBox navigation={navigation} onChangeText={(text) => { navigation.state.params.onChangeSeachBoxText(text) }} />
    //     ),
    //     headerLeft: (
    //         <View style={styles.icon}>
    //         </View>
    //     ),
    //     headerRight: (
    //         <View style={styles.icon}>
    //         </View>
    //     ),
    //     headerStyle: { backgroundColor: 'red' },
    // })


    position = new Animated.Value(0);//当前在那一页
    positionValue = 0;

    constructor(props) {
        super(props);

        this.state = {
            width: null,
            faceIndex: 0,
            colORrow: false,
            r: 0,
            res: 0,
            slide: false,
            touchstate: true,
        }

        this.position.addListener(v => {
            this.positionValue = v.value;
        });
    }

    direction = -1
    directionZ = -1
    responder = PanResponder.create({
        onStartShouldSetResponder: (evt, gestureState) => false,
        onStartShouldSetResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
            return true;
        },
        _onPanResponderTerminationRequest: (evt, gestureState) => false,
        onPanResponderGrant: (evt, gestureState) => {
            this.position.setOffset(this.positionValue);
            this.props.position?this.position.setValue(this.props.position):this.position.setValue(0);
        },
        onPanResponderMove: (evt, {dx, dy}) => {
            if (this.direction === -1) {
                this.touchtime = setTimeout(() => {
                    // console.warn(dx,dy);
                    if (Math.abs(dx) > Math.abs(dy)) {
                        this.setState({colORrow: false});//水平滚动
                        this.directionZ=1;
                    } else {
                        this.setState({colORrow: true});//垂直滚动
                        this.directionZ=0;
                    }
                    clearTimeout(this.touchtime)
                }, 10);
                this.direction=0
            }

            if (this.directionZ===1) {
                dy = 0
            } else if (this.directionZ===0) {
                dx = 0
            }

            // if (this.direction != 1 && Math.abs(dx) > Math.abs(dy)){
            //     this.direction = 1;
            //     dy = 0;
            // }
            //
            // if (this.direction == 1 && !this.set)
            //     dy = 0;
            //
            // if (this.directionZ != 0 && Math.abs(dx) < Math.abs(dy) ){
            //     this.directionZ = 0;
            //     dx = 0;
            // }
            //
            // if (this.directionZ == 0 && !this.set)
            //     dx = 0;
            //
            // if (this.directionZ===0&&this.direction===1)
            //     dx = 0;

            if (Math.abs(dx)<screen.width&&Math.abs(dy)<screen.width) {
                if (Math.abs(dx) > Math.abs(dy)) {//   &&(Math.abs(dx) - Math.abs(dy))>Math.abs(dx)
                    if (dx < 0) {
                        //向左
                        this.props.changeRightPage ? this.props.changeRightPage() : '';
                        this.setState({slide: true});
                    } else {
                        //向右
                        this.props.changeLeftPage ? this.props.changeLeftPage() : '';
                        this.setState({slide: false});
                    }
                    this.position.setValue(dx / -this.state.width);
                    // if ((Math.abs(dx) - Math.abs(dy)) < Math.abs(dx)) {
                    //     this.setState({colORrow: false})//水平滚动
                    // }
                } else if (Math.abs(dx) < Math.abs(dy)) {//   &&(Math.abs(dy) - Math.abs(dx))>Math.abs(dy)
                    if (dy < 0) {
                        //向上
                        this.props.changeUpPage ? this.props.changeUpPage() : '';
                        this.setState({slide: true});
                    } else {
                        //向下
                        this.props.changeBottomPage ? this.props.changeBottomPage() : '';
                        this.setState({slide: false});
                    }
                    this.position.setValue(dy / -this.state.width);
                    // if ((Math.abs(dy) - Math.abs(dx)) < Math.abs(dy)) {
                    //     this.setState({colORrow: true});//垂直滚动
                    // }


                }
            }
            // this.position.setValue(dx / -this.state.width);
        },
        onPanResponderRelease: (evt, {vx, vy}) => {
            this.direction = -1
            this.directionZ = -1
            // if (Math.abs(this.state.faceIndex)>=3) this.setState(({faceIndex: this.state.faceIndex % 4}));
            this.state.colORrow === true ? (vx = vy) : vx = vx
            this.position.flattenOffset();
            const childrenCount = React.Children.count(this.props.children);
            // const left = Math.max(0,Math.floor(this.positionValue));
            // const right = Math.min(childrenCount-1,left+1);
            const left = Math.floor(this.positionValue);
            const right = left + 1;
            let result;
            if (vx > 0.05) {
                result = left;
                //左滑动
                this.setState({slide: false});
                // console.warn(this.props.position);
                this.props.reduceface()// ? ()=>{ this.props.reduceface()} : ''
                // this.setState({faceIndex: this.state.faceIndex+1 })
            } else if (vx < -0.05) {
                result = right;
                //右滑动
                this.setState({slide: false});
                // console.warn(this.props.position)
                this.props.addface()// ? ()=>{this.props.addface()} : ''
                // this.setState({faceIndex: this.state.faceIndex-1 })
            } else {
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

            this.props.touchState?this.props.touchState():'';

            result = result % childrenCount + childrenCount;
            if (result > 4) result -= 4;
            this.setState({faceIndex: result}, () => {
                // console.log(this.state.faceIndex, result);
            })
        },
    });
    onLayout = (ev) => {
        // const width = ev.nativeEvent.layout.width;
        const width = Dimensions.get('window').width;

        if (width !== this.state.width) {
            this.setState({
                width: width,
            });
        }
    };

    runDeg(colORrow, i, r) {
        var transform = {};
        if (!colORrow) {

            transform = {
                transform: [
                    // {perspective: 1000},
                    {scale:0.8},
                    {rotateY: '90deg'},
                    {translateX: r},
                    {rotateY: '-90deg'},
                    {
                        rotateY: this.position.interpolate({
                            inputRange: [i, i + 1],
                            outputRange: ['0deg', '-90deg'],
                        })
                    },
                    {rotateY: '-90deg'},
                    {translateX: r},
                    {rotateY: '90deg'},
                ]
            }

        } else {
            transform = {
                transform: [
                    // {perspective: 1000},
                    {scale:0.8},
                    {rotateX: '90deg'},
                    {translateY: -r},
                    {rotateX: '-90deg'},
                    {
                        rotateX: this.position.interpolate({
                            inputRange: [i, i + 1],
                            outputRange: ['0deg', '90deg'],
                        })
                    },
                    {rotateX: '-90deg'},
                    {translateY: -r},
                    {rotateX: '90deg'},
                ]
            }
        }
        return transform
    }

    render() {
        const {style, children} = this.props;
        const {width} = this.state;
        if (!width) {
            {/*<View style={[].concat(style, styles.container)} onLayout={this.onLayout}></View>*/
            }
        }
        // console.warn("----"+Math.round(screen.width*0.8));
        // console.warn("*****"+Math.round(screen.width)*0.8);
        const r = Math.round(screen.width)/2+Math.round(screen.width*0.8)/2/2/2-6;//-screen.width*0.8*0.8/2;
        return (
            <View
                style={[{perspective: 1000},].concat( styles.container)}
                onLayout={this.onLayout}
                {...this.responder.panHandlers}
            >
                {
                    React.Children.map(children, (child, i) => {
                        // console.log(this.state.faceIndex)
                        return (
                            <Animated.View

                                key={i} style={[styles.item,  {width:Math.round(screen.width),height:Math.round(screen.width)},
                                this.runDeg(this.state.colORrow, i, r),
                                i == Math.abs(this.state.faceIndex) ? {zIndex: 999} : (this.state.faceIndex - i == 2 || this.state.faceIndex - i == -2 ? {zIndex: 1} : (this.state.slide == true ? (this.state.faceIndex - i == 1 || this.state.faceIndex - i == -3 ? {zIndex: 80} : {zIndex: 99}) : (this.state.faceIndex - i == -1 || this.state.faceIndex - i == 3 ? {zIndex: 80} : {zIndex: 99}):{zIndex: 99}))]}>
                                {child}

                            </Animated.View>
                        )
                    })
                }
            </View>
        )
    }

    flipLeft(result) {
        this.setState({res: 0});
        const childrenCount = React.Children.count(this.props.children);
        // this.setState({slide: true})
        if (result>0){
            this.position.setValue(result-1)
        }
        Animated.timing(
            this.position,
            {
                toValue: result,
                duration: 900,
                easing: Easing.linear    //linear, ease, quad, cubic, sin, elastic, bounce, back, bezier, in, out, inout
            }
        ).start();

        // Animated.spring(this.position, {
        //     toValue: result,
        // }).start();

        // this.props.release({func:flipRight()});
        this.setState({faceIndex: result % childrenCount})

        this.setState({res: result});
    }


    flipLeftIndex(result) {
        // this.setState({slide: true})
        this.setState({res: 0});
        const childrenCount = React.Children.count(this.props.children);

        if (0 === result) {

            Animated.spring(this.position, {
                // duration: 1000,
                toValue: 4,
                easing: Easing.back,
            }).start(() => {
                this.position.setValue(result);
            })
        }
        else {
            Animated.spring(this.position, {
                // duration: 2000,
                toValue: result,
            }).start();
        }

        // this.props.release({func:flipRight()});
        this.setState({faceIndex: result % childrenCount})

        this.setState({res: result});

        // this.position.setValue(0);
        // this.position = new Animated.Value(0);
    }

    flipRight(result) {
        const childrenCount = React.Children.count(this.props.children);
        Animated.spring(this.position, {
            toValue: result,
        }).start();
        this.props.release(result);
        if (result <= -3) {
            this.setState({faceIndex: result % childrenCount + childrenCount})
        } else {
            this.setState({faceIndex: result % childrenCount})
        }
        this.setState({res: result});
    }
}