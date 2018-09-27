/*
附近页面
 */

import React, {PureComponent} from 'react'
import LinearGradient from 'react-native-linear-gradient';
import {BVLinearGradient, Image, ImageBackground, Text, TouchableOpacity, Vibration, View,} from 'react-native';

import {screen} from '../../common';
import SearchAnythingScene from "./SearchAnythingScene";
import BeautyCube from "./BeautyCube";
import WellnessCube from "./WellnessCube";
import FitnessCube from "./FitnessCube";
import DrinkCube from "./DrinkCube";
import {commonStyle} from "../../widget/commonStyle";

import I18n, {getLanguages} from 'react-native-i18n';
import en from '../../scene/demo&test/react-native-i18n_example/translations/en'
import es from '../../scene/demo&test/react-native-i18n_example/translations/es'
import fr from '../../scene/demo&test/react-native-i18n_example/translations/fr'
import frCA from '../../scene/demo&test/react-native-i18n_example/translations/fr-CA'
import cn from '../../scene/demo&test/react-native-i18n_example/translations/cn'
import ProducerScene from "./Drink/Producer/ProducerScene";
import VineyardScene from "./Drink/Vineyard/VineyardScene";

I18n.fallbacks = true;

// Available languages
I18n.translations = {
    'en': en,
    'fr': fr,
    'fr-CA': frCA,
    'es': es,
    'zh-Hans-CN': cn,
};

type
Props = {
    navigation: any,
};

var SelectTypeTemp = 'Beauty';
var colorTemp = screen.colorTemp;

class ExploreScene extends PureComponent<Props> {


    static  navigationOptions = ({navigation}: any) => {
        return {
            header: null,
            headerStyle: {
                height: 148,
            },
            headerLeft: null,
            headerRight: null,
        };

    };

    constructor(props: Props) {
        super(props);
        this.state = {
            angle: [0, 0],
            languages: [],
            // typeTemp: 'Beauty',
            face: 0,
            category: null,
            subareaObj: {},
            searchKey: 'What to',

            selectedType: 'Beauty',
            triangleType: 'BUSINESSES',
            SwitchIsOn:false,
        };
    }


