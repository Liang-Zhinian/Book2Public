import React from 'react';
import {BVLinearGradient, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {screen} from '../../common/index'
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import LinearGradient from 'react-native-linear-gradient';
import testData from '../../testData'
import testAppointmentsData from '../../testAppointmentsData'
import CommodityCell from "./CommodityCell";
import Panel from '../Common/Panel'
import ScheduleSceneChild from "./ScheduleSceneChild";

export default class ScheduleScene extends React.Component {
    static navigationOptions = () => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);

        this.state = {
            LeftWidth: screen.width * 0.95 / 2,
            sliderWidth: 20,
            selectedType: 'CLASSES',
            isRefreshing: false,
            data: [],
            appointmentsData:[],
            refreshState: RefreshState.Idle,
        };

        this.count = 0;
    }


    componentDidMount() {
        this.requestAppointmentsData();
        this.requestData();
    }

    componentWillUnmount() {
    }

    getColor(typeName) {
        return this.state.selectedType == typeName ? '#f4cad8' : '#ffffff'
    }

    getBackgroundColor(typeName) {
        return this.state.selectedType == typeName ? '#4A4C7D' : '#4A4C7D00'
    }

    renderCell = (rowData: any) => {
        return (
            <CommodityCell
                info={rowData.item}
                onPress={() => {
                    this.props.navigation.navigate('CommodityDetails', {info: rowData.item})//跳到商品详情
                }}
            />
        )
    };
    requestData = async () => {
        try {
            this.setState({refreshState: RefreshState.HeaderRefreshing});

            var dataList = [];
            let json2 = testData.testData;
            dataList = json2.map((info2) => {
                return {
                    key: info2.Id,
                    id: info2.Id,
                    imageUrl: info2.icon.uri,
                    title: info2.title,
                    subtitle: info2.address,
                    AdditionalLocationImages: info2.icon.uri,
                    firmId: info2.firmId,
                }
            });


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
                <Text/>
                {/*<RefreshListView*/}
                    {/*style={{*/}
                        {/*width: screen.width,*/}
                    {/*}}*/}
                    {/*data={this.state.data}*/}
                    {/*renderItem={this.renderCell}*/}
                    {/*refreshState={this.state.refreshState}*/}
                    {/*onHeaderRefresh={this.requestData}*/}
                    {/*footerTextStyle={{color: '#ffffff'}}*/}
                {/*/>*/}
            </View>
        )
    }

    renderAppointmentsCell = (rowData: any) => {
        let childrenList = rowData.item.children.map((info) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: '#eeeeee',
                        height: 45,
                        paddingLeft: 5,
                        margin: 5,
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        this.props.navigation.navigate('ScheduleSceneChild'
                            , {
                                commodityInfo: this.props.navigation.state.params.commodityInfo,
                                service: info,
                            });
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: 'arial',
                            color: '#262626',
                            fontWeight: '200'
                        }}
                    >
                        {info.title}
                    </Text>
                    {info.tip &&
                    <Text style={{width: screen.width * 0.95 - 60, color: '#5a5a5a', fontSize: 12, fontFamily: 'arial'}}
                          numberOfLines={1}>{info.tip}</Text>}
                </TouchableOpacity>
            )
        });
        return (
            <Panel title={rowData.item.typeTitle} expanded={false}>
                {childrenList}
            </Panel>
        )
    };
    requestAppointmentsData = async () => {
        try {
            this.setState({refreshState: RefreshState.HeaderRefreshing});

            var dataList = [];
            let json2 = testAppointmentsData.testAppointmentsData;
            dataList = json2.map((info2) => {
                return {
                    key: info2.Id,
                    id: info2.Id,
                    typeTitle: info2.typeTitle,
                    children: info2.children,
                }
            });

            //数据打乱
            dataList.sort(() => {
                return 0.5 - Math.random()
            });

            this.setState({
                appointmentsData: dataList,
                refreshState: RefreshState.NoMoreData,
            })
        } catch (error) {
            this.setState({
                refreshState: RefreshState.Failure,
            })
        }
    };

    GetAppointments() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    style={{
                        width: screen.width,
                    }}
                    data={this.state.appointmentsData}
                    renderItem={this.renderAppointmentsCell}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.requestAppointmentsData}
                    footerContainerStyle={{display: 'none'}}
                    footerTextStyle={{color: '#ffffff'}}
                    footerRefreshingText={'loading...'}
                    footerFailureText={'click refresh'}
                    footerNoMoreDataText={'no more data'}
                    footerEmptyDataText={'empty data'}
                />
            </View>
        )
    }

    render() {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.linearGradient]}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: screen.width,
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image source={require('../../img/mine/icon_homepage_left_arrow.png')}
                               style={[styles.callbackIcon, {}]}
                               onPress={() => {
                                   this.props.navigation.goBack();
                               }}
                        />
                    </TouchableOpacity>
                    <Text style={{color: '#fff', fontSize: 12, fontFamily: 'arial'}}>SCHEDULE</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <View style={[styles.callbackIcon, {}]}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.tabViewStyle]}>
                    <TouchableOpacity
                        style={[styles.tabTextInfoStyle, {}]}
                        underlayColor="#d9d9d9"
                        onPress={() => {
                            this.setState({selectedType: 'CLASSES'})
                        }}>
                        <View
                            style={[styles.tabViewTextStyle, {backgroundColor: this.getBackgroundColor('CLASSES'),}]}>
                            <Text style={[styles.tabTextStyle, {color: this.getColor('CLASSES')}]}>
                                CLASSES</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabTextInfoStyle, {}]}
                        underlayColor="#d9d9d9"
                        onPress={() => {
                            this.setState({selectedType: 'APPOINTMENTS'})
                        }}>
                        <View
                            style={[styles.tabViewTextStyle, {backgroundColor: this.getBackgroundColor('APPOINTMENTS'),}]}>
                            <Text style={[styles.tabTextStyle, {color: this.getColor('APPOINTMENTS')}]}>
                                APPOINTMENTS</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.state.selectedType === 'CLASSES' ? this.GetExploreList() : this.GetAppointments()}
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop: screen.statusBarHeight,
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
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
        width: screen.width * 0.95 / 2,
        alignItems: 'center',
    },
    tabViewTextStyle: {
        borderRadius: 5,
        width: screen.width * 0.25,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    tabTextStyle: {
        fontSize: 12,
        textAlignVertical: 'center',
    },
});