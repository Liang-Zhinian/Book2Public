import React from 'react';
import {
    BVLinearGradient,
    Image,
    PanResponder,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {screen} from '../../common/index'
import LinearGradient from 'react-native-linear-gradient';
import Swiper from "../demo&test/Swiper";

export default class FAQScene extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    })
    constructor(props: Props) {
        super(props);

        this.state = {
            LeftWidth:screen.width*0.95/2,
            sliderWidth:20,
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
            // console.warn(gestureState.moveX);
        },
        onPanResponderMove: (evt, {dx, dy}) => {
            console.warn(dx);
            // this.setState({LeftWidth:this.state.LeftWidth+dx})
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
           <Swiper>
               <View style={{backgroundColor:'#4cccff',width:15}}><Text>a</Text></View>
               <View style={{backgroundColor:'#70ffa5',width:15}}><Text>b</Text></View>
               <View style={{backgroundColor:'#ffa991',width:15}}><Text>c</Text></View>
               <View style={{backgroundColor:'#ff31ce',width:15}}><Text>d</Text></View>
               <View style={{backgroundColor:'#93ff60',width:15}}><Text>e</Text></View>
               <View style={{backgroundColor:'#933cff',width:15}}><Text>f</Text></View>
               <View style={{backgroundColor:'#4cccff',width:15}}><Text>g</Text></View>
               <View style={{backgroundColor:'#70ffa5',width:15}}><Text>h</Text></View>
               <View style={{backgroundColor:'#ffa991',width:15}}><Text>i</Text></View>
               <View style={{backgroundColor:'#ff31ce',width:15}}><Text>j</Text></View>
               <View style={{backgroundColor:'#93ff60',width:15}}><Text>k</Text></View>
               <View style={{backgroundColor:'#933cff',width:15}}><Text>l</Text></View>
           </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6697ff',
    },
    linearGradient: {
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop:screen.statusBarHeight,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
    },
});