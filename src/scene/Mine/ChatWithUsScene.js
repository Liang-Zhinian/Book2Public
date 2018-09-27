import React from 'react';
import {BVLinearGradient, PanResponder, StyleSheet,} from 'react-native';
import {screen} from '../../common/index'


import App from '../demo&test/GryoscopeImage/App'


export default class ChatWithUsScene extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
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
        const shadowOpt = {
            width:160,
            height:170,
            color:"#ff0200",
            border:2,
            radius:3,
            opacity:0.2,
            x:0,
            y:10,
            style:{marginVertical:5}
        }
        //<LinearGradient colors={screen.colorTemp}
        //                             start={{x: 0, y: 0}}
        //                             end={{x: 1, y: 1}}
        //                             style={[styles.linearGradient]}>
        //                 <View style={{
        //                     alignItems: 'center',
        //                     justifyContent:'space-between',
        //                     flexDirection: 'row',
        //                     width: screen.width,
        //                 }}>
        //                     <TouchableOpacity activeOpacity={0.5} onPress={() => {
        //                         this.props.navigation.goBack();
        //                     }}>
        //                         <Image source={require('../../img/mine/icon_homepage_left_arrow.png')}
        //                                style={[styles.callbackIcon, {}]}
        //                                onPress={() => {
        //                                    this.props.navigation.goBack();
        //                                }}
        //                         />
        //                     </TouchableOpacity>
        //                     <Text style={{color:'#fff'}}>FAQ</Text>
        //                     <TouchableOpacity activeOpacity={0.5} onPress={() => {
        //                         this.props.navigation.goBack();
        //                     }}>
        //                         <View  style={[styles.callbackIcon, {}]}/>
        //                     </TouchableOpacity>
        //                 </View>
        //                 <App/>
        //             </LinearGradient>
        return (
            <App/>
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