
//
// import React from 'react';
//
// import {
//     StyleSheet,
//     View,
//     Text,
//     Slider,
//     Image,
//     Platform,
// } from 'react-native';
//
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// // import CustomMarker from './CustomMarker';
//
// class DaysetectDemo extends React.Component {
//     state = {
//         sliderOneChanging: false,
//         sliderOneValue: [5],
//         multiSliderValue: [3, 7],
//     };
//
//     sliderOneValuesChangeStart = () => {
//         this.setState({
//             sliderOneChanging: true,
//         });
//     }
//
//     sliderOneValuesChange = (values) => {
//         let newValues = [0];
//         newValues[0] = values[0];
//         this.setState({
//             sliderOneValue: newValues,
//         });
//     }
//
//     sliderOneValuesChangeFinish = () => {
//         this.setState({
//             sliderOneChanging: false,
//         });
//     }
//
//     multiSliderValuesChange = (values) => {
//         this.setState({
//             multiSliderValue: values,
//         });
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.title}>Sliders</Text>
//                 <View style={styles.sliders}>
//                     <View style={styles.sliderOne}>
//                         <Text style={styles.text}>One Marker with callback example:</Text>
//                         <Text style={[styles.text, this.state.sliderOneChanging && {color: 'red' }]}>{this.state.sliderOneValue}</Text>
//                     </View>
//                     <MultiSlider
//                         values={this.state.sliderOneValue}
//                         sliderLength={280}
//                         onValuesChangeStart={this.sliderOneValuesChangeStart}
//                         onValuesChange={this.sliderOneValuesChange}
//                         onValuesChangeFinish={this.sliderOneValuesChangeFinish}
//                     />
//                     <View style={styles.sliderOne}>
//                         <Text style={styles.text}>Two Markers:</Text>
//                         <Text style={styles.text}>{this.state.multiSliderValue[0]}</Text>
//                         <Text style={styles.text}>{this.state.multiSliderValue[1]}</Text>
//                     </View>
//                     <MultiSlider
//                         values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
//                         sliderLength={280}
//                         onValuesChange={this.multiSliderValuesChange}
//                         min={0}
//                         max={10}
//                         step={1}
//                         allowOverlap
//                         snapped
//                         selectedStyle={{
//                             height:10,
//                             backgroundColor: 'red',
//
//                         }}
//                         trackStyle={{
//                             height:10,
//                             // paddingBottom:10,
//                             // backgroundColor: 'red',
//                         }}
//                         markerStyle={{
//                             height: 10,
//                             width: 10,
//                             padding:0,
//                             borderRadius: 1,
//                             slipDisplacement:0,
//                             backgroundColor: 'yellow',
//                         }}
//                         touchDimensions={{
//                             height: 40,
//                             width: 40,
//                             borderRadius: 20,
//                             slipDisplacement: 40,
//                             backgroundColor: 'red',
//                         }}
//                     />
//                 </View>
//                 <Text style={styles.text}>Native RCT Slider</Text>
//                 <Slider style={{width: 280,}}/>
//                 <Text style={styles.text}>Custom Marker</Text>
//                 <MultiSlider
//                     selectedStyle={{
//                         backgroundColor: 'gold',
//                     }}
//                     unselectedStyle={{
//                         backgroundColor: 'silver',
//                     }}
//                     values={[5]}
//                     containerStyle={{
//                         height:40,
//                     }}
//                     trackStyle={{
//                         height:10,
//                         backgroundColor: 'red',
//                     }}
//                     touchDimensions={{
//                         height: 40,
//                         width: 40,
//                         borderRadius: 20,
//                         slipDisplacement: 40,
//                     }}
//                     // customMarker={CustomMarker}
//                     sliderLength={280}
//                 />
//             </View>
//         );
//     }
// }
//
// export default DaysetectDemo;
//
// var styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     sliders: {
//         margin: 20,
//         width: 280,
//     },
//     text: {
//         alignSelf: 'center',
//         paddingVertical: 20,
//     },
//     title: {
//         fontSize: 30,
//     },
//     sliderOne: {
//         flexDirection: 'row',
//         justifyContent: 'space-around'
//     }
// });

