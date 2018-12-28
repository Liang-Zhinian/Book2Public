import React from 'react'
import {
    Animated,
    BVLinearGradient,
    Easing, Image,
    ImageBackground,
    PanResponder,
    Switch,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';

import {screen} from '../../../common/index';
import {getArea, getExploreSceneTestWINE} from '../../../api';
import Cube from '../../Cube/Cube';
import CubeContentItem from "../../Cube/CubeContentItem";
import PageControl from 'react-native-page-control'
import {commonStyle} from "../../../widget/commonStyle";

import I18n, {getLanguages} from 'react-native-i18n';
import en from '../../demo&test/react-native-i18n_example/translations/en'
import es from '../../demo&test/react-native-i18n_example/translations/es'
import fr from '../../demo&test/react-native-i18n_example/translations/fr'
import frCA from '../../demo&test/react-native-i18n_example/translations/fr-CA'
import cn from '../../demo&test/react-native-i18n_example/translations/cn'


var allPageList=[];
var page = 1;
I18n.fallbacks = true;

// Available languages
I18n.translations = {
    'en': en,
    'fr':fr,
    'fr-CA': frCA,
    'es': es,
    'zh-Hans-CN':cn,
};
export default class DrinkCube extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
    constructor(props: Props) {
        super(props);

        this.state = {

            countryObj:{},
            regionObj:{},
            subregionObj:{},
            areaObj:{},
            subareaObj:{},

            countryList: [],
            regionList: [],
            subregionList: [],
            areaList: [],
            subareaList: [],

            languages: [],
            face: 0,
            left: new Animated.Value(0),
            allPageList:[],
            pageList:[],

            showDrinkAndBeverage:false,
            // triangleType:'Alphabetical Listing',
            falseSwitchIsOn_2: false,
        };
        this.animatedValue = new Animated.Value(0);
        this.count = 0;
    }

    componentDidMount() {
        // this.refs['swiper'].flipLeftIndex(0);
    }

    componentWillMount() {
        this.GetCubeContent();

        getArea('country', '')
            .then((msg) => {
                this.setState({countryList: msg})
            })
            .catch((e) => {
                alert(e)
            });
        let category = allPageList[page - 1][0].props.category;
        this.props.onSwipe(category, this.state.subareaObj,this.state.falseSwitchIsOn_2);
        this.setState({category: category});
        page=1;
        getLanguages().then(languages => {
            this.setState({ languages });
        });
    }

    GetCubeContent() {
        var data = getExploreSceneTestWINE();
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
        this.props.onPressFace(msg.category,this.state.subareaObj);
        // this.props.navigation.navigate('DrinkDetail'
        //     , {
        //         // callback: (msg) => {
        //         // },
        //         //Recommended_Wine
        //         //subareaObj
        //         category: msg.category,
        //         subareaObj:this.state.subareaObj
        //
        //     });
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
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 5000,
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
            let opacityL=0,opacityR=0;
            if (page===1) {
                opacityL=0;
                opacityR=1;
            }else if (page===allPageList.length){
                opacityL=1;
                opacityR=0;
            } else{
                opacityL=1;
                opacityR=1;
            }
            return (
                <View style={[commonStyle.tabViewStylePage, {
                    width: screen.width * 0.95,
                    // height: 30,
                    backgroundColor: '#e52a0000',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    // top: screen.width*0.95,
                    bottom:20
                }]}
                      {...this.responder.panHandlers}>
                    <TouchableOpacity
                        style={{paddingRight:30}}
                        activeOpacity={0.6} onPress={() => {
                        page <= 1 ? page = 1 : page--;
                        this.refs['swiper'].flipLeftIndex(0);
                        this.setState({allPageList: allPageList[page - 1]});
                        setTimeout(() => {
                            this.setState({allPageList: allPageList[page - 1]});
                        }, 500);
                        this.animate()
                    }}>
                        <View
                            style={{opacity:opacityL}}
                        >
                            <Image source={require('../../../img/nearby/lastPage.png')}
                                   style={{width: 30, height: 30,tintColor:'#fff8'}}/>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            // paddingTop: 10,
                            // paddingBottom: 10,
                            // paddingLeft: 20,
                            // paddingRight: 20,
                            // width: screen.width * 0.8,
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
                    <TouchableOpacity
                        style={{paddingLeft:30}}
                        activeOpacity={0.6} onPress={() => {
                        page >= allPageList.length ? page = allPageList.length : page++;
                        this.refs['swiper'].flipLeftIndex(0);
                        this.setState({allPageList: allPageList[page - 1]});
                        setTimeout(() => {
                            this.setState({allPageList: allPageList[page - 1]});
                        }, 500);
                        this.animate()
                    }}>
                        <Animated.View
                            style={{opacity:opacityR}}
                        >
                            <Image source={require('../../../img/nearby/nextPage.png')}
                                   style={{width: 30, height: 30,tintColor:'#fff8'}}/>
                        </Animated.View>

                    </TouchableOpacity>
                </View>
            )
        }else {
            return (<View/>)
        }
    }


    showDrinkAndBeverage() {
        let category = this.state.category;
        let LeftTitle='WINE';
        let RightTitle='BEVERAGE';
        if (category === 'Vineyard') {
            LeftTitle='Alphabet';
            RightTitle='Country';
        } else if (category === 'Producer') {
            LeftTitle='WINE';
            RightTitle='BEVERAGE';
        } else if (category === 'Red_Wine') {
            LeftTitle='WINE';
            RightTitle='BEVERAGE';
        } else {
            LeftTitle='WINE';
            RightTitle='BEVERAGE';
        }
        return (
            !(category === 'Vineyard')&&
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#ffffff23',
                width: screen.width,
                marginBottom: 5,
                paddingLeft: screen.width * 0.1,
                paddingRight: screen.width * 0.1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 5,
                zIndex:666
            }}>
                <TouchableOpacity activeOpacity={0.9}
                                  onPress={() => {
                                      Vibration.vibrate( [0, 30,0, 0]);
                                      let category = allPageList[page - 1][0].props.category;
                                      this.props.onSwipe(category, this.state.subareaObj,false);
                                      this.setState({
                                          // triangleType: LeftTitle,
                                          falseSwitchIsOn_2: false
                                      });
                                  }}>
                    <View style={{
                        width: screen.width * 0.3,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop: 5,
                        paddingBottom: 5,
                    }}>
                        <Text style={{fontSize: 14, color: this.getchosedTintColor(LeftTitle),}}>{LeftTitle}</Text>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                    width:screen.width*0.3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}>
                    <Switch
                        disabled={true}
                        onValueChange={(value) => {
                            Vibration.vibrate( [0, 30,0, 0]);
                            this.setState({falseSwitchIsOn_2: value})

                            let category = allPageList[page - 1][0].props.category;
                            this.props.onSwipe(category, this.state.subareaObj,value);
                            if (value) {
                                this.setState({
                                    // triangleType:RightTitle
                                });
                                this.getchosedTintColor(RightTitle)
                            } else {
                                this.setState({
                                    // triangleType: LeftTitle
                                });
                                this.getchosedTintColor(LeftTitle)
                            }
                        }}
                        value={this.state.falseSwitchIsOn_2}
                        onTintColor={'#FFFFFF'}
                        thumbTintColor={'#f4cad8'}
                        tintColor={'#FFFFFF'}
                    />
                </View>

                <TouchableOpacity activeOpacity={0.9}
                                  onPress={() => {
                                      Vibration.vibrate( [0, 30,0, 0]);
                                      let category = allPageList[page - 1][0].props.category;
                                      this.props.onSwipe(category, this.state.subareaObj,true);
                                      // this.setState({
                                      //     triangleType: RightTitle,
                                      //     falseSwitchIsOn_2: true
                                      // });
                                  }}>
                    <View style={{
                        width: screen.width * 0.3,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop: 5,
                        paddingBottom: 5,
                    }}>
                        <Text style={{fontSize: 14, color: this.getchosedTintColor(RightTitle),}}>{RightTitle}</Text>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }
    getchosedTintColor(typeName){
        return this.state.triangleType==typeName?'#f4cad8':'#FFFFFF'
    }

    changeBarTitle(category){
        if (category === 'Vineyard') {
            this.setState({triangleType:'Alphabetical Listing'})
        } else  {
            this.setState({triangleType:'WINE'})
        }
    }


    // actionButtonItem(type) {
    //     let {countryList, regionList, subregionList, areaList, subareaList} = this.state;
    //     if (type === 'country') {
    //         return this.dataHandle('country',countryList)
    //     } else if (type === 'region') {
    //         return this.dataHandle('region',regionList)
    //     } else if (type === 'subregion') {
    //         return this.dataHandle('subregion',subregionList)
    //     } else if (type === 'area') {
    //         return this.dataHandle('area',areaList)
    //     } else if (type === 'subarea') {
    //         return this.dataHandle('subarea',subareaList)
    //     }
    // }

    // dataHandle(type,data) {
    //     let buttonColorT = ['#9dff71', '#ffd077', '#ff7b8f', '#7a98ff', '#ffd54b', '#3095ff', '#ff4c98', '#57ffb4', '#9ca4ff', '#ffa0b9', '#d6ff82'];
    //     let regionListView = [];
    //     for (let i = 0; i < data.length; i++) {
    //         let roundNum = Math.round(Math.random() * 10);
    //         let id = data[i].region_id,
    //             name = data[i].regionname.substring(0, 2).toUpperCase();
    //         regionListView.push(
    //             <ActionButton.Item
    //                 buttonColor={buttonColorT[roundNum]}
    //                 title={data[i].regionname}
    //                 nativeFeedbackRippleColor={'rgba(255,255,255,0)'}
    //                 onPress={() => {
    //
    //                     if (type === 'country') {
    //                         this.setState({
    //                             countryObj:data[i],country: name,
    //                             region:'+',subregion:'+',
    //                             area:'+',subarea:'+',
    //                             regionObj:{},subregionObj:{},
    //                             areaObj:{},subareaObj:{},
    //                             subregionList: [],areaList: [],
    //                             subareaList: [],
    //                         });
    //                         this.props.onPressSubareaObj({});
    //                         getArea('region', id)
    //                             .then((msg) => {
    //                                 this.setState({regionList: msg})
    //                             });
    //                     } else if (type === 'region') {
    //                         this.setState({
    //                             regionObj:data[i],
    //                             region: name,
    //                             subregion:'+',
    //                             area:'+',
    //                             subarea:'+',
    //                             subregionObj:{},
    //                             areaObj:{},
    //                             subareaObj:{},
    //                             areaList: [],
    //                             subareaList: [],
    //                         });
    //                         this.props.onPressSubareaObj({});
    //                         getArea('subregion', id)
    //                             .then((msg) => {
    //                                 this.setState({subregionList: msg})
    //                             });
    //                     } else if (type === 'subregion') {
    //                         this.setState({
    //                             subregionObj:data[i],
    //                             subregion: name,
    //                             area:'+',
    //                             subarea:'+',
    //                             areaObj:{},
    //                             subareaObj:{},
    //                             subareaList:[],
    //                         });
    //                         this.props.onPressSubareaObj({});
    //                         getArea('area', id)
    //                             .then((msg) => {
    //                                 this.setState({areaList: msg})
    //                             });
    //                     } else if (type === 'area') {
    //                         this.setState({
    //                             areaObj:data[i],
    //                             area: name,
    //                             subarea:'+',
    //                             subareaObj:{},
    //                         });
    //                         this.props.onPressSubareaObj({});
    //                         getArea('subarea', id)
    //                             .then((msg) => {
    //                                 this.setState({subareaList: msg})
    //                             });
    //                     } else if (type === 'subarea') {
    //                         this.props.onPressSubareaObj(data[i]);
    //                         this.setState({
    //                             subareaObj:data[i],
    //                             subarea: name
    //                         })
    //                     }
    //
    //                 }}
    //             >
    //                 <Text style={{fontSize: 12, color: '#1f1f1f', fontFamily: 'arial'}}>
    //                     {name}
    //                 </Text>
    //             </ActionButton.Item>
    //         )
    //     }
    //
    //     return regionListView;
    // }

    render() {
        return (
            <View style={[commonStyle.cubeStyleDrink,commonStyle.center]}>
                {this.showDrinkAndBeverage()}
                {/*<ActionButton*/}
                    {/*style={{zIndex: 100}}*/}
                    {/*position={'left'}*/}
                    {/*verticalOrientation={'down'}*/}
                    {/*offsetX={screen.width*0.1}*/}
                    {/*offsetY={30}*/}
                    {/*size={35}*/}
                    {/*spacing={10}//动作按钮的间距*/}
                    {/*buttonColor="#FF462E"*/}
                    {/*outRangeScale={1}//动画中按钮的图片大小改变*/}
                    {/*buttonText={this.state.country}*/}
                    {/*buttonTextStyle={{fontSize:18}}*/}
                    {/*nativeFeedbackRippleColor={'rgba(255,255,255,0)'}//涟漪效果  当前透明度为0*/}
                    {/*activeOpacity={0.6}*/}
                {/*>*/}
                    {/*{this.actionButtonItem('country')}*/}
                {/*</ActionButton>*/}
                {/*<ActionButton*/}
                    {/*style={{zIndex: 100}}*/}
                    {/*position={'left'}*/}
                    {/*verticalOrientation={'down'}*/}
                    {/*offsetX={screen.width*0.2}*/}
                    {/*offsetY={30}*/}
                    {/*size={35}*/}
                    {/*spacing={10}//动作按钮的间距*/}
                    {/*buttonColor="#2a96ff"*/}
                    {/*outRangeScale={1}//动画中按钮的图片大小改变*/}
                    {/*buttonText={this.state.region}*/}
                    {/*buttonTextStyle={{fontSize:18}}*/}
                    {/*nativeFeedbackRippleColor={'rgba(255,255,255,0)'}//涟漪效果  当前透明度为0*/}
                    {/*activeOpacity={0.6}*/}
                {/*>*/}
                    {/*{this.actionButtonItem('region')}*/}
                {/*</ActionButton>*/}
                {/*<ActionButton*/}
                    {/*style={{zIndex: 100}}*/}
                    {/*position={'left'}*/}
                    {/*verticalOrientation={'down'}*/}
                    {/*offsetX={screen.width*0.3}*/}
                    {/*offsetY={30}*/}
                    {/*size={35}*/}
                    {/*spacing={10}//动作按钮的间距*/}
                    {/*buttonColor="#FF3D77"*/}
                    {/*outRangeScale={1}//动画中按钮的图片大小改变*/}
                    {/*buttonText={this.state.subregion}*/}
                    {/*buttonTextStyle={{fontSize:18}}*/}
                    {/*nativeFeedbackRippleColor={'rgba(255,255,255,0)'}//涟漪效果  当前透明度为0*/}
                    {/*activeOpacity={0.6}*/}
                {/*>*/}
                    {/*{this.actionButtonItem('subregion')}*/}
                {/*</ActionButton>*/}
                {/*<ActionButton*/}
                    {/*style={{zIndex: 100}}*/}
                    {/*position={'left'}*/}
                    {/*verticalOrientation={'down'}*/}
                    {/*offsetX={screen.width*0.4}*/}
                    {/*offsetY={30}*/}
                    {/*size={35}*/}
                    {/*spacing={10}//动作按钮的间距*/}
                    {/*buttonColor="#FFAB59"*/}
                    {/*outRangeScale={1}//动画中按钮的图片大小改变*/}
                    {/*buttonText={this.state.area}*/}
                    {/*buttonTextStyle={{fontSize:18}}*/}
                    {/*nativeFeedbackRippleColor={'rgba(255,255,255,0)'}//涟漪效果  当前透明度为0*/}
                    {/*activeOpacity={0.6}*/}
                {/*>*/}
                    {/*{this.actionButtonItem('area')}*/}
                {/*</ActionButton>*/}
                {/*<ActionButton*/}
                    {/*style={{zIndex: 100}}*/}
                    {/*position={'left'}*/}
                    {/*verticalOrientation={'down'}*/}
                    {/*offsetX={screen.width*0.5}*/}
                    {/*offsetY={30}*/}
                    {/*size={35}*/}
                    {/*spacing={10}//动作按钮的间距*/}
                    {/*buttonColor="#5FFF65"*/}
                    {/*outRangeScale={1}//动画中按钮的图片大小改变*/}
                    {/*buttonText={this.state.subarea}*/}
                    {/*buttonTextStyle={{fontSize:18}}*/}
                    {/*nativeFeedbackRippleColor={'rgba(255,255,255,0)'}//涟漪效果  当前透明度为0*/}
                    {/*activeOpacity={0.6}*/}
                {/*>*/}
                    {/*{this.actionButtonItem('subarea')}*/}
                {/*</ActionButton>*/}

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
                          let category = allPageList[page - 1][face].props.category;
                          this.setState({face: face,category:category});
                          this.changeBarTitle(category);
                          this.props.onSwipe( category,this.state.subareaObj,this.state.falseSwitchIsOn_2);
                      }}
                      addface={() => {
                          let face = ++this.state.face;
                          if (face > 3) {
                              this.animate();
                              face = face-4;
                          }
                          let category = allPageList[page - 1][face].props.category;
                          this.setState({face: face, category: category});
                          this.changeBarTitle(category);
                          this.props.onSwipe(category, this.state.subareaObj,this.state.falseSwitchIsOn_2);
                      }}
                >{this.state.allPageList && this.state.allPageList}
                </Cube>
                {this.pageTab()}
            </View>
        );
    }
}
