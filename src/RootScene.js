import React, {PureComponent} from 'react'
import {StackNavigator, TabBarBottom, TabNavigator} from 'react-navigation'

import color from './widget/color'
import TabBarItem from './widget/TabBarItem'
import HomeScene from './scene/Home/HomeScene'
import Events from './scene/Events/Events'
import ExploreScene from './scene/Explore/ExploreScene'
import ExploreRangeScene from './scene/Explore/ExploreRangeScene'
import MineScene from './scene/Mine/MineScene'

import WebScene from './widget/WebScene'
import GroupPurchaseScene from './scene/GroupPurchase/GroupPurchaseScene'
import SearchAnythingInfoScene from './scene/Explore/SearchAnythingInfoScene'
import {translate} from './i18n/i18n';
import AdInfo from "./scene/AD/AdInfo";
import SearchAnythingScene from "./scene/Explore/SearchAnythingScene";
import AMapSelect from "./scene/Api/AMapSelect";
import CommodityDetails from "./scene/GroupPurchase/CommodityDetails";
import PrintInteractionScreen from "./scene/Common/PrintInteractionScreen";
import CompanyScene from "./scene/GroupPurchase/CompanyScene";

import ChatWithUsScene from './scene/Mine/ChatWithUsScene'
import ContactScene from './scene/Mine/ContactScene'
import FAQScene from './scene/Mine/FAQScene'
import LogOutScene from './scene/Mine/LogOutScene'
import SettingScene from './scene/Mine/SettingScene'
import ScheduleScene from "./scene/GroupPurchase/ScheduleScene";
import ScheduleSceneChild from "./scene/GroupPurchase/ScheduleSceneChild";
import ScheduleSceneChildDetail from "./scene/GroupPurchase/ScheduleSceneChildDetail";
import I18n, {getLanguages} from "react-native-i18n";
import en from './scene/demo&test/react-native-i18n_example/translations/en'
import es from './scene/demo&test/react-native-i18n_example/translations/es'
import fr from './scene/demo&test/react-native-i18n_example/translations/fr'
import frCA from './scene/demo&test/react-native-i18n_example/translations/fr-CA'
import cn from './scene/demo&test/react-native-i18n_example/translations/cn'
import ProducerScene from "./scene/Explore/Drink/Producer/ProducerScene";
import CountryListScene from "./scene/Explore/Drink/Vineyard/CountryListScene";
import VineyardScene from "./scene/Explore/Drink/Vineyard/VineyardScene";
import ProducerDetail from './scene/Explore/Drink/Producer/ProducerDetail'
import WineDetail from './scene/Explore/Drink/Producer/WineDetail'
import QRDetailScene from "./scene/Explore/Drink/QRDetailScene";
import {StatusBar, View} from "react-native";
import Drink2SearchScene from "./scene/Explore/Drink/Drink2SearchScene";
import BeautyScene from "./scene/Explore/Beauty/BeautyScene";
import BeautyDetail from "./scene/Explore/Beauty/BeautyDetail";
import Beauty2SearchScene from "./scene/Explore/Beauty/Beauty2SearchScene";
import VineyardDetail from "./scene/Explore/Drink/Vineyard/VineyardDetail";

const lightContentScenes = ['Home', 'Mine'];

function getCurrentRouteName(navigationState: any) {
    if (!navigationState) {
        return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
        return getCurrentRouteName(route)
    }
    return route.routeName
}


I18n.fallbacks = true;

// Available languages
I18n.translations = {
    'en': en,
    'fr': fr,
    'fr-CA': frCA,
    'es': es,
    'zh-Hans-CN': cn,
};

class RootScene extends PureComponent<{}> {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    state = {languages: []};
    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({languages});
        });
        // const is24Hour = DeviceInfo.is24Hour(true); // true
        // const deviceCountry = DeviceInfo.getDeviceCountry(); // "US"
        // DeviceInfo.default.getBatteryLevel().then(batteryLevel => {
            // 0.759999

        // });

    }

    constructor() {
        super();
    }
    _configureScene(route, routeStack){
        let configure = Navigator.SceneConfigs.PushFromRight;
        switch(route.configure){
            case Consts.FloatFromLeft:
                configure = Navigator.SceneConfigs.FloatFromLeft;
                break;
            case Consts.FloatFromBottom:
                configure = Navigator.SceneConfigs.FloatFromBottom;
                break;
        }
        return {
            ...configure,
            gestures:{}//或者改成null
        };
    };
    render() {
        return (
           <View style={{flex: 1}}>
              <StatusBar
                  backgroundColor="#4cccff00"
                  barStyle="light-content"
                  translucent={true}
              />
                <Navigator
                    transitionConfig={this.configureScene}
                    // configureScene={this._configureScene}
                    // configureScene={this._configureScene.bind(this)}
                    onNavigationStateChange={
                        (prevState, currentState) => {
                            const currentScene = getCurrentRouteName(currentState);
                            const previousScene = getCurrentRouteName(prevState)
                            // if (previousScene !== currentScene) {
                            //     if (lightContentScenes.indexOf(currentScene) >= 0) {
                            //         StatusBar.setBarStyle('light-content')
                            //     } else {
                            //         StatusBar.setBarStyle('dark-content')
                            //     }
                            // }
                        }
                    }
                >
                </Navigator>
        </View>
        )
    }

    configureScene(route, routeStack) {
        if (route.type == 'Bottom') {
            // return Navigator.SceneConfigs.FloatFromBottom; // 底部弹出
            return Navigator.SceneConfigs.PushFromLeft; // 右侧弹出
        }
        return Navigator.SceneConfigs.PushFromRight; // 右侧弹出
    }
}

