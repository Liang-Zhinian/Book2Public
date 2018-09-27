import React from 'react'
import {
    Animated,
    BVLinearGradient,
    Easing,
    Image,
    ImageBackground,
    PanResponder,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import {DatePicker,} from '../../common/react-native-pickers';

import {screen} from '../../common';
import {getExploreSceneTestFITNESS} from '../../api';
import Cube from '../Cube/Cube';
import CubeContentItem from "../Cube/CubeContentItem";
import PageControl from 'react-native-page-control'
import {commonStyle} from "../../widget/commonStyle";
import I18n, { getLanguages } from 'react-native-i18n';
import en from  '../../scene/demo&test/react-native-i18n_example/translations/en'
import es from  '../../scene/demo&test/react-native-i18n_example/translations/es'
import fr from  '../../scene/demo&test/react-native-i18n_example/translations/fr'
import frCA from  '../../scene/demo&test/react-native-i18n_example/translations/fr-CA'
import cn from  '../../scene/demo&test/react-native-i18n_example/translations/cn'
import Toast from "react-native-easy-toast";
I18n.fallbacks = true;

// Available languages
I18n.translations = {
    'en': en,
    'fr':fr,
    'fr-CA': frCA,
    'es': es,
    'zh-Hans-CN':cn,
};

var allPageList=[];
var page = 1;
let m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
export default class FitnessCube extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    })
    constructor(props: Props) {
        super(props);

        this.state = {
            angle:[0,0],
            y: 0,
            languages: [],
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
        var data = getExploreSceneTestFITNESS();
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
        });
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

    showClassesAndBusinesses() {
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#ffffff23',
                width: screen.width,
                marginBottom: 5,
                paddingLeft: screen.width * 0.1,
                paddingRight: screen.width * 0.1,
                justifyContent: 'center',
            }}>
                <TouchableOpacity activeOpacity={0.9}
                                  onPress={() => {
                                      Vibration.vibrate( [0, 30,0, 0]);
                                      this.setState({
                                          showchoseTime: false,
                                          triangleType: 'BUSINESSES',
                                          falseSwitchIsOn_1: false
                                      })
                                  }}>
                    <View style={{
                        width: screen.width * 0.3,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop: 5,
                        paddingBottom: 5,
                    }}>
                        <Text style={{fontSize: 12, color: this.getchosedTintColor('BUSINESSES'),}}>{I18n.t('BUSINESSES')}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{
                    width:screen.width*0.3,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <Switch
                        onValueChange={(value) => {
                            Vibration.vibrate( [0, 30,0, 0]);
                            this.setState({falseSwitchIsOn_1: value});
                            if (value) {
                                this.setState({
                                    showchoseTime: true,
                                    triangleType: 'CLASS'
                                });
                                this.getchosedTintColor('CLASS')
                            } else {
                                this.setState({
                                    showchoseTime: false,
                                    triangleType: 'BUSINESSES'
                                });
                                this.getchosedTintColor('BUSINESSES')
                            }
                        }}
                        value={this.state.falseSwitchIsOn_1}
                        onTintColor={'#FFFFFF'}
                        thumbTintColor={'#f4cad8'}
                        tintColor={'#FFFFFF'}
                    />
                </View>

                <TouchableOpacity activeOpacity={0.9}
                                  onPress={() => {
                                      Vibration.vibrate( [0, 30,0, 0]);
                                      this.setState({
                                          showchoseTime: true,
                                          triangleType: 'CLASS',
                                          falseSwitchIsOn_1: true
                                      });
                                  }}>
                    <View style={{
                        width: screen.width * 0.3,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop: 5,
                        paddingBottom: 5,
                    }}>
                        <Text style={{fontSize: 12, color: this.getchosedTintColor('CLASS'),}}>{I18n.t('CLASS')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    showTimeChose() {
        return (
            <View style={[{
                width: screen.width * 0.9,
                borderRadius: 45,
                paddingBottom: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
            }]}>
                <Image source={require('../../img/nearby/time.png')}
                       style={[{
                           width: 30,
                           height: 30,
                           tintColor: '#FFFFFF',
                       }]}/>
                <TouchableOpacity activeOpacity={0.9}  style={{
                    backgroundColor: '#ffffff',
                    width: screen.width * 0.75,
                    borderRadius: 4,
                    marginLeft: 5,
                    paddingTop:5,
                    paddingBottom:5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    flexDirection: 'row',
                }}
                                  onPress={() => {
                                      let day = 0
                                      if (this.state.month - (new Date().getMonth() + 1) === 0) {
                                          day = this.state.date - (new Date().getDate());
                                          this.setState({selectedValue: [new Date().getFullYear(), m[this.state.month], this.state.date ]});
                                      } else {
                                          day = this.state.date - 1;
                                          this.setState({selectedValue: [new Date().getFullYear() , m[this.state.month], this.state.date ]});
                                      }


                                      this.DatePicker1.setState({
                                          selectedIndex: [0, this.state.month - (new Date().getMonth() + 1), day],
                                          multiSliderValue:
                                              [this.state.SliderValue.start, this.state.SliderValue.end]
                                      });
                                      this.DatePicker1.setSelectedValue([new Date().getFullYear() , m[this.state.month] , this.state.date ]);
                                      this.DatePicker1.changeState();
                                      this.DatePicker1.show(() => {
                                      });
                                  }}
                >
                    {/*<TouchableOpacity activeOpacity={0.9} style={{*/}
                    {/*}} onPress={() => {*/}
                    {/*this.DatePicker1.show()*/}
                    {/*}}>*/}
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, color: '#4a4a4a', fontWeight: 'bold'}}>
                            {((this.state.month.toString() === (new Date().getMonth() ).toString()) && this.state.date.toString() === new Date().getDate().toString()) ? 'ToDay ' :
                                this.formatDay(this.state.month, this.state.date) + ' ' + this.state.date + ' ' + m[this.state.month] + ' '}
                        </Text>
                        <Text style={{fontSize: 12, color: '#4a4a4a',}}>from </Text>
                        <Text style={{fontSize: 12, color: '#4a4a4a', fontWeight: 'bold'}}>
                            {this.state.startTime} - {this.state.endTime}</Text>
                    </View>
                    {/*</TouchableOpacity>*/}
                </TouchableOpacity>
            </View>
        )
    }
    getchosedTintColor(typeName){
        if (typeName==='CLASS'){

        }
        return this.state.triangleType==typeName?'#f4cad8':'#FFFFFF'
    }


    getDaysInOneMonth(year, month){
        month = parseInt(month,10)+1;
        var d= new Date(year+"/"+month+"/0");
        return d.getDate();
    }

    formatMonth(month, date) {
        var dt = new Date();
        var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
        mn = dt.setMonth(month);
        dn = dt.setDate(date);
        wn = dt.getDay();
        return m[month - 1];
    }

    formatDay(month, date) {
        var dt = new Date();
        var w = ["Sun", "Mon", "Tus", "Wed", "Thu", "Fri", "Sat" ];
        mn = dt.setMonth(month);
        dn = dt.setDate(date-0);
        wn = dt.getDay();
        // debugger;
        return w[wn];
    }
    render() {
        return (
                <View style={[commonStyle.cubeStyleDrink,]}>
                    {this.showClassesAndBusinesses()}
                    {this.state.showchoseTime ? this.showTimeChose() : <View/>}
                    <Cube ref='swiper'
                          reduceface={() => {
                              //上一个页面, right
                              let face = --this.state.face;
                              if (face <0) {
                                  if (page>1){
                                      this.animate();
                                      // this.refs.toast.show('the first');
                                  }
                                  face = 4+face;
                              }

                              this.setState({face: face});
                              this.props.onSwipe( allPageList[page - 1][face].props.category);

                          }}
                          addface={() => {

                              let face = ++this.state.face;
                              if (face > 3) {
                                  // alert(allPageList.length);
                                  // this.refs.toast.show('the last');
                                  this.animate();
                                  face = face-4;
                              }

                              this.setState({face: face});
                              this.props.onSwipe( allPageList[page - 1][face].props.category);

                          }}
                    >{this.state.allPageList && this.state.allPageList}
                    </Cube>
                    {this.pageTab()}
                    <DatePicker
                        itemSelectedColor={'#000000'}
                        SliderValue={this.state.SliderValue}
                        HH={false}
                        mm={false}
                        ss={false}
                        unit={this.state.unit}
                        startYear={this.state.startYear}
                        startMonth={m[new Date().getMonth()]}
                        startDate={new Date().getDate() - 1}
                        selectedValue={this.state.selectedValue}
                        onPickerConfirm={(value, start, end, SliderValue) => {
                            this.setState({
                                month: m.indexOf(value[1]),
                                date: value[2],
                                startTime: start,
                                endTime: end,
                                SliderValue: {
                                    start: SliderValue.SliderValue.start,
                                    end: SliderValue.SliderValue.end
                                }
                            });
                        }}
                        onPickerCancel={() => {
                            // alert('cancel')
                        }}
                        onPickerSelected={(pickerId, value) => {
                            debugger;
                            let v = this.state.selectedValue;

                            v[pickerId] = value;

                            this.setState({selectedValue: v});
                        }}
                        ref={ref => this.DatePicker1 = ref}>
                    </DatePicker>
                    <Toast
                        ref="toast"
                        position='top'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                    />
                </View>
        );
    }
}