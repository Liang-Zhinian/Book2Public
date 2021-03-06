
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Vibration,
    LayoutAnimation,
    Dimensions, PanResponder,
} from 'react-native';
import {screen} from '../../common/index'
const width = screen.width*0.9;


export default class Slider extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            initialValue:1,//(初始值)
            leftWidth:width/2,//左边直线长度
            sliderWidth:50,//滑块宽度
            sliderValue:5,//滑块值
            sliderColor:'#ffcfde',//滑块颜色
            totalScale:10,//总刻度
        };
        this.count = 0;
    }

    calculationProps(){
        this.setState({
            leftWidth:width / this.state.totalScale*this.state.initialValue,
        })
    }
    componentWillMount () {
        this.setState({
            initialValue:this.props.initialValue,
        },()=>{
            this.calculationProps()
        });

    }
    componentDidMount() {
        // console.log(this.props.defaultSliderValue)
        // this.setState({
        //     initialValue:this.props.defaultSliderValue,
        // });
        // this.calculationProps()
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
            this.setState({
                leftWidth: this.state.leftWidth + dx - this.tempDx,
                initialValue:parseInt(((this.state.leftWidth + dx - this.tempDx))/ (width/ this.state.totalScale)*10)/10
            }, ()=>{
                this.props.onSelect && this.props.onSelect( this.state.initialValue );
            });
            this.tempDx = dx;
            // this.props.onSelect?this.props.onSelect( parseInt(((this.state.leftWidth + dx - this.tempDx))/ (width/ this.state.totalScale)*10)/10):'';
        },
        onPanResponderRelease: (evt, {vx, vy}) => {
            Vibration.vibrate( [0, 10,0, 0]);
            let sliderValueList = [];
            let v=0;
            for (let i = 0;i<=this.state.totalScale;i++){
                sliderValueList.push(i)
                v=v+5;
            }
            if (this.state.initialValue<0){
                    this.setState({
                        initialValue: this.state.initialValue + (Math.round((0-this.state.initialValue) * 10) / 10),
                        leftWidth: this.state.leftWidth + (width / this.state.totalScale / 10)*Math.round((0-this.state.initialValue )* 10)
                    },()=>{
                        this.props.onSelect?this.props.onSelect( this.state.initialValue):'';
                    })
            } else if (this.state.initialValue>10){
                this.setState({
                    initialValue: this.state.initialValue - (Math.round((this.state.initialValue-10) * 10) / 10),
                    leftWidth: this.state.leftWidth - (width / this.state.totalScale / 10)*Math.round((this.state.initialValue-10 )* 10)
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
            this.props.onSelect?this.props.onSelect( this.state.initialValue):'';
            this.props.onPress?this.props.onPress(1):'';
        },
    });
    render() {
            // this.props.onSelect?this.props.onSelect( this.state.initialValue):'';
        return (
            <View style={[styles.container,{backgroundColor:this.props.backgroundColor}]}>
                <View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf:'center',
                        flexDirection: 'row'
                    }}
                >
                    <View
                        style={{
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            // alignSelf:'center',
                            overflow: 'hidden',
                            height: 2,
                            // marginLeft:screen.width*0.05,
                            // marginRight:screen.width*0.05,
                            width: width,
                            backgroundColor: '#ffffff',
                            borderRadius: 5,
                        }}
                    />
                    <View
                        {...this.responder.panHandlers}
                        style={{
                            position:'absolute',
                            // height:40,
                            left: this.state.leftWidth,
                            borderWidth:20,
                            borderColor:'#3397ff00',
                            borderRadius:20,
                            width:5,
                            height:5,
                            // width:screen.width-width+10,
                            backgroundColor: this.state.sliderColor,
                            // paddingTop:5,
                            // paddingBottom:5,
                            // margin:5,
                            alignItems:'center',
                            justifyContent:'center',
                        }}>
                        {/*<Text style={{color:'#ffffff',fontSize:12,fontFamily:'arial',fontWeight:'500'}}>{this.state.initialValue*5===0?0.25:this.state.initialValue*5}km</Text>*/}
                        {/*<Text style={{color:'#ffffff',fontSize:12,fontFamily:'arial',fontWeight:'500'}}>km</Text>*/}
                    </View>
                    {/*<View*/}
                    {/*style={{*/}
                    {/*overflow: 'hidden',*/}
                    {/*height: 1,*/}
                    {/*width: width * 0.95-this.state.leftWidth-this.state.sliderWidth,*/}
                    {/*backgroundColor: '#ffffff',*/}
                    {/*borderRadius: 5,*/}
                    {/*}}*/}
                    {/*/>*/}
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

