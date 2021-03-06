import React from 'react';
import {AsyncStorage, BVLinearGradient, PanResponder, StyleSheet, Text, Vibration, View,} from 'react-native';
import {screen} from '../../common/index'
import * as ScreenUtil from "./ScreenUtil";
import {commonStyle} from "../../widget/commonStyle";
import LinearGradient from "react-native-linear-gradient";

const width = screen.width*0.86;


export default class Slider extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            initialValue:1,//(初始值)
            leftWidth:width/2,//左边直线长度
            sliderWidth:50,//滑块宽度
            sliderValue:5,//滑块值
            sliderColor:'#309bff',//滑块颜色
            totalScale:10,//总刻度
            initialValueState:true,
        };
        this.count = 0;
    }

    static defaultProps = {
        stickBackgroundColor: '#309bff',
        scrollEnabled: true,
    };

    calculationProps(){
        this.setState({
            leftWidth:width / this.state.totalScale*this.state.initialValue-screen.onePixel*8,
        })
    }

    componentDidMount() {
        this.calculationProps()
    }
    getLatLngLog(){
        try {
            AsyncStorage.getItem(
                'LatLngLog',
                (error,result)=>{
                    if (error||result==null){

                    }else{
                        let LatLngLog=JSON.parse(result);
                        let temp = parseFloat(LatLngLog[2])===0?0.25:parseFloat(LatLngLog[2]);
                        this.setState({
                            initialValue: temp,
                        });
                    }
                    this.calculationProps()
                }
            );
        }catch(error){
            console.warn('获取历史经纬度失败,重新获取当前位置经纬度'+error);
        }
    }
    componentWillMount () {
        this.getLatLngLog();
    }

    componentWillUnmount() {
    }

    tempDx = 0;
    moveX=0;//起始触发点在屏幕的位置
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
            this.moveX = gestureState.moveX//-(screen.width-width);//获取到忽略样式间距的起始位置
            this.props.onPress?this.props.onPress(0):'';
        },
        onPanResponderMove: (evt, {dx, dy}) => {
            // let selectedValue =  (this.moveX+dx)/ (width/ this.state.totalScale);
            // dx>0?this.setState({sliderColor:'#57ff1f'}):this.setState({sliderColor:'#ff2d9e'});

            // this.setState({leftWidth:this.state.leftWidth+dx})
            // let selectedValue = width / this.state.totalScale;
            if (this.state.initialValue<=0&&dx<0||(this.state.initialValue>=10&&dx>0)){
                return
            }
            let tempValue=parseInt(((this.state.leftWidth + dx - this.tempDx))/ (width/ this.state.totalScale)*10)/10;
            this.setState({
                initialValueState:false,
                leftWidth: this.state.leftWidth + dx - this.tempDx,
                initialValue:tempValue<0?0:(tempValue>=10?10:tempValue)
            }, ()=>{
                this.props.onSelect && this.props.onSelect( this.state.initialValue );
            });
            this.tempDx = dx;
            // this.props.onSelect?this.props.onSelect( parseInt(((this.state.leftWidth + dx - this.tempDx))/ (width/ this.state.totalScale)*10)/10):'';
        },
        onPanResponderRelease: (evt, {vx, vy}) => {
            this.setState({ initialValueState:true})
            Vibration.vibrate( [0, 10,0, 0]);
            let sliderValueList = [];
            let v=0;
            for (let i = 0;i<=this.state.totalScale;i++){
                sliderValueList.push(i)
                v=v+5;
            }
            if (this.state.initialValue<=0){
                    this.setState({
                        initialValue: this.state.initialValue + (Math.round((0-this.state.initialValue) * 10) / 10),
                        leftWidth: this.state.leftWidth + (width / this.state.totalScale / 10)*Math.round((0-this.state.initialValue )* 10)-screen.onePixel*8
                    },()=>{
                        this.props.onSelect?this.props.onSelect( this.state.initialValue):'';
                    })
            } else if (this.state.initialValue>=10){
                this.setState({
                    initialValue: this.state.initialValue - (Math.round((this.state.initialValue-10) * 10) / 10),
                    leftWidth: this.state.leftWidth - (width / this.state.totalScale / 10)*Math.floor((this.state.initialValue-10 )* 10)-screen.onePixel*8
                },()=>{
                    this.props.onSelect?this.props.onSelect( this.state.initialValue):'';
                })
            }
            // function sortarr(arr){
            //     for(i=0;i<arr.length-1;i++){
            //         for(j=0;j<arr.length-1-i;j++){
            //             if(arr[j]>arr[j+1]){
            //                 var temp=arr[j];
            //                 arr[j]=arr[j+1];
            //                 arr[j+1]=temp;
            //             }
            //         }
            //     }
            //     return arr;
            // }
            // sliderValueList.push(this.state.initialValue);
            // sortarr(sliderValueList);
            // let sliderValueIndex = sliderValueList.indexOf(this.state.initialValue);
            // if (sliderValueIndex !== 0 || sliderValueIndex !== this.state.initialValue) {
            //    let lastDiffer =  Math.abs(sliderValueList[sliderValueIndex - 1] - sliderValueList[sliderValueIndex]);
            //    let nextDiffer =  Math.abs(sliderValueList[sliderValueIndex + 1] - sliderValueList[sliderValueIndex]);
            //    if (lastDiffer===nextDiffer){
            //
            //    } else if (lastDiffer>nextDiffer){
            //        for (let i = 0; i <= Math.round(nextDiffer * 10); i++) {
            //            this.setState({
            //                initialValue: this.state.initialValue + (Math.round(nextDiffer * 10) / 10),
            //                 leftWidth:this.state.leftWidth+(width / this.state.totalScale/10)
            //            })
            //        }
            //    }else  if (lastDiffer<nextDiffer){
            //        this.setState({
            //            initialValue: this.state.initialValue - (Math.round(lastDiffer * 10) / 10),
            //            leftWidth:this.state.leftWidth-(width / this.state.totalScale/10)
            //            // leftWidth:this.state.leftWidth+(Math.round(nextDiffer * 10) / 10)*
            //        })
            //    }
            // }


            this.tempDx = 0;
            this.props.onSelect&&this.props.onSelect( this.state.initialValue);
            this.props.onPress&&this.props.onPress(1);
        },
    });
    render() {
            // this.props.onSelect?this.props.onSelect( this.state.initialValue):'';
        return (
            <View style={[styles.container,{backgroundColor:this.props.backgroundColor}]}>
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
                            height: 1.5,
                            width: width,
                            backgroundColor: this.props.stickBackgroundColor,
                            borderRadius: 5,
                        }}
                    />
                    <View
                        {...this.responder.panHandlers}
                        style={{
                            position: 'absolute',
                            left: this.state.leftWidth,
                            width: screen.width - width,
                            backgroundColor: '#fff0',
                            paddingTop: 5,
                            paddingBottom: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 999
                        }}>
                        <LinearGradient
                            colors={screen.sliderColor}
                            start={{x: 1, y: 1}}
                            end={{x: 0, y: 1}}
                            style={{
                                flex: 1,
                                // backgroundColor: "#000",
                                width: screen.width - width,
                                alignItems: 'center',
                                borderRadius: 5,
                                borderWidth: screen.onePixel * 2,
                                borderColor: '#F4CAD8',
                            }}>
                            <Text style={{
                                color: '#ffffff',
                                fontSize: ScreenUtil.setSpText(13),
                                fontFamily: 'arial'
                            }}>{this.state.initialValue * 5 === 0 ? 0.25 : this.state.initialValue * 5} km</Text>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0000005e',
        height:32,
        width:screen.width,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center'
    },
});

