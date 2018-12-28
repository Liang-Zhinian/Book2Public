import React, {PureComponent} from 'react'
import {BVLinearGradient, Image, InteractionManager, StyleSheet, TouchableOpacity, View} from 'react-native'
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {screen} from '../../common'
import api from '../../api'
import GroupPurchaseCell from './GroupPurchaseCell'
import LinearGradient from 'react-native-linear-gradient';
import testData from '../../testData'

type Props = {
    navigation: any,
}

type State = {
    data: Array<Object>,
    refreshState: number,
}

//公司详情
class CompanyScene extends PureComponent<Props, State> {

    static navigationOptions = ({ navigation }: any) => ({
        header: null,
    })

    constructor(props: Props) {
        super(props);

        this.state = {
            data: [],
            refreshState: false,
            center: {
                longitude: 116.404,
                latitude: 39.915
            },
            mapImgUrl: ''
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // this.requestRecommend()
        });
        this.requestData()
    }


    // requestRecommend = async () => {
    //     try {
    //         this.setState({ refreshState: true });
    //         let info = this.props.navigation.state.params.info;
    //         let response = await fetch(recommendUrlWithId(info.id));
    //         let json = await response.json();
    //         let dataList = json.data.deals.map((info) => {
    //             return {
    //                 id: info.Id,
    //                 imageUrl: info.Image,
    //                 title: info.brandname,
    //                 subtitle: `[${info.range}]${info.title}`,
    //             }
    //         });
    //         this.setState({
    //             data: dataList,
    //             refreshState: false,
    //         })
    //     } catch (error) {
    //         this.setState({
    //             refreshState: true,
    //         })
    //     }
    //
    // };

    renderCell = (rowData: any) => {
        return (
            <View>
                <GroupPurchaseCell
                    info={rowData.item}
                    onPress={() => {
                        this.props.navigation.navigate('CommodityDetails', {info: rowData.item})//跳到商品详情
                    }}
                />
            </View>
        )
    };

    requestData = async () => {
        try {
            this.setState({refreshState: RefreshState.HeaderRefreshing});

            var dataList=[];

            if (this.props.navigation.state.params.siteId==='f996cb01-6b0c-4dfa-9687-78e59df6d0b1'){
                let response = await fetch(api.findLocations);
                let json = await response.json();

                dataList = json.map((info) => {
                    return {
                        key:info.Id,
                        id: info.Id,
                        imageUrl: 'data:image/png;base64,'+info.Image,
                        title: info.Description,
                        subtitle: ((info.StreetAddress!=null&&info.StreetAddress!='null')?info.StreetAddress:'')+((info.StreetAddress2!=null&&info.StreetAddress2!='null')?info.StreetAddress2:''),
                        Latitude:info.Latitude,
                        Longitude:info.Longitude,
                        description: info.Description,
                        AdditionalLocationImages:'data:image/png;base64,'+info.AdditionalLocationImages[0].Image,
                    }
                });
            }else {
                let json2 = testData.testData;
                dataList = json2.map((info2) => {
                    return {
                        key: info2.Id,
                        id: info2.Id,
                        imageUrl: info2.icon.uri,
                        title: info2.title,
                        subtitle: info2.address,
                        // price: info2.price,
                        Latitude: info2.LatLng.latitude,
                        Longitude:info2.LatLng.longitude,
                        AdditionalLocationImages: info2.icon.uri,
                    }
                });
            }

            //数据打乱
            dataList.sort(() => {
                return 0.5 - Math.random()
            });

            this.setState({
                data: dataList,
                refreshState: RefreshState.NoMoreData,
            })
        } catch (error) {
            this.setState({
                refreshState: RefreshState.Failure,
            })
        }
    };

    GetExploreList() {//商品列表
        return (
            <View style={styles.container}>
                <RefreshListView
                    style={{ width: screen.width,
                    }}
                    data={this.state.data}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={this.renderCell}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.requestData}
                    footerTextStyle={{color:'#454545'}}
                    // footerTextStyle={{color: '#ffffff'}}
                    footerRefreshingText={'loading...'}
                    footerFailureText={'click refresh'}
                    footerNoMoreDataText={'no more data'}
                    footerEmptyDataText={'empty data'}
                />
            </View>
        )
    }

    renderHeader = () => {
        let info = {AdditionalLocationImages:null};
        return (
            <View style={{marginBottom:10,backgroundColor:'#c1ffff'}}>
                {(info.AdditionalLocationImages !== null && info.AdditionalLocationImages !== 'null')
                    ? <Image source={{uri: info.AdditionalLocationImages}} style={styles.banner}/>
                    : <Image source={require('../../img/public/notfoundlogoBig.jpg')} style={styles.banner}/>}
            </View>
        )
    };

    render() {
        return (
                <LinearGradient colors={screen.colorTemp}
                                start={{x: 0, y: 0}}
                                end={{x:1, y:1}}
                                style={[styles.linearGradient]}>
                <View style={{
                    position: 'absolute',
                    top: screen.statusBarHeight,
                    zIndex: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: screen.width,
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={LocalImage.goBackIcon}
                               style={[styles.callbackIcon, {}]}
                               onPress={() => {
                                   this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                </View>
                {this.GetExploreList()}
                {/*<ScrollView*/}
                    {/*refreshControl={*/}
                        {/*<RefreshControl*/}
                            {/*refreshing={this.state.refreshState}*/}
                            {/*onRefresh={() => this.requestRecommend()}*/}
                            {/*tintColor='gray'*/}
                        {/*/>*/}
                    {/*}>*/}
                {/*</ScrollView>*/}
                </LinearGradient>
        )
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff00'
    },
    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
    },
    icon: {
        width: 50,
        paddingBottom:100,
        marginLeft:20,
        backgroundColor:"#9e9e9e00",
        resizeMode:'contain',
    },
    banner: {
        width: screen.width,
        height: screen.width * 0.5,
        resizeMode:'cover',
        backgroundColor:'#000',
    },
    topContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bottomContainer: {
        width:screen.width,
        backgroundColor:'#ff581c',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    buyButton: {
        backgroundColor: '#fc9e28',
        width: 94,
        height: 36,
        borderRadius: 7,
    },
    tagContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    tipHeader: {
        height: 50,
        width:screen.width,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor: '#f3f3f3'
    },
    mapImageStyle: {
        width: screen.width,
        height: screen.width * 0.4,
        borderRadius: 45,
    },
    arrow: {
        width: 16,
        height: 16,
        marginLeft: 5,
        tintColor:'#5a5a5a'
    }
})


export default CompanyScene