    SelectView() {
        let typeTemp = this.state.typeTemp;

        if (typeTemp === 'Fitness') {
            return (
                <FitnessCube ref={'swiper'}
                             onPressFace={(category) => {
                                 this.onMenuSelected(category)
                             }}
                             onSwipe={(category) => {
                                 this.setState({category: category});
                             }}
                />)
        } else if (typeTemp === 'Wellness') {
            return (
                <WellnessCube ref={'swiper'}
                              onPressFace={(category) => {
                                  this.onMenuSelected(category)
                              }}
                              onSwipe={(category) => {
                                  this.setState({category: category});
                              }}
                />
            )
        } else if (typeTemp === 'Beauty') {
            return (
                <BeautyCube ref={'swiper'}
                            onPressFace={(category) => {
                                this.setState({category: category});
                                this.props.navigation.navigate('BeautyScene'
                                    , {
                                        category: 'Beauty',
                                    });
                            }}
                            onSwipe={(category) => {
                                this.setState({category: category});
                            }}
                />
            )
        } else if (typeTemp === 'Drink') {
            return (
                <DrinkCube ref={'swiper'}
                           onPressSubareaObj={(subareaObj)=>{
                               this.setState({subareaObj: subareaObj});
                           }}
                           onPressFace={(category, subareaObj) => {
                               this.setState({category: category, subareaObj: subareaObj});
                               if (category === 'Vineyard') {
                               // this.state.SwitchIsOn&& this.props.navigation.navigate('CountryListScene');
                               // !this.state.SwitchIsOn&&
                               this.props.navigation.navigate('VineyardScene'
                                   , {
                                       category: category,
                                       subareaObj: subareaObj,
                                   });
                               }else if(category === 'Producer'){
                                   this.props.navigation.navigate('ProducerScene');
                               }else if (category === 'QR'){
                                   this.props.navigation.navigate('PrintInteractionScreen',{type:SelectTypeTemp})//跳到扫码页面
                               } else {
                                   this.props.navigation.navigate('VineyardScene'
                                       , {
                                           category: 'Vineyard',
                                           subareaObj: subareaObj
                                       });
                               }

                           }}
                           onSwipe={(category, subareaObj,SwitchIsOn) => {
                               this.setState({category: category, subareaObj: subareaObj,SwitchIsOn:SwitchIsOn});
                           }}
                />
            )
        } else {
            return (
                [
                    <View ref='f0' style={commonStyle.surface}>
                        <ImageBackground source={require('../../img/home/CubeImages-Beauty.png')}
                                         style={commonStyle.pageImg}>
                            <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                                <Text style={{
                                    paddingTop: screen.width / 3,
                                    fontSize: 25,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    EXPLORE
                                </Text>
                                <Text style={{
                                    fontSize: 40,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    Discover beauty {"\n"}
                                    shops near you
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>,
                    <View ref='f1' style={commonStyle.surface}>
                        <ImageBackground source={require('../../img/home/CubeImages-AllGoodDeals.png')}
                                         style={commonStyle.pageImg}>
                            <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                                <Text style={{
                                    paddingTop: screen.width / 3,
                                    fontSize: 25,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    SPECIAL OFFERS
                                </Text>
                                <Text style={{
                                    fontSize: 40,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    Good deals for you {"\n"}
                                </Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    Find great offers from the best locations in{"\n"}
                                    fitness,wellness and beauty.
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>,
                    <View ref='f2' style={commonStyle.surface}>
                        <ImageBackground source={require('../../img/home/CubeImages-Fitness.png')}
                                         style={commonStyle.pageImg}>
                            <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                                <Text style={{
                                    paddingTop: screen.width / 3,
                                    fontSize: 25,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    EXPLORE
                                </Text>
                                <Text style={{
                                    fontSize: 40,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    Discover fitness {"\n"}
                                    classes near you{"\n"}
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>,
                    <View ref='f3' style={commonStyle.surface}>
                        <ImageBackground source={require('../../img/home/CubeImages-Wellness.png')}
                                         style={commonStyle.pageImg}>
                            <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                                <Text style={{
                                    paddingTop: screen.width / 3,
                                    fontSize: 25,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    EXPLORE
                                </Text>
                                <Text style={{
                                    fontSize: 40,
                                    color: '#fff',
                                    fontFamily: 'arial'
                                }}>
                                    Discover wellness {"\n"}
                                    classes near you{"\n"}
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                ]
            );
        }

    }

    onMenuSelected = (category) => {
        this.setState({category: category});
        //点击选定类别进入事件
        this.props.navigation.navigate('SearchAnythingScene'
            , {
                // callback: (msg) => {
                // this.setState({searchKey: msg})
                // },
                category: category
            });
    };

    changeSelectType(SelectType) {
        Vibration.vibrate([0, 30, 0, 0]);
        this.setState({allPageList: [], selectedType: SelectType});
        page = 1;
        SelectTypeTemp = SelectType;

    }

    searchBarOnPress() {
        if (SelectTypeTemp === 'Fitness') {
            this.props.navigation.navigate('SearchAnythingScene'
                , {
                    callback: (msg) => {
                        this.setState({searchKey: msg})
                    },
                    category: this.state.category,
                    selectType: this.state.typeTemp
                });
        } else if (SelectTypeTemp === 'Drink') {
            let category = this.state.category;
            if (category === 'Vineyard') {
            this.props.navigation.navigate('VineyardScene',
                    {
                        category: this.state.category,
                        subareaObj: this.state.subareaObj
                        , type:'noScroll'
                    });
            }else if(category === 'Producer'){
                this.props.navigation.navigate('ProducerScene');
            } else if(category === 'QR'){
                this.props.navigation.navigate('PrintInteractionScreen',{type:SelectTypeTemp})//跳到扫码页面
            }else {
                this.props.navigation.navigate('VineyardScene'
                    , {
                        category: 'Vineyard',
                        subareaObj: this.state.subareaObj
                    });
            }
        } else if (SelectTypeTemp === 'Beauty') {
            this.props.navigation.navigate('BeautyScene'
                , {
                    callback: (msg) => {
                        this.setState({searchKey: msg})
                    },
                    category: this.state.category,
                    selectType: this.state.typeTemp
                });
        } else{
            this.props.navigation.navigate('SearchAnythingScene'
                , {
                    callback: (msg) => {
                        this.setState({searchKey: msg})
                    },
                    category: this.state.category,
                    selectType: this.state.typeTemp
                });
        }

    }

    areaBarOnPress() {
        this.props.navigation.navigate('SearchAnythingScene'
            , {
                callback: (msg) => {
                    this.setState({searchKey: msg})
                },
                // siteId: allPageList[page - 1][Math.abs(this.state.face % 4)].key,
                category: this.state.category,
                selectType: this.state.typeTemp
            });
    }

    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({languages});
        });

    }

    componentWillReceiveProps(nextProps) {
        const {navigation} = nextProps;
        if (!!navigation) this.changeSelectType(navigation.state.params.SelectType);
        SelectTypeTemp = navigation.state.params.SelectType;

        if (navigation.state.params && navigation.state.params.SelectType && this.state.typeTemp != navigation.state.params.SelectType)
            this.setState({typeTemp: navigation.state.params.SelectType})
    }

    topNavigation(tapName, tapNameUppercase) {
        return (
            <TouchableOpacity
                style={[commonStyle.tabTextInfoStyle, {}]}
                underlayColor="#d9d9d9"
                onPress={() => {
                    this.changeSelectType(tapName);
                    this.setState({face: 0, typeTemp: tapName});
                }}>
                <View
                    style={[commonStyle.tabViewTextStyle, {backgroundColor: this.getBackgroundColor(tapName),}]}>
                    <Text style={[commonStyle.tabTextStyle, {color: this.getColor(tapName)}]}>
                        {tapNameUppercase}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <LinearGradient style={[commonStyle.containerExplore,{}]} colors={colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
            >
                <View style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                }]}>
                    <TouchableOpacity
                        style={[commonStyle.searchBar,{justifyContent: 'space-between', }]}
                        underlineColorAndroid='white'
                        onPress={() => {
                        this.searchBarOnPress()
                    }}>
                        <View style={{flexDirection:'row',alignSelf:'flex-start'}}>
                        <Image source={require('../../img/nearby/Search.png')} style={commonStyle.searchIcon}/>
                            <Text
                                style={{
                                    paddingLeft: 10,
                                    fontSize: 14,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    color: '#e5e5e5',
                                    fontFamily: 'arial'
                                }}
                            >{this.state.searchKey} </Text>
                            {this.state.searchKey === 'What to' ? <Text
                                style={{
                                    fontSize: 14,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                    fontFamily: 'arial'
                                }}
                            >search?</Text> : <Text/>}
                        </View>
                        {/*<TouchableOpacity*/}
                            {/*onPress={() => {*/}
                                {/*this.props.navigation.navigate('PrintInteractionScreen',{type:SelectTypeTemp})//跳到扫码页面*/}
                        {/*}}>*/}
                            {/*<Image source={require('../../img/nearby/QR.png')}*/}
                                   {/*style={[commonStyle.searchIcon,*/}
                                       {/*{*/}
                                           {/*paddingLeft: 10,*/}
                                           {/*paddingRight: 10,*/}
                                           {/*zIndex: 666,*/}
                                           {/*width: 20,*/}
                                           {/*height: 20,*/}
                                           {/*tintColor: '#fff'*/}
                                       {/*}]}*/}

                            {/*/>*/}
                        {/*</TouchableOpacity>*/}
                    </TouchableOpacity>

                    <TouchableOpacity style={commonStyle.searchBar} underlineColorAndroid='white' onPress={(mm) => {
                        this.searchBarOnPress();
                    }}>
                        <Image source={require('../../img/nearby/locationB.png')} style={commonStyle.searchIcon}/>
                        <Text
                            style={{
                                paddingLeft: 10,
                                fontSize: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                color: '#e5e5e5'
                            }}
                        >Select the </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                fontWeight: 'bold',
                                color: '#ffffff'
                            }}
                        >area</Text>
                    </TouchableOpacity>
                </View>
                <View style={[commonStyle.tabViewStyle]}>
                    {this.topNavigation('Beauty', I18n.t('BEAUTY'))}
                    {this.topNavigation('Wellness', I18n.t('WELLNESS'))}
                    {this.topNavigation('Fitness', I18n.t('FITNESS'))}
                    {this.topNavigation('Drink', I18n.t('DRINK'))}
                </View>
                {this.SelectView()}

            </LinearGradient>
        )
    }

    getColor(typeName) {
        return this.state.selectedType == typeName ? '#f4cad8' : '#ffffff'
    }

    getBackgroundColor(typeName) {
        return this.state.selectedType == typeName ? '#4A4C7D' : '#4A4C7D00'
    }

    componentDidMount() {
        this.props.navigation.setParams({});
        this.setState({typeTemp: this.props.navigation.state.params && this.props.navigation.state.params.SelectType ? this.props.navigation.state.params.SelectType : 'Beauty'})
        // setTimeout(() => {
        //     this.sensorDeg();
        // }, 10);


    }

    // timestamp = 0
    // observable = null
    // angle = [0, 0, 0]
    //
    // gyrHandler = (x, y, z, timestamp) => {
    //     if (Math.floor(Math.abs(y) * 100) === 0) return;
    //     if (Math.floor(Math.abs(x) * 100) === 0) return;
    //
    //     if (this.timestamp != 0) {
    //         // event.timesamp表示当前的时间，单位是纳秒（1百万分之一毫秒）
    //         let dT = (timestamp - this.timestamp) / (1000);
    //         this.angle = [this.angle[0] + x * dT, this.angle[1] + y * dT];
    //         let degX = Math.floor(this.angle[0] * (180 / Math.PI) % 90) * screen.width / 90;
    //         let degY = Math.floor(this.angle[1] * (180 / Math.PI) % 90) * screen.width / 90;
    //         this.refs['swiper'].sensorDeg(degX, degY)
    //     }
    //     this.timestamp = timestamp;
    // }
    //
    // gyr = null
    //
    // createGyroscope() {
    //     this.gyr = new Gyroscope({
    //         updateInterval: 12
    //     });
    //     this.gyr.then(observable => {
    //         this.observable = observable;
    //         observable.subscribe(({x, y, z, timestamp}) => {
    //             this.gyrHandler(x, y, z, timestamp);
    //         });
    //     })
    //         .catch(error => {
    //             console.log("The sensor is not available");
    //         });
    // }
    //
    // sensorDeg() {
    //     this.createGyroscope();
    //     // setTimeout(() => {
    //     //     // console.warn('stop')
    //     //     this.refs['swiper'].sensorDeg(0, 0)
    //     //     this.observable.stop();
    //     //     delete this.gyr
    //     // }, 5000);
    // }
}

export default ExploreScene
