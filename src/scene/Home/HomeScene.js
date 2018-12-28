import React, {PureComponent} from 'react'
import LinearGradient from 'react-native-linear-gradient';
import {
    AsyncStorage,
    BackHandler,
    BVLinearGradient,
    Image,
    StatusBar,
    StyleSheet,
    Text, ToastAndroid,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native'

import {screen} from '../../common'
import {getHomePages} from '../../api'
import Cube from '../Cube/Cube';
import CubeContentItem from "../Cube/CubeContentItem";

import I18n, { getLanguages } from 'react-native-i18n';
import en from  '../../scene/demo&test/react-native-i18n_example/translations/en'
import es from  '../../scene/demo&test/react-native-i18n_example/translations/es'
import fr from  '../../scene/demo&test/react-native-i18n_example/translations/fr'
import frCA from  '../../scene/demo&test/react-native-i18n_example/translations/fr-CA'
import cn from  '../../scene/demo&test/react-native-i18n_example/translations/cn'
import {NavigationActions} from "react-navigation";
import {android} from "../../common/Device";
import {commonStyle} from "../../widget/commonStyle";
import LocalImage from "../../widget/LocalImage";
import * as ScreenUtil from "../Common/ScreenUtil";

type
Props = {
    navigation: any,
}
type
State = {
    discounts: Array < Object >,
    dataList: Array < Object >,
    refreshing: boolean,
    // pages:Array< Object >,
}
I18n.fallbacks = true;

// Available languages
I18n.translations = {
    'en': en,
    'fr':fr,
    'fr-CA': frCA,
    'es': es,
    'zh-Hans-CN':cn,
};

var colorTemp = screen.colorTemp;
export default class HomeScene extends PureComponent<Props, State> {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });


    componentWillUnmount() {
        // if (android) {
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        //     lastBackPressed = null;
        // }
    }
    onBackAndroid = () => {
        const { dispatch, Navigator } = this.props;
        if (Navigator.routes[0] &&
            Navigator.routes[0].routes &&
            Navigator.routes[0].routes.length > 1) {
            dispatch( NavigationActions.back() );
            return true;
        }
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        lastBackPressed = Date.now();
        ToastAndroid.show('再点击一次退出应用', ToastAndroid.SHORT);
        return true;
    };


    constructor(props: Props) {
        super(props);
        this.state = {
            languages: [],
            discounts: [],
            dataList: [],
            refreshing: false,
            face: 0,
            SelectType: null,
            viewRef: null,
            backgroundColorList: [],
            gotoPage: null,
            touchState: false,
            time: 5000,
            pages: [],
        }
    }

    flipLeft() {
        var face = ++this.state.face;
        this.setState({face: face});
        try {
            this.refs['swiper'].flipLeft(face);
        } catch (e) {
        }
    }

    flipRight() {
        var face = --this.state.face;
        this.setState({face: face});
        this.refs['swiper'].flipRight(face);
    }

    interval = -1;
    timeout = -1;

    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({ languages });
        });

    }

    componentDidMount() {
        // if (android) {
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        // }
        try {
            AsyncStorage.getItem(
                'searchLogs',
                (error, result) => {
                    if (error) {
                        // alert('取值失败:'+error);
                    } else {
                        // alert('取值成功:'+JSON.parse(result));
                        var res = JSON.parse(result);
                        if (res === null) {
                            res = [];
                        }
                        AsyncStorage.setItem('searchLogs', JSON.stringify(res),);
                        AsyncStorage.setItem('searchLocationLogs', JSON.stringify(res),)
                    }
                }
            )
        } catch (error) {
            // alert('失败'+error);
        }
        try {
            AsyncStorage.getItem(
                'searchLocationLogs',
                (error, result) => {
                    if (error) {
                        // alert('取值失败:'+error);
                    } else {
                        // alert('取值成功:'+JSON.parse(result));
                        var res = JSON.parse(result);
                        if (res === null) {
                            res = [];
                        }
                        AsyncStorage.setItem('searchLocationLogs', JSON.stringify(res),)
                    }
                }
            )
        } catch (error) {
            // alert('失败'+error);
        }

        // this.requestData();
        this.props.navigation.setParams({
            flipRight: this.flipRight.bind(this),
            flipLeft: this.flipLeft.bind(this),
            GetCubeContent: this.GetCubeContent.bind(this),
        });
        this.activateTimer();
    }

    activateTimer() {
        this.interval = setInterval(() => {
                this.runCube();
            },
            this.state.time
        );
    }

    runCube() {
        if (!this.state.touchState) {
            this.flipLeft()
        } else {
            clearInterval(this.interval);

            this.timeout = setTimeout(() => {
                    this.setState({touchState: false});
                    this.activateTimer();
                },
                5000
            );
        }
    }


    // onCellSelected = (info: Object) => {
    //     StatusBar.setBarStyle('default', false)
    //     this.props.navigation.navigate('GroupPurchase', {info: info})
    // };

    keyExtractor = (item: Object, index: number) => {
        return item.id
    };


    onGridSelected = (index: number) => {
        let discount = this.state.discounts[index];

        if (discount.type == 1) {
            StatusBar.setBarStyle('default', false);

            let location = discount.tplurl.indexOf('http');
            let url = discount.tplurl.slice(location);
            this.props.navigation.navigate('Web', {url: url})
        }
    };

    onMenuSelected = (msg) => {
        //点击获取页面信息

        this.props.navigation.state.params.flipLeft(msg.type);
        this.props.navigation.navigate('Explore', {SelectType: msg.type, in: true})
    };

    broadcastHomePage() {
        this.pageinterval = setInterval(() => {
                var i = 0;
                this.setState({
                    pages: result[i]
                });
                i++
            },
            30000
        );
    }


    GetCubeContent() {
        var a = getHomePages();
        var b = [];
        var result = [];
        var k = 0;

        for (var i = 0; i < a.length; ++i) {
            if (i % 4 == 0) {
                b = [];
                for (var j = 0; j < 4; ++j) {
                    if (a[i + j] == undefined) {
                        continue;
                    } else {
                        b[j] = a[i + j];
                    }
                }
                result[k] = b;
                k++;
            }

        }
        let menuItems = result.map(
            (info, i) => (
                info.map(
                    (temp, j) => (
                        <CubeContentItem
                            ref={'F' + j + ''}
                            key={j}
                            img={temp.img}
                            tag={temp.tag}
                            title={temp.title}
                            prompt={temp.prompt}
                            category={temp.category}
                            onPress={() => {
                                this.onMenuSelected && this.onMenuSelected(temp)
                            }}
                        />
                    )
                )
            )
        );
        return menuItems
    }

    PauseAndWakeUp() {
        clearTimeout(this.timeout);
        clearInterval(this.interval);
        this.timeout = setTimeout(() => {
                this.setState({touchState: false});
                this.activateTimer();
            },
            10000
        );
    }
    topNavigation(tapName,tapNameUppercase){
        return(
            <TouchableOpacity
                style={[styles.tabTextInfoStyle, {}]}
                activeOpacity={0.8}
                underlayColor="#d9d9d9"
                onPress={() => {
                    this.props.navigation.state.params.flipLeft(tapName);
                    this.props.navigation.navigate('Explore', {SelectType: tapName})
                }}>
                <View style={styles.tabViewTextStyle}>
                    <Text style={styles.tabTextStyle}>
                        {tapNameUppercase}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
           <LinearGradient style={styles.linearGradientStyle} colors={colorTemp}
                           start={{x: 0, y: 0}}
                           end={{x: 1, y: 1}}
           >
           <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>

               <View style={[styles.header, {
                   justifyContent: 'center',
                   alignItems: 'center',
                   marginTop: 20
               }]}>
                   <TouchableOpacity
                       activeOpacity={0.8}
                       style={styles.searchBar}
                       underlineColorAndroid='white'
                       onPress={() => {
                           this.props.navigation.navigate('SearchAnythingScene'
                               , {
                                   callback: (msg) => {
                                       this.setState({searchKey: msg})
                                   }
                               });
                       }}>
                       <Image source={LocalImage.searchIcon} style={styles.searchIcon}/>
                       <View style={{
                           flexDirection: 'row',
                           width: screen.width * 0.8,
                           justifyContent: 'center',
                           alignItems: 'center',
                           alignSelf: 'center',
                       }}>
                           <Text style={[styles.header, {
                               color: '#ffffff',
                               paddingTop: 5,
                               marginLeft: 5,
                               fontSize: ScreenUtil.setSpText(16),
                           }]}>Search for </Text>
                           <Text style={{
                               fontWeight: '500',
                               color: '#ffffff',
                               paddingTop: 5,
                               marginLeft: 5,
                               fontSize: ScreenUtil.setSpText(16),
                           }}>Businesses</Text>
                       </View>
                   </TouchableOpacity>
                   <View style={styles.tabViewStyle}>
                       {this.topNavigation('Beauty', I18n.t('BEAUTY'))}
                       {this.topNavigation('Wellness', I18n.t('WELLNESS'))}
                       {this.topNavigation('Fitness', I18n.t('FITNESS'))}
                       {this.topNavigation('Drink', I18n.t('DRINK'))}
                   </View>
                   <View style={{
                       marginTop: 0,
                       opacity: 0.5,
                       // borderBottom: 1,
                       borderBottomWidth: screen.onePixel,
                       width: screen.width,
                       flexDirection: 'row'
                   }}/>
               </View>


               <View style={[styles.cubeStyle,commonStyle.center]}>
                   <Cube ref='swiper'
                       //style={styles.cubeStyle}
                         position={this.state.face}
                         touchState={() => {
                             // this.setState({touchState: true});
                             // clearTimeout(this.timeout);
                             // clearInterval(this.interval);
                             // this.timeout = setTimeout(() => {
                             //         this.setState({touchState: false});
                             //         this.activateTimer();
                             //     },
                             //     5000
                             // );
                         }}
                         reduceface={() => {
                             this.setState({face: --this.state.face});
                             this.PauseAndWakeUp()
                         }}
                         addface={() => {
                             this.setState({face: ++this.state.face});
                             this.PauseAndWakeUp()
                         }}>
                       {this.GetCubeContent()}
                   </Cube>
               </View>
           </SafeAreaView>
           </LinearGradient>
        )
    }
}