//react native 自带的日期选择控件
//import React, { Component } from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import DateTimePicker from '../../common/customDatePicker';
//
// export default class DaysetectDemo extends Component {
//     state = {
//         isDateTimePickerVisible: false,
//     };
//
//     _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
//
//     _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
//
//     _handleDatePicked = (date) => {
//         console.log('A date has been picked: ', date);
//         this._hideDateTimePicker();
//     };
//
//     render () {
//         return (
//             <View style={{ flex: 1 }}>
//                 <TouchableOpacity onPress={this._showDateTimePicker}>
//                     <Text>Show DatePicker</Text>
//                 </TouchableOpacity>
//                 <DateTimePicker
//                     isVisible={this.state.isDateTimePickerVisible}
//                     onConfirm={this._handleDatePicked}
//                     onCancel={this._hideDateTimePicker}
//                     mode={'date'}
//                     datePickerModeAndroid={'spinner'}
//                 />
//             </View>
//         );
//     }
//
// }

//动画效果例子
//
// import React, { Component } from 'react';
// import { Text, TouchableOpacity,StyleSheet,Animated,Easing,View } from 'react-native';
// import {screen} from '../../common/index'
//
// export default class DaysetectDemo extends Component {
//
//
//     constructor () {
//         super()
//         this.animatedValue = new Animated.Value(0)
//     }
//
//     componentDidMount () {
//         this.animate()
//     }
//     animate () {
//         this.animatedValue.setValue(0)
//         Animated.timing(
//             this.animatedValue,
//             {
//                 toValue: 1,
//                 duration: 2000,
//                 easing: Easing.linear
//             }
//         ).start(() => this.animate())
//     }
//
//     render () {
//         const marginLeft = this.animatedValue.interpolate({
//             inputRange: [0, 1],
//             outputRange: [0, 300]
//         })
//         const opacity = this.animatedValue.interpolate({
//             inputRange: [0, 0.5, 1],
//             outputRange: [0, 1, 0]
//         })
//         const movingMargin = this.animatedValue.interpolate({
//             inputRange: [0, 0.5, 1],
//             outputRange: [0, 300, 0]
//         })
//         const textSize = this.animatedValue.interpolate({
//             inputRange: [0, 0.5, 1],
//             outputRange: [18, 32, 18]
//         })
//         const rotateX = this.animatedValue.interpolate({
//             inputRange: [0, 0.5, 1],
//             outputRange: ['0deg', '180deg', '0deg']
//         })
//         return (
//             <View style={styles.container}>
//                 <Animated.View
//                     style={{
//                         marginLeft,
//                         height: 30,
//                         width: 40,
//                         backgroundColor: 'red'}} />
//                 <Animated.View
//                     style={{
//                         opacity,
//                         marginTop: 10,
//                         height: 30,
//                         width: 40,
//                         backgroundColor: 'blue'}} />
//                 <Animated.View
//                     style={{
//                         marginLeft: movingMargin,
//                         marginTop: 10,
//                         height: 30,
//                         width: 40,
//                         backgroundColor: 'orange'}} />
//                 <Animated.Text
//                     style={{
//                         fontSize: textSize,
//                         marginTop: 10,
//                         color: 'green'}} >
//                     Animated Text!
//                 </Animated.Text>
//                 <Animated.View
//                     style={{
//                         transform: [{rotateX}],
//                         marginTop: 50,
//                         height: 30,
//                         width: 40,
//                         backgroundColor: 'black'}}>
//                     <Text style={{color: 'white'}}>Hello from TransformX</Text>
//                 </Animated.View>
//             </View>
//         );
//     }
//
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: 150
//     }
// })

