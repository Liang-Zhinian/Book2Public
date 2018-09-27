/*
广告滚动
 */
import React, {PureComponent} from 'react'
import {ScrollView, StyleSheet,Text, View} from 'react-native'
import PageControl from 'react-native-page-control'

import {screen} from '../../common/index'
import {color} from '../../widget/index'
import AdMunItem from './AdMunItem'

type Props = {
    menuInfos: Array<Object>,
    onMenuSelected: Function,
}

type State = {
    currentPage: number
}


class AdSwiper extends PureComponent<Props, State>  {


    constructor(props: Object) {
        super(props)

        this.state = {
            currentPage: 0
        }
    }

    render() {
        let {menuInfos, onMenuSelected} = this.props;

        let menuItems = menuInfos.map((info) => {
                    const dataList = {
                        // key: info.Id,
                        // id: info.Id,
                        type: info.type,
                        title: info.title,
                        address: info.address,
                        icon: info.icon,
                    };
                    return (
                        <AdMunItem
                            info={dataList}
                            onPress={() => {
                                onMenuSelected && onMenuSelected(info)
                            }}
                        />
                    )
                }
        );

        let menuViews = [];
        let pageCount = Math.ceil(menuItems.length);

        for (let i = 0; i < pageCount; i++) {
            let items = menuItems.slice(i, i + 1);

            let menuView = (
                <View style={styles.itemsView} key={i}>
                    {items}
                </View>
            )
            menuViews.push(menuView)
        }

        return (
            <View style={styles.container}>
                <ScrollView
                    style={{
                        width: screen.width * 0.95,}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={(e) => this.onScroll(e)}
                >
                    <View style={styles.menuContainer}>
                        {menuViews}
                    </View>
                </ScrollView>

                <PageControl
                    numberOfPages={pageCount}
                    currentPage={this.state.currentPage}
                    hidesForSinglePage
                    pageIndicatorTintColor='#CFCFCF'
                    currentPageIndicatorTintColor={"#000"}
                    style={{marginTop:10,}}
                />
            </View>
        )
    }

    onScroll(e: any) {
        let x = e.nativeEvent.contentOffset.x;
        let currentPage = Math.round(x / screen.width);

        // console.warn('onScroll  ' + e.nativeEvent.contentOffset.x + '  page ' + currentPage + '  current ' + this.state.currentPage)
        if (this.state.currentPage != currentPage) {
            this.setState({
                currentPage: currentPage
            })
        }
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screen.width,
        backgroundColor: '#ffffff00',
        marginBottom:10,
    },
    menuContainer: {
        flexDirection: 'row',
    },
    itemsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})


export default AdSwiper
