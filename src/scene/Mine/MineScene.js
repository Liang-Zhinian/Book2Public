import React, {PureComponent} from 'react'
import {Image, RefreshControl, ScrollView, StyleSheet, BVLinearGradient, View} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import {Heading2, Paragraph} from '../../widget/Text'
import {screen} from '../../common'
import {color, DetailCell, NavigationItem, SpacingView} from '../../widget'

type Props = {}

type State = {
    isRefreshing: boolean,
}

class MineScene extends PureComponent<Props, State> {
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
    
    // static navigationOptions = ({navigation}: any) => ({
    //     headerRight: (
    //         <View style={{flexDirection: 'row'}}>
    //             <NavigationItem
    //                 icon={require('../../img/mine/icon_navigation_item_set_white.png')}
    //                 onPress={() => {
    //
    //                 }}
    //             />
    //             <NavigationItem
    //                 icon={require('../../img/mine/icon_navigation_item_message_white.png')}
    //                 onPress={() => {
    //
    //                 }}
    //             />
    //         </View>
    //     ),
    //     headerStyle: {
    //         backgroundColor: color.primary,
    //         elevation: 0,
    //         borderBottomWidth: 0,
    //     },
    // });

    state: {
        isRefreshing: boolean
    };

    constructor(props: Object) {
        super(props)

        this.state = {
            isRefreshing: false
        }
    }

    onHeaderRefresh() {
        this.setState({isRefreshing: true})

        setTimeout(() => {
            this.setState({isRefreshing: false})
        }, 2000)
    }

    renderCells() {
        let cells = [];
        let dataList = this.getDataList();
        for (let i = 0; i < dataList.length; i++) {
            let sublist = dataList[i];
            for (let j = 0; j < sublist.length; j++) {
                let data = sublist[j];
                let cell = <DetailCell
                    info={data}
                    image={data.image}
                    title={data.title}
                    subtitle={data.subtitle}
                    key={data.title}
                    onPress={() => {
                        this.props.navigation.navigate(data.id, {info: data})//跳到商品详情
                    }}
                />
                cells.push(cell)
            }
            cells.push(<SpacingView key={i} />)
        }

        return (
            <View style={{flex: 1}}>
                {cells}
            </View>
        )
    }

    renderHeader() {
        return (
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x:1, y:1}}
                colors={screen.colorTemp}
                style={styles.header}>
                <View style={{
                    backgroundColor: '#e4ff8800',
                    width: screen.width,
                    height: screen.height * 0.05,
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    <Image
                        style={styles.icon}
                        source={require('../../img/mine/icon_navigation_item_set_white.png')}
                        onPress={() => {

                        }}
                    />
                    <Image
                        style={styles.icon}
                        source={require('../../img/mine/icon_navigation_item_message_white.png')}
                        onPress={() => {

                        }}
                    />
                </View>
                <View style={{backgroundColor:'#ff9b7c00',width:screen.width,height:screen.height*0.25,alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center'}}>
                    <Image style={[styles.avatar, {}]} source={require('../../img/mine/avatar.png')}/>
                    <View style={{}}>
                        <View style={{
                            flexDirection: 'column',
                            // alignItems: 'center',
                            // justifyContent: 'center',
                            // alignSelf: 'center'
                        }}>
                            <Heading2 style={{color: 'white', paddingTop: 5}}>BOOK2</Heading2>
                            {/*<Image style={{marginLeft: 4}} source={require('../../img/mine/beauty_technician_v15.png')} onPress={()=>{}} />*/}
                        </View>
                        {/*<Paragraph style={{color: 'white', marginTop: 4}}>个人信息 ></Paragraph>*/}
                    </View>
                </View>
            </LinearGradient>
        )
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: color.paper
            }}>
                <View style={{position: 'absolute', width: screen.width, height: screen.height / 2, backgroundColor: color.primary}} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onHeaderRefresh()}
                            tintColor='gray'
                        />
                    }>
                    {this.renderHeader()}
                    <SpacingView />
                    {this.renderCells()}
                </ScrollView>
            </View>
        )
    }

    getDataList() {
        return (
            [
                [
                    {id:'SettingScene',title: 'Setting',  },
                    {id:'ChatWithUsScene',title: 'Chat with us',  },
                    {id:'FAQScene',title: 'FAQ',  },
                    {id:'ContactScene',title: 'Contact', },
                ],
                [
                    {id:'LogOutScene',title: 'Log out',},
                ]
            ]
            // [
            //     [
            //         {title: '我的钱包', subtitle: '办信用卡', image: require('../../img/mine/icon_mine_wallet.png')},
            //         {title: '余额', subtitle: '￥999', image: require('../../img/mine/icon_mine_balance.png')},
            //         // {title: '抵用券', subtitle: '63', image: require('../../img/mine/icon_mine_voucher.png')},
            //         {title: '会员卡', subtitle: '2', image: require('../../img/mine/icon_mine_membercard.png')},
            //         {title: '我的评价', image: require('../../img/mine/icon_mine_comment.png')},
            //         {title: '我的收藏', image: require('../../img/mine/icon_mine_collection.png')},
            //         {title: '会员中心', subtitle: 'v15', image: require('../../img/mine/icon_mine_membercenter.png')},
            //         // {title: '好友去哪', image: require('../../img/mine/icon_mine_friends.png')},
            //         // {title: '积分商城', subtitle: '好礼已上线', image: require('../../img/mine/icon_mine_member.png')}
            //     ],
            //     [
            //         {title: '客服中心', image: require('../../img/mine/icon_mine_customerService.png')},
            //         {title: '关于Book2', subtitle: '我要合作', image: require('../../img/mine/icon_mine_aboutmeituan.png')}
            //     ]
            // ]
        )
    }

}


const styles = StyleSheet.create({
    icon: {
        width: 16,
        height: 16,
        margin: 10,
        resizeMode: 'center'
    },
    header: {
        paddingTop:screen.statusBarHeight,
        backgroundColor: color.primary,
        flexDirection: 'column',
        height:screen.height*0.3,
    },
    avatar: {
        width: 80,
        height: 80,
        // marginRight: 10,
        borderRadius: 45,
        resizeMode: 'cover',
    }
})


export default MineScene
