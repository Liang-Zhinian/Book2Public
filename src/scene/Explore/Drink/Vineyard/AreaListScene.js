import React, {Component} from 'react';
import {BVLinearGradient,Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getArea} from "../../../../api";
import DrinkDetailDataUtils from "../DrinkDetailDataUtils";
import {Heading3} from "../../../../widget/Text";
import {screen} from "../../../../common";
import LinearGradient from "react-native-linear-gradient";
export default class AreaListScene extends Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            position: 'bottom',
            style:{},
            areaList: [],
            isRefreshing: false,
        }
    }

    componentDidMount(){
        let {region_id} = this.props.navigation.state.params;
        getArea('area', region_id)
            .then((msg) => {
                this.setState({areaList: DrinkDetailDataUtils.requestAreaData(msg)})
            })
            .catch((e) => {
                console.warn(e)
            });
    }

    componentWillMount() {

    }
    renderList(){
        let AreaList = this.state.areaList.map((item) => {
            return(
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>{
                            this.props.navigation.navigate('SubareaListScene',{region_id:item.id})
                        }}
                    >
                        <View style={[styles.content, this.props.style]}>
                            <Image style={{width:28,height:28}} source={require('../../../../img/nearby/Drink/area/Area.png')} />
                            <Heading3  style={{color: '#fff',paddingLeft:10}}>{item.name}</Heading3>
                            <View style={{flex: 1, backgroundColor: 'blue'}} />
                            <Image style={styles.arrow} source={require('../../../../img/mine/icon_homepage_Right_arrow.png')} />
                        </View>
                    </TouchableOpacity>
                    <View style={{width:screen.width*(2/3),marginLeft:55,height:screen.onePixel,backgroundColor:'#ffffff50'}}/>
                </View>
            )
        });
        return AreaList
    }

    render() {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.linearGradient]}>
                <View style={{
                    // alignItems: 'center',
                    // justifyContent:'space-between',
                    flexDirection: 'row',
                    width: screen.width*(2/3),
                }}>
                    <View style={{alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{flexDirection:'row',alignSelf: 'center',justifyContent:'center',alignItems:'center'}}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            <Image source={require('../../../../img/mine/icon_homepage_left_arrow.png')}
                                   style={[styles.callbackIcon, {}]}
                                   onPress={() => {
                                       this.props.navigation.goBack();
                                   }}
                            />
                            <Text style={{
                                color: '#f4cad8',
                                fontSize: 14,
                                fontWeight:'100',
                                fontFamily: 'arial',
                            }}>Subregion</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<View style={{alignSelf: 'center',justifyContent:'center',alignItems:'center'}}>*/}
                        {/*<Text style={{*/}
                            {/*color: '#f4cad8',*/}
                            {/*fontSize: 16,*/}
                            {/*fontWeight:'100',*/}
                            {/*fontFamily: 'arial',*/}
                        {/*}}>Subregion</Text>*/}
                    {/*</View>*/}
                    <View style={{alignSelf: 'center',position: 'absolute',left:0, right: 0}}>
                        <Text style={{
                            alignSelf: 'center',
                            color: '#ffffff',
                            fontSize: 14,
                            fontFamily: 'arial',
                        }}>Area</Text>
                    </View>
                </View>
                <View style={{flex:1, backgroundColor: '#0001',width:screen.width*(2/3)}}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                // onRefresh={() => this.onHeaderRefresh()}
                                tintColor='gray'
                            />
                        }>
                        {this.renderList()}
                    </ScrollView>
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
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width*(2/3),
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