//switch 开关例子
// import React, {Component} from 'react';
// import {
//     AppRegistry,
//
//     StyleSheet,
//     Text,
//     View,
//     Switch,
// } from 'react-native';
//
// export default class SwitchDemo extends Component {
//
//     constructor() {
//         super();
//         this.state = {
//             trueSwitchIsOn: true,
//             falseSwitchIsOn: false,
//         }
//     }
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text>
//                     Swtich实例
//                 </Text>
//                 <Switch
//                     onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
//                     style={{
//                         marginBottom: 10,
//                         marginTop: 10,
//                         width:300,
//                         backgroundColor:'#ff9eaf'
//                     }}
//                     onTintColor={'#4ec1ff'}
//                     thumbTintColor={'#ffffff'}
//                     tintColor={'#4ec1ff'}
//                     value={this.state.falseSwitchIsOn}/>
//                 <Switch
//                     onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
//                     value={this.state.trueSwitchIsOn}/>
//             </View>
//         );
//     }
// };
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
// });

//震动
//
// import React, {Component} from 'react';
// import {
//     AppRegistry,
//     Text,
//     TouchableHighlight,
//     Vibration,
//     Platform,
//     StyleSheet,
//     View,
//     Switch,
// } from 'react-native';
//
// // exports.framework = 'React';
// // exports.title = 'Vibration';
// // exports.description = 'Vibration API';
//
// var pattern, patternLiteral, patternDescription;
// if (Platform.OS === 'android') {
//     pattern = [0, 500, 200, 500];
//     patternLiteral = '[0, 500, 200, 500]';
//     patternDescription = `${patternLiteral}
// arg 0: duration to wait before turning the vibrator on.
// arg with odd: vibration length.
// arg with even: duration to wait before next vibration.
// `;
// } else {
//     pattern = [0, 100];
//     patternLiteral = '[0, 1000, 2000, 3000]';
//     patternDescription = `${patternLiteral}
// vibration length on iOS is fixed.
// pattern controls durations BETWEEN each vibration only.
//
// arg 0: duration to wait before turning the vibrator on.
// subsequent args: duration to wait before next vibrattion.
// `;
// }
//
// export default class DaysetectDemo extends Component {
//     render() {
//         return (
//             <TouchableHighlight
//                     style={styles.wrapper}
//                     onPress={() => Vibration.vibrate( [0, 50,0, 0])}>
//                     <View style={styles.button}>
//                         <Text>Vibrate once</Text>
//                     </View>
//                 </TouchableHighlight>
//         );
//     }
// }
// exports.examples = [
//     {
//         title: 'Pattern Descriptions',
//         render() {
//             return (
//                 <View style={styles.wrapper}>
//                     <Text>{patternDescription}</Text>
//                 </View>
//             );
//         },
//     },
//     {
//         title: 'Vibration.vibrate()',
//         render() {
//             return (
//                 <TouchableHighlight
//                     style={styles.wrapper}
//                     onPress={() => Vibration.vibrate()}>
//                     <View style={styles.button}>
//                         <Text>Vibrate</Text>
//                     </View>
//                 </TouchableHighlight>
//             );
//         },
//     },
//     {
//         title: `Vibration.vibrate(${patternLiteral})`,
//         render() {
//             return (
//                 <TouchableHighlight
//                     style={styles.wrapper}
//                     onPress={() => Vibration.vibrate(pattern)}>
//                     <View style={styles.button}>
//                         <Text>Vibrate once</Text>
//                     </View>
//                 </TouchableHighlight>
//             );
//         },
//     },
//     {
//         title: `Vibration.vibrate(${patternLiteral}, true)`,
//         render() {
//             return (
//                 <TouchableHighlight
//                     style={styles.wrapper}
//                     onPress={() => Vibration.vibrate(pattern, true)}>
//                     <View style={styles.button}>
//                         <Text>Vibrate until cancel</Text>
//                     </View>
//                 </TouchableHighlight>
//             );
//         },
//     },
//     {
//         title: 'Vibration.cancel()',
//         render() {
//             return (
//                 <TouchableHighlight
//                     style={styles.wrapper}
//                     onPress={() => Vibration.cancel()}>
//                     <View style={styles.button}>
//                         <Text>Cancel</Text>
//                     </View>
//                 </TouchableHighlight>
//             );
//         },
//     },
// ];
// var styles = StyleSheet.create({
//     wrapper: {
//         borderRadius: 5,
//         marginBottom: 5,
//     },
//     button: {
//         backgroundColor: '#eeeeee',
//         padding: 10,
//     },
// });


