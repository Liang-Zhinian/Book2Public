import React, {Component} from 'react';
import {
    ActivityIndicator,
    BVLinearGradient,
    Image,
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {getArea,} from "../../../../api";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import {Heading3} from "../../../../widget/Text";
import {screen} from "../../../../common";
import LinearGradient from "react-native-linear-gradient";

const countryImgList={
    'Italy':require('../../../../img/nearby/Drink/area/country/Italy.png'),
    'Spain':require('../../../../img/nearby/Drink/area/country/Spain.png'),
    'France':require('../../../../img/nearby/Drink/area/country/France.png'),
    'United States':require('../../../../img/nearby/Drink/area/country/United_States.png'),
    'China':require('../../../../img/nearby/Drink/area/country/China.png'),
    'Argentina':require('../../../../img/nearby/Drink/area/country/Argentina.png'),
    'Chile':require('../../../../img/nearby/Drink/area/country/Chile.png'),
    'Australia':require('../../../../img/nearby/Drink/area/country/Australia.png'),
    'South Africa':require('../../../../img/nearby/Drink/area/country/South_Africa.png'),
    'Germany':require('../../../../img/nearby/Drink/area/country/Germany.png'),
    'Portugal':require('../../../../img/nearby/Drink/area/country/Portugal.png'),
    'Romania':require('../../../../img/nearby/Drink/area/country/Romania.png'),
    'Greece':require('../../../../img/nearby/Drink/area/country/Greece.png'),
    'Russia':require('../../../../img/nearby/Drink/area/country/Russia.png'),
    'New Zealand':require('../../../../img/nearby/Drink/area/country/New_Zealand.png'),
};


export default class CountryListScene extends Component {
    // _didFocusSubscription;
    // _willBlurSubscription;
    // _selectionMode = true;
    static navigationOptions = ({navigation}: any) => ({
        // gesturesEnabled:true,                         //开启手势操作
        // gestureDirection:'inverted',
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            position: 'bottom',
            style:{},
            countryList: [],
            regionList: [],
            subregionList: [],
            areaList: [],
            subareaList: [],
            isRefreshing:false,
            Temp:null,
            waiting: false,//防多次点击
            isLoading:false
        };
        // this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        // );
    }


    componentDidMount() {
        // this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        // );
        // this._selectionMode = true;
    }

    // onBackButtonPressAndroid = () => {
    //     if (this.isSelectionModeEnabled()) {
    //         this.disableSelectionMode();
    //         this.props.screenProps.toggle();
    //         return true;
    //     } else {
    //
    //         return false;
    //     }
    // };
    // isSelectionModeEnabled(){return this._selectionMode;}
    // disableSelectionMode(){ this._selectionMode = true; }
    componentWillUnmount() {
        // if (Platform.OS === 'android') {
        //    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        // }
        // this._didFocusSubscription && this._didFocusSubscription.remove();
        // this._willBlurSubscription && this._willBlurSubscription.remove();
    }
    // onBackAndroid = () => {
    //     // this.goBack(); // works best when the goBack is async
    //     return true;
    // };

    componentWillMount() {
        // if (Platform.OS === 'android') {
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        // }
        InteractionManager.runAfterInteractions(() => {
            this.setState({isLoading:true});
            getArea('country', '')
                .then((msg) => {
                    this.setState({countryList: DrinkDetailDataUtils.requestAreaData(msg), isLoading:false})
                })
                .catch((e) => {
                    console.warn(e)
                });
        });
    }

    _getRegion(region_id) {
        this.setState({isLoading:true});
        InteractionManager.runAfterInteractions(() => {
            getArea('region', region_id)
                .then((msg) => {
                    this.setState({
                        regionList: DrinkDetailDataUtils.requestAreaData(msg),
                        isLoading:false
                    })
                })
                .catch((e) => {
                    console.warn(e)
                });
        });
    }

    _getSubregion(region_id){
        this.setState({isLoading:true});
        InteractionManager.runAfterInteractions(() => {
            getArea('subregion', region_id)
                .then((msg) => {
                    this.setState({subregionList: DrinkDetailDataUtils.requestAreaData(msg), isLoading:false})
                }).catch((error)=>{
                console.warn(error)
            });
        });
    }

    _getArea(region_id) {
        this.setState({isLoading:true});
        InteractionManager.runAfterInteractions(() => {
            getArea('area', region_id)
                .then((msg) => {
                    this.setState({
                        areaList: DrinkDetailDataUtils.requestAreaData(msg),
                        isLoading:false
                    })
                })
                .catch((e) => {
                    console.warn(e)
                });
        });
    }
    _getSubarea(region_id){
        this.setState({isLoading:true});
        InteractionManager.runAfterInteractions(() => {
            getArea('subarea', region_id)
                .then((msg) => {
                    this.setState({
                        subareaList: DrinkDetailDataUtils.requestAreaData(msg),
                        isLoading:false
                    })
                })
                .catch((e) => {
                    console.warn(e)
                });
        });
    }
    showLoading() {
        return (
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="large" color="#EDDEFF" />
            </View>
        )
    }
    renderList(data,index){
        console.log('CountryListScene renderList', data, index)
        let getFun=[this._getRegion.bind(this),this._getSubregion.bind(this),this._getArea.bind(this),this._getSubarea.bind(this)];

        let AreaList = data.map((item) => {

            // let countryName= item.name.replace(/ /g, "_" );
            let img=countryImgList[item.name];
            let getImg=[
                <Image style={{width:28,height:18.4}} source={img} />
                ,<Image style={{width:28,height:28}}  source={require('../../../../img/nearby/Drink/area/Region.png')} />
                ,<Image style={{width:28,height:28}} source={require('../../../../img/nearby/Drink/area/Subregion.png')} />
                ,<Image style={{width:28,height:28}} source={require('../../../../img/nearby/Drink/area/Area.png')} />
                ,<Image style={{width:28,height:28}} source={require('../../../../img/nearby/Drink/area/Subarea.png')} />
            ];
            return(
                <View style={styles.container}>
                    <TouchableOpacity
                        disabled={this.state.waiting}
                        activeOpacity={0.8}
                        onPress={() =>{
                            // this._selectionMode = true;
                            // this.props.navigator.push(
                            //     {
                            //         component: RegionListScene,
                            //         // passProps: {'url': dealurl}
                            //         region_id:item.id
                            //     }
                            if (index<getFun.length) {
                                getFun[index](item.id);
                                this.scrollToPage(index+1);
                            } else {
                                console.log(item.id);
                                this.props._toggle();
                                this.props.getSubarea(item)
                            }

                            // this.props.navigation.navigate(
                            //     'RegionListScene',
                            //     {region_id:item.id, type:'noScroll'})

                            // );
                            this.setState({waiting: true});
                            setTimeout(()=> {
                                this.setState({waiting: false})
                            }, 1000);//设置的时间间隔由你决定
                        }}
                    >
                        <View style={[styles.content, this.props.style]}>
                            {getImg[index]}
                            <Heading3  style={{color: '#fff',paddingLeft:10}}>{item.name}</Heading3>
                            <View style={{flex: 1, backgroundColor: 'blue'}} />
                            <Image style={styles.arrow} source={require('../../../../img/mine/icon_homepage_Right_arrow.png')} />
                        </View>
                    </TouchableOpacity>
                    <View style={{width:screen.width,marginLeft:55,height:screen.onePixel,backgroundColor:'#ffffff50'}}/>
                </View>
            )
        });
        // console.log(AreaList)
        return AreaList
    }
    scrollToPage(index){
        this.scrollView.scrollTo({ x: index*screen.width ,animated: true})
    }
    scrollToLastPage(index){
        this.scrollView.scrollTo({ x: index*screen.width ,animated: true})
    }
    renderCountryList(){
        let {countryList,regionList,subregionList,areaList,subareaList} = this.state;
        let data = [countryList,regionList,subregionList,areaList,subareaList];
        let menuViews = [];
        let title=['Country','Region','Subregion','Area','Subarea'];
        let color = ['#4ff0','#f4f0','#ff40','#44f0','#7740',];

        for (let i =0;i<=4;i++) {
            let view = <View
                ref={'menuViews'+i}
                style={{
                    backgroundColor: color[i],
                    width: screen.width
                }}
            >
                {/*<View>*/}
                {/*<Text style={{*/}
                {/*alignSelf: 'center',*/}
                {/*color: '#ffffff',*/}
                {/*fontSize: 14,*/}
                {/*fontFamily: 'arial',*/}
                {/*}}>Country</Text>*/}
                {/*</View>*/}
                <View style={{
                    // alignItems: 'center',
                    // justifyContent:'space-between',
                    flexDirection: 'row',
                    width: screen.width,
                }}>
                    <View style={{alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={this.state.waiting}
                            activeOpacity={0.5}
                            style={{flexDirection:'row',alignSelf: 'center',justifyContent:'center',alignItems:'center'}}
                            onPress={() => {
                                i>0?this.scrollToLastPage(i-1):this.props._toggle();
                                this.setState({waiting: true});
                                setTimeout(()=> {
                                    this.setState({waiting: false})
                                }, 2000);//设置的时间间隔由你决定
                            }}>
                            <Image source={require('../../../../img/mine/icon_homepage_left_arrow.png')}
                                   style={[styles.callbackIcon, {}]}
                                   onPress={() => {
                                       // i>0?this.scrollToLastPage(i-1):this.props._toggle();
                                   }}
                            />
                            <Text style={{
                                color: '#f4cad8',
                                fontSize: 14,
                                fontWeight:'100',
                                fontFamily: 'arial',
                            }}>{i>0&&title[i-1]}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<View style={{alignSelf: 'center',justifyContent:'center',alignItems:'center'}}>*/}
                    {/*<Text style={{*/}
                    {/*color: '#f4cad8',*/}
                    {/*fontSize: 16,*/}
                    {/*fontWeight:'100',*/}
                    {/*fontFamily: 'arial',*/}
                    {/*}}>Country</Text>*/}
                    {/*</View>*/}
                    <View style={{alignSelf: 'center',position: 'absolute',left:0, right: 0}}>
                        <Text style={{
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 14,
                            fontFamily: 'arial',
                        }}>{title[i]}</Text>
                    </View>
                </View>
                <ScrollView
                    ref={'scrollViewV'}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            // onRefresh={() => this.onHeaderRefresh()}
                            tintColor='gray'
                        />
                    }>
                    {this.state.isLoading?this.showLoading():this.renderList(data[i],i)}
                </ScrollView>
            </View>;
            menuViews.push(view)
        }
        return (
            <ScrollView
                ref={ (ref) => this.scrollView = ref }
                style={{
                    width: screen.width,
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={true}
                pagingEnabled
                scrollEnabled={false}
                // onScroll={(e) => this.onScroll(e)}
            >
                <View style={{flexDirection: 'row',}}>
                    {menuViews}
                </View>
            </ScrollView>
        )
    }
    render() {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 1, y:0}}
                            end={{x: 0, y:1}}
                            style={[styles.linearGradient]}>
                {/*<View style={{*/}
                {/*// alignItems: 'center',*/}
                {/*// justifyContent:'space-between',*/}
                {/*flexDirection: 'row',*/}
                {/*width: screen.width,*/}
                {/*paddingTop:10,*/}
                {/*paddingBottom:10,*/}
                {/*}}>*/}
                {/*<View style={{alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'center'}}>*/}
                {/*<TouchableOpacity*/}
                {/*activeOpacity={0.5}*/}
                {/*style={{flexDirection:'row',alignSelf: 'center',justifyContent:'center',alignItems:'center'}}*/}
                {/*onPress={() => {*/}
                {/*// this.props.navigation.goBack();*/}
                {/*}}>*/}
                {/*<Image source={require('../../../../img/mine/icon_homepage_left_arrow.png')}*/}
                {/*style={[styles.callbackIcon, {}]}*/}
                {/*onPress={() => {*/}
                {/*this.props.navigation.goBack();*/}
                {/*}}*/}
                {/*/>*/}
                {/*<Text style={{*/}
                {/*color: '#f4cad8',*/}
                {/*fontSize: 16,*/}
                {/*fontWeight:'100',*/}
                {/*fontFamily: 'arial',*/}
                {/*}}>Find Vineyard</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}
                {/*<View style={{alignSelf: 'center',justifyContent:'center',alignItems:'center'}}>*/}
                {/*<Text style={{*/}
                {/*color: '#f4cad8',*/}
                {/*fontSize: 16,*/}
                {/*fontWeight:'100',*/}
                {/*fontFamily: 'arial',*/}
                {/*}}>Find Vineyard</Text>*/}
                {/*</View>*/}
                {/*<View style={{alignSelf: 'center',position: 'absolute',left:0, right: 0}}>*/}
                {/*<Text style={{*/}
                {/*alignSelf: 'center',*/}
                {/*color: '#ffffff',*/}
                {/*fontSize: 14,*/}
                {/*fontFamily: 'arial',*/}
                {/*}}>Country</Text>*/}
                {/*</View>*/}
                {/*</View>*/}
                <View style={{ flex:1,backgroundColor: '#0001',width:screen.width,}}>
                    {this.renderCountryList()}
                    {/*<ScrollView*/}
                    {/*refreshControl={*/}
                    {/*<RefreshControl*/}
                    {/*refreshing={this.state.isRefreshing}*/}
                    {/*// onRefresh={() => this.onHeaderRefresh()}*/}
                    {/*tintColor='gray'*/}
                    {/*/>*/}
                    {/*}>*/}
                    {/*{this.renderList()}*/}
                    {/*</ScrollView>*/}
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     flexDirection: 'column',
    //     backgroundColor: '#ffffff',
    //     // paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
    // },
    content: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    subtitleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    arrow: {
        width: 16,
        height: 16,
        marginLeft: 5,
        tintColor:'#fff'
    },

    container: {
        flex: 1,
    },
    linearGradient: {
        flex: 1,
        width: screen.width,
        paddingTop:screen.statusBarHeight
    },
    callbackIcon: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 10,
        marginRight: 5,
        tintColor:'#f4cad8'
        // alignSelf: 'flex-start',
    },

});

