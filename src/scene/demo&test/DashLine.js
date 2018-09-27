import React, {Component} from 'react'
import {ART, Dimensions, PanResponder, Text, View} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
var block;
var movexTemp=0;
export default class DashLine extends Component {


    constructor(props) {
        super(props);

        this.state = {
            paintStartX:0,
            paintStartY:10,
            paint2StartX: 20,
            paint2StartY: 10,
            paint3StartX: 10,
            paint3StartY: 20,

        };
    }
    componentDidMount() {
        block=Math.floor((screenWidth*0.95-20)/10);
        this.setState({
            paintStartX: 55-20,
            paint2StartX: 55,
            paint3StartX: 55-10,
        });
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

        },
        onPanResponderMove: (evt, {dx, dy}) => {
            if (this.selectValue >= 0 && this.selectValue <= 50) {
                if ((this.selectValue===0&&dx<0)||(this.selectValue===50&&dx>0)||(this.state.paintStartX + dx - this.tempDx<0||this.state.paintStartX + dx - this.tempDx>350)){
                    return
                } else {
                    this.setState({
                        paintStartX: this.state.paintStartX + dx - this.tempDx,
                        paint2StartX: this.state.paint2StartX + dx - this.tempDx,
                        paint3StartX: this.state.paint3StartX + dx - this.tempDx,
                    });
                }
                this.tempDx = dx;
            }
        },
        onPanResponderRelease: (evt, {vx, vy}) => {
            this.tempDx = 0;
            let bottomPointX = Math.floor(this.state.paint2StartX / block) * block + 20;
            this.selectValue=Math.floor(this.state.paint2StartX / block)*5;
            this.setState({
                paintStartX: bottomPointX-20,
                paint2StartX: bottomPointX,
                paint3StartX: bottomPointX-10,
            });
            this.props.onSelect?this.props.onSelect( this.selectValue):'';
        },
    });

    dashLine() {
        var Line = [];
        var Num = [];
        var line = {};
        for (var i = 0, k = 0; i <= 50; i++) {
            if (i % 10 === 0) { //整值
                //整值竖线
                Line.push(<Text key={i} style={{width: 1, height: 8, backgroundColor: '#ffffff',}}> </Text>);
                //整值文字
                Num.push(<Text  key={i} style={{color: '#fff'}}>{k===0?0.25:k}</Text>);
                k += 10;
            } else if (i % 5 === 0) {
                Line.push(<Text  key={i} style={{width: 1, height: 4, backgroundColor: '#ffffff',}}> </Text>)
            } else {
                //中间小刻度
                // Line.push(<Text style={{width: 1, height: 4, backgroundColor: '#13ff0a',}}> </Text>)
            }
        }
        line.Line = Line;
        line.Num = Num;

        return line
    }

    render() {
        const path = ART.Path()
            .moveTo(this.state.paintStartX, this.state.paintStartY)
            .lineTo(this.state.paint2StartX, this.state.paint2StartY)
            .lineTo(this.state.paint3StartX, this.state.paint3StartY)
            .close();

        return (
            <View {...this.responder.panHandlers}  style={{width: Math.floor(screenWidth*0.95), height: 50, backgroundColor: "#06539cab", alignSelf: 'center'}}>

                <ART.Surface width={Math.floor(screenWidth*0.95)} height={23}
                             style={{
                                 paddingLeft: 10,
                                 paddingRight: 10,
                                 alignSelf: 'center'
                             }}
                >
                    <ART.Shape d={path} stroke="#fd0f0f" fill="#fd0f0f" strokeWidth={1}/>
                </ART.Surface>
                <View style={{height: 30, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        width: Math.floor(screenWidth*0.95),
                        backgroundColor: '#d8ffff00',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        alignSelf:'center'
                    }}>
                        {this.dashLine().Line}
                    </View>
                    <Text style={{width: screenWidth, height: 1, backgroundColor: '#ffffff'}}> </Text>
                    <View style={{
                        flexDirection: 'row',
                        paddingLeft: 0,
                        paddingRight: 0,
                        width: Math.floor(screenWidth*0.95),
                        backgroundColor: '#d8ffff00',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        {this.dashLine().Num}
                    </View>
                </View>
            </View>
        )
    }

}