// import React, {Component} from 'react'
// import {Dimensions, StyleSheet, Text, View, ImageBackground, ART, PanResponder} from 'react-native';
//
// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
// import ReactScrollRuler from '../Common/ReactScrollRuler'
// var block;
// var movexTemp=0;
// export default class DaysetectDemo extends Component {
//
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             paintStartX:0,
//             paintStartY:10,
//             paint2StartX: 20,
//             paint2StartY: 10,
//             paint3StartX: 10,
//             paint3StartY: 20,
//
//         };
//     }
//     componentDidMount() {
//         block=Math.floor((screenWidth*0.95-20)/10);
//         this.setState({
//             paintStartX: 55-20,
//             paint2StartX: 55,
//             paint3StartX: 55-10,
//         });
//     }
//
//     tempDx = 0;
//     selectValue=0;
//     responder = PanResponder.create({
//         onStartShouldSetResponder: (evt, gestureState) => false,
//         onStartShouldSetResponderCapture: (evt, gestureState) => false,
//         onMoveShouldSetPanResponder: (evt, gestureState) => true,
//         onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
//             return true;
//         },
//         _onPanResponderTerminationRequest: (evt, gestureState) => false,
//         onPanResponderGrant: (evt, gestureState) => {
//
//         },
//         onPanResponderMove: (evt, {dx, dy}) => {
//             if (this.selectValue >= 0 && this.selectValue <= 50) {
//                 if ((this.selectValue===0&&dx<0)||(this.selectValue===50&&dx>0)||(this.state.paintStartX + dx - this.tempDx<0||this.state.paintStartX + dx - this.tempDx>350)){
//                     return
//                 } else {
//                     this.setState({
//                         paintStartX: this.state.paintStartX + dx - this.tempDx,
//                         paint2StartX: this.state.paint2StartX + dx - this.tempDx,
//                         paint3StartX: this.state.paint3StartX + dx - this.tempDx,
//                     });
//                 }
//                 this.tempDx = dx;
//             }
//         },
//         onPanResponderRelease: (evt, {vx, vy}) => {
//             this.tempDx = 0;
//             let bottomPointX = Math.floor(this.state.paint2StartX / block) * block + 20;
//             this.selectValue=Math.floor(this.state.paint2StartX / block)*5;
//             this.setState({
//                 paintStartX: bottomPointX-20,
//                 paint2StartX: bottomPointX,
//                 paint3StartX: bottomPointX-10,
//             });
//             this.props.onSelect?this.props.onSelect( this.selectValue):'';
//         },
//     });
//
//     dashLine() {
//         var Line = [];
//         var Num = [];
//         var line = {};
//         for (var i = 0, k = 0; i <= 50; i++) {
//             if (i % 10 === 0) { //整值
//                 //整值竖线
//                 Line.push(<Text key={i} style={{width: 1, height: 8, backgroundColor: '#ffffff',}}> </Text>);
//                 //整值文字
//                 Num.push(<Text  key={i} style={{color: '#fff'}}>{k===0?0.25:k}</Text>);
//                 k += 10;
//             } else if (i % 5 === 0) {
//                 Line.push(<Text  key={i} style={{width: 1, height: 4, backgroundColor: '#ffffff',}}> </Text>)
//             } else {
//                 //中间小刻度
//                 // Line.push(<Text style={{width: 1, height: 4, backgroundColor: '#13ff0a',}}> </Text>)
//             }
//         }
//         line.Line = Line;
//         line.Num = Num;
//
//         return line
//     }
//
//     render() {
//         const path = ART.Path()
//             .moveTo(this.state.paintStartX, this.state.paintStartY)
//             .lineTo(this.state.paint2StartX, this.state.paint2StartY)
//             .lineTo(this.state.paint3StartX, this.state.paint3StartY)
//             .close();
//
//         return (
//             <View  style={{width: Math.floor(screenWidth*0.95), height: 50, backgroundColor: "#06539c", alignSelf: 'center'}}>
//
//                 {/*<ART.Surface width={Math.floor(screenWidth*0.95)} height={23}*/}
//                              {/*style={{*/}
//                                  {/*paddingLeft: 10,*/}
//                                  {/*paddingRight: 10,*/}
//                                  {/*alignSelf: 'center'*/}
//                              {/*}}*/}
//                 {/*>*/}
//                     {/*<ART.Shape d={path} stroke="#fd0f0f" fill="#fd0f0f" strokeWidth={1}/>*/}
//                 {/*</ART.Surface>*/}
//                 <ImageBackground
//                     {...this.responder.panHandlers}
//                     style={{width: 50, height: 50,alignItems:'center',justifyContent:'center'}}
//                     tintColor={'#ff3b5b'}
//                     marginLeft={10}
//                     source={require('../../img/mine/blackboard9.png')}>
//                     <Text style={{color:'#fff',marginLeft:20}}>45km</Text>
//                 </ImageBackground>
//                 <View style={{height: 30, alignItems: 'center', justifyContent: 'center'}}>
//                     <View style={{
//                         flexDirection: 'row',
//                         paddingLeft: 10,
//                         paddingRight: 10,
//                         width: Math.floor(screenWidth*0.95),
//                         backgroundColor: '#d8ffff00',
//                         justifyContent: 'space-between',
//                         alignItems: 'flex-end',
//                         alignSelf:'center'
//                     }}>
//                     </View>
//                 </View>
//             </View>
//         )
//     }
//
// }