const styles = StyleSheet.create({

    searchBar: {
        width: screen.width * 0.95,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ffffff50',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingTop: 5,
        paddingBottom: 5,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    linearGradientStyle: {
        paddingTop: screen.statusBarHeight,
        flex: 1,
        backgroundColor: '#202020',
        width: screen.width,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    cubeStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageImg: {
        width: screen.width,
        height: screen.width,
        // resizeMode: 'contain',// 设置图片填充模式
        borderRadius: 5,
        flexDirection: 'row',
    },
    surface: {
        width: screen.width,
        height: screen.width,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#282828a3',
        backgroundColor: '#fff',
        flex: 1,
    },
    tabViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screen.width * 0.95,
        flexDirection: 'row',
    },
    tabTextInfoStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        width: screen.width * 0.95 / 4,
        alignItems: 'center',
    },
    tabViewTextStyle: {
        backgroundColor: '#4A4C7D',
        width: screen.width * 0.95 / 4 - screen.width * 0.01,
        // alignItems: 'center',
        // paddingTop: 8,
        // paddingBottom: 8,
        borderRadius: 5,
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    tabTextStyle: {
        fontSize: ScreenUtil.setSpText(12),
        fontFamily: 'arial',
        color: '#ffffff',
        textAlignVertical: 'center',
    },
});