const Tab = TabNavigator(
    {
        Home: {
            screen: HomeScene,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: translate(I18n.t('HOME')),
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./img/tabbar/Home.png')}
                        selectedImage={require('./img/tabbar/Home.png')}
                    />
                )
            }),
        },
        Explore: {
            screen: ExploreScene,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: I18n.t('EXPLORE'),
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./img/tabbar/Explore.png')}
                        selectedImage={require('./img/tabbar/Explore.png')}
                    />
                )
            }),
        },

        Events: {
            screen: Events,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: I18n.t('EVENTS'),
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./img/tabbar/Booking.png')}
                        selectedImage={require('./img/tabbar/Booking.png')}
                    />
                )
            }),
        },

        Love: {
            screen: PrintInteractionScreen,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: I18n.t('LOVE'),
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./img/tabbar/favorite.png')}
                        selectedImage={require('./img/tabbar/favorite.png')}
                    />
                )
            }),
        },
        Profile: {
            screen: MineScene,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: I18n.t('PROFILE'),
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./img/tabbar/Profile.png')}
                        selectedImage={require('./img/tabbar/Profile.png')}
                    />
                ),
                labelStyle: {
                    fontSize: 20, // 文字大小
                },
            }),
        },
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        lazy: true,
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {
            activeTintColor: color.tabBarActiveTintColor,
            inactiveTintColor: color.tabBarInactiveTintColor,
            labelStyle: {
                fontSize: 10, // 文字大小

            },
        },
    }
);

const Navigator = StackNavigator(
    {
        Tab: {screen: Tab,navigationOptions: {
                header:null,
                headerBackTitle: null,
                headerTintColor: '#333333',
                showIcon: true,
            }},
        Home: {screen: HomeScene},
        Web: {screen: WebScene},
        GroupPurchase: {screen: GroupPurchaseScene},
        CommodityDetails: {screen: CommodityDetails},
        SearchAnythingInfoScene: {screen: SearchAnythingInfoScene},
        AdInfo: {screen: AdInfo},
        SearchAnythingScene: {screen: SearchAnythingScene},
        ExploreRangeScene: {screen: ExploreRangeScene},
        AMapSelect: {screen: AMapSelect},
        CompanyScene: {screen: CompanyScene},

        ChatWithUsScene: {screen: ChatWithUsScene},
        ContactScene: {screen: ContactScene},
        FAQScene: {screen: FAQScene},
        LogOutScene: {screen: LogOutScene},
        SettingScene: {screen: SettingScene},
        ScheduleScene: {screen: ScheduleScene},
        ScheduleSceneChild: {screen: ScheduleSceneChild},
        ScheduleSceneChildDetail: {screen: ScheduleSceneChildDetail},
        BeautyScene:{screen:BeautyScene},
        BeautyDetail:{screen:BeautyDetail},
        Beauty2SearchScene:{screen:Beauty2SearchScene},
        Drink2SearchScene:{screen:Drink2SearchScene},
        ProducerScene: {screen: ProducerScene},
        WineDetail:{screen:WineDetail},
        VineyardScene: {screen: VineyardScene},
        VineyardDetail:{screen:VineyardDetail},
        CountryListScene: {screen: CountryListScene},
        ProducerDetail: {screen: ProducerDetail},
        PrintInteractionScreen: {screen: PrintInteractionScreen},
        // QRWineDetail:{screen:QRWineDetail}
        QRDetailScene: {screen: QRDetailScene}
    },
    // {
    //     // headerMode: 'screen',
    //     navigationOptions: {
    //         // header: {visible: false},
    //         header:null,
    //         headerBackTitle: null,
    //         headerTintColor: '#333333',
    //         showIcon: true,
    //     },
    //
    // }
);

export default RootScene