import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    LayoutAnimation,
    Dimensions, PanResponder,
} from 'react-native';
import {screen} from '../../common/index'
const width = screen.width*0.95;


export default class Iridescent extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    })
    constructor(props: Props) {
        super(props);

        this.state = {
            LeftWidth:width/2,
            sliderWidth:50,
            Value:5,
            sliderColor:'#ffffff'
        };

        this.count = 0;
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }

    tempDx = 0;
    selectValue=0;
    responder = PanResponder.create({
        onStartShouldSetResponder: (evt, gestureState) => false,
        onStartShouldSetResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
            return true;
        },
        _onPanResponderTerminationRequest: (evt, gestureState) => false,
        onPanResponderGrant: (evt, gestureState) => {
            //获取到触发点在屏幕的位置
            console.warn(gestureState.moveX);
        },
        onPanResponderMove: (evt, {dx, dy}) => {
            // dx>0?this.setState({sliderColor:'#57ff1f'}):this.setState({sliderColor:'#ff2d9e'});

            // this.setState({LeftWidth:this.state.LeftWidth+dx})
            let selectedValue = width / 10;
            // console.warn(selectedValue);
            this.setState({
                LeftWidth: this.state.LeftWidth + dx - this.tempDx,
            });
            this.tempDx = dx;
        },
        onPanResponderRelease: (evt, {vx, vy}) => {
            this.tempDx = 0;
            // let bottomPointX = Math.floor(this.state.paint2StartX / block) * block + 20;
            // this.selectValue=Math.floor(this.state.paint2StartX / block)*5;
            // this.setState({
            //     paintStartX: bottomPointX-20,
            //     paint2StartX: bottomPointX,
            //     paint3StartX: bottomPointX-10,
            // });
            // this.props.onSelect?this.props.onSelect( this.selectValue):'';
        },
    });
    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <View
                        style={{
                            overflow: 'hidden',
                            height: 1,
                            width: this.state.LeftWidth,
                            backgroundColor: '#ffffff',
                            borderRadius: 5,
                        }}
                    />
                    <View
                        {...this.responder.panHandlers}
                        style={{
                            height:20,
                            width: this.state.sliderWidth,
                            borderRadius:5,
                            backgroundColor: this.state.sliderColor,
                            paddingBottom: 10,
                            alignItems:'center',
                            justifyItems:'center',
                        }}>
                        <Text style={{color:'#487eff'}}>{this.state.Value}Km</Text>
                    </View>
                    <View
                        style={{
                            overflow: 'hidden',
                            height: 1,
                            width: width * 0.95-this.state.LeftWidth-this.state.sliderWidth,
                            backgroundColor: '#ffffff',
                            borderRadius: 5,
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6697ff',
    },
});





























