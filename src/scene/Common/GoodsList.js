
import React, {PureComponent} from 'react'
import {StatusBar, StyleSheet, View} from 'react-native'
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import api from '../../api'
import {DetailCell, SpacingView} from '../../widget'

import GroupPurchaseCell from '../GroupPurchase/GroupPurchaseCell'

type Props = {
    navigation: any,
}

type State = {
    data: Array<Object>,
    refreshState: number,
}


class GoodsList extends PureComponent<Props, State> {

    static navigationOptions = ({navigation}: any) => ({
        title: 'Order',
        headerStyle: {backgroundColor: 'white'},
    })

    constructor(props: Props) {
        super(props)

        this.state = {
            data: [],
            refreshState: RefreshState.Idle,
        }
    }

    componentDidMount() {
        this.requestData()
    }

    requestData = async () => {
        try {
            this.setState({refreshState: RefreshState.HeaderRefreshing})

            let response = await fetch(api.recommend)
            let json = await response.json()

            // console.log(JSON.stringify(json))

            let dataList = json.data.map((info) => {
                return {
                    id: info.id,
                    imageUrl: info.squareimgurl,
                    title: info.mname,
                    subtitle: `[${info.range}]${info.title}`,
                    price: info.price
                }
            })

            // 偷懒，用同一个测试接口获取数据，然后打乱数组，造成数据来自不同接口的假象 >.<
            dataList.sort(() => {return 0.5 - Math.random()})

            this.setState({
                data: dataList,
                refreshState: RefreshState.NoMoreData,
            })
        } catch (error) {
            this.setState({
                refreshState: RefreshState.Failure,
            })
        }
    }

    keyExtractor = (item: Object, index: number) => {
        return item.id
    }


    renderCell = (rowData: any) => {
        return (
            <GroupPurchaseCell
                info={rowData.item}
                onPress={() => {
                    StatusBar.setBarStyle('default', false);
                    this.props.navigation.navigate('GroupPurchase', {info: rowData.item})//跳到商品详情
                }}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    data={this.state.data}
                    renderItem={this.renderCell}
                    // keyExtractor={this.keyExtractor}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.requestData}//刷新数据
                    footerTextStyle={{color: '#ffffff'}}
                    footerRefreshingText={'loading...'}
                    footerFailureText={'click refresh'}
                    footerNoMoreDataText={'no more data'}
                    footerEmptyDataText={'empty data'}
                />
            </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
    },
})


export default GoodsList
