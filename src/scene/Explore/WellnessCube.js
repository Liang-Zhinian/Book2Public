import React from 'react'
import {Animated, BVLinearGradient, Easing, ImageBackground, PanResponder, TouchableOpacity, View,} from 'react-native';

import {screen} from '../../common';
import {getExploreSceneTestWELLNESS} from '../../api';
import Cube from '../Cube/Cube';
import CubeContentItem from "../Cube/CubeContentItem";
import PageControl from 'react-native-page-control'
import {commonStyle} from "../../widget/commonStyle";

var allPageList=[];
var page = 1;
export default class WellnessCube extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    })
    constructor(props: Props) {
        super(props);

        this.state = {
            angle:[0,0],
            y: 0,

            typeTemp: null,
            face: 0,
            left: new Animated.Value(0),
            searchKey: 'What to',
            allPageList:[],
            pageList:[],

            startYear:new Date().getFullYear(),
            showchoseTime:false,
            showClassesAndBusinesses:false,
            showDrinkAndBeverage:false,
            startTime:'6am',
            endTime:'9pm',
            SliderValue:{start:12,end:42},
            month:new Date().getMonth(),
            date:new Date().getDate(),
            selectedType:'BEAUTY',
            triangleType:'BUSINESSES',
            falseSwitchIsOn_1:false,
            falseSwitchIsOn_2: false,
        };
        this.animatedValue = new Animated.Value(0);
        this.count = 0;
    }


    componentDidMount() {
        this.refs['swiper'].flipLeftIndex(0);
    }
    componentWillMount() {
        this.GetCubeContent()
        this.props.onSwipe( allPageList[page - 1][0].props.category);
        page=1;
    }
    GetCubeContent() {
        var data = getExploreSceneTestWELLNESS();
        var b = [];
        var result = [];
        var k = 0;

        //分成4个一组
        for (var i = 0; i < data.length; ++i) {
            if (i % 4 == 0) {
                b = [];
                for (var j = 0; j < 4; ++j) {
                    if (data[i + j] === undefined) {
                        continue;
                    } else {
                        b[j] = data[i + j];
                    }
                }
                result[k] = b;
                let len = result[k].length;
                if (len === 1) {
                    result[k].push(result[k][0]);
                    result[k].push(result[k][0]);
                    result[k].push(result[k][0]);
                } else if (len === 2) {
                    result[k].push(result[k][0]);
                    result[k].push(result[k][1]);
                } else if (len === 3) {
                    result[k].push(result[k][1]);
                }
                k++;
            }
        }

        let menuItems = result.map(
            (info, i) => (
                info.map(
                    (temp, j) => (
                        <CubeContentItem
                            // ref={j}
                            key={temp.id}
                            img={temp.img}
                            tag={temp.tag}
                            sign={temp.sign}//是否显示中间透明框
                            title={temp.title}
                            prompt={temp.prompt}
                            siteId={temp.siteId}
                            category={temp.category}
                            onPress={() => {
                                this.onMenuSelected && this.onMenuSelected(temp)

                            }}
                        />
                    )
                )
            )
        );
        allPageList = menuItems;
        this.setState({allPageList:menuItems[0]});
    }
    onMenuSelected(msg){
        this.props.onPressFace(msg.category);
    }
    flipLeftIndex(){
        this.refs['swiper'].flipLeftIndex(0);
    }
    responder = PanResponder.create({
        onStartShouldSetResponder: (evt, gestureState) => false,
        onStartShouldSetResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        _onPanResponderTerminationRequest: (evt, gestureState) => false,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
            return true;
        },

        onPanResponderMove: (evt, {dx, dy}) => {
            this.animate()
        },
        onPanResponderRelease: (evt, {vx, vy}) => {
            if (vx > 0.05) {
                //下一页
                page >= allPageList.length ? page = allPageList.length : page++;
                this.refs['swiper'].flipLeftIndex(0);
                this.setState({allPageList: allPageList[page - 1]});
            } else if (vx < -0.05) {
                //上一页
                page <= 1 ? page = 1 : page--;
                this.refs['swiper'].flipLeftIndex(0);
                this.setState({allPageList: allPageList[page - 1]});
                this.setState({showArrowLeft:true});
            }

        }
    });
    animate () {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(
        )
    }

    pageTab() {
        const opacity = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0]
        })
        if (typeof allPageList!=='undefined'&&allPageList.length > 1) {

            return (
                <View style={[commonStyle.tabViewStylePage, {
                    width: screen.width * 0.95,
                    height: 30,
                    backgroundColor: '#e52a0000',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    bottom: 10,
                }]}
                      {...this.responder.panHandlers}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                        page <= 1 ? page = 1 : page--;
                        this.refs['swiper'].flipLeftIndex(0);
                        this.setState({allPageList: allPageList[page - 1]});
                        setTimeout(() => {
                            this.setState({allPageList: allPageList[page - 1]});
                        }, 500);
                        this.animate()
                    }}>
                        <Animated.View
                            style={{opacity,}}
                        >
                            <ImageBackground source={require('../../img/nearby/lastPage.png')}
                                             style={{width: 25, height: 25}}/>
                        </Animated.View>

                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9}
                                      style={{
                                          paddingTop: 10,
                                          paddingBottom: 10,
                                          paddingLeft: 20,
                                          paddingRight: 20,
                                          width: screen.width * 0.8,
                                      }}
                                      onPress={() => {
                                          this.animate()
                                      }}>
                        <PageControl
                            numberOfPages={allPageList.length}
                            currentPage={page - 1}
                            hidesForSinglePage
                            pageIndicatorTintColor='#FFFFFF'
                            currentPageIndicatorTintColor={'#000000'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                        page >= allPageList.length ? page = allPageList.length : page++;
                        this.refs['swiper'].flipLeftIndex(0);
                        this.setState({allPageList: allPageList[page - 1]});
                        setTimeout(() => {
                            this.setState({allPageList: allPageList[page - 1]});
                        }, 500);
                        this.animate()
                    }}>
                        <Animated.View
                            style={{opacity,}}
                        >
                            <ImageBackground source={require('../../img/nearby/nextPage.png')}
                                             style={{width: 25, height: 25}}/>
                        </Animated.View>

                    </TouchableOpacity>
                </View>
            )
        }else {
            return (<View/>)
        }
    }

    render() {
        return (
            <View style={[commonStyle.cubeStyle,]}>
                <Cube ref='swiper'
                      reduceface={() => {
                          //上一个页面, right
                          let face = --this.state.face;
                          if (face <0) {
                              if (page>1){
                                  this.animate();
                              }
                              face = 4+face;
                          }
                          this.setState({face: face});
                          this.props.onSwipe( allPageList[page - 1][face].props.category);

                      }}
                      addface={() => {

                          let face = ++this.state.face;
                          if (face > 3) {
                              this.animate();
                              face = face-4;
                          }
                          this.setState({face: face});
                          this.props.onSwipe( allPageList[page - 1][face].props.category);

                      }}
                >{this.state.allPageList && this.state.allPageList}
                </Cube>
                {this.pageTab()}
            </View>
        );
    }
}
