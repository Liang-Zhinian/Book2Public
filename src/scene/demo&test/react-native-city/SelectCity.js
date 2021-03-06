'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import Header from './Header';
import SearchBox from './SearchBox';
import SearchResult from './SearchResult';

import CityList from './IndexListView';

// 下面是数据部分
import DATA_JSON from './city-list.json';
import * as ScreenUtil from "../../Common/ScreenUtil";

const NOW_CITY_LIST = [
    {
        "name": "上海",
        "spellName": "shanghai",
        "id": 3100,
        "fullname": "上海/上海",
        "sortLetters": "s"
    }
];
const ALL_CITY_LIST = DATA_JSON.allCityList;
const HOT_CITY_LIST = DATA_JSON.hotCityList;
const LAST_VISIT_CITY_LIST = DATA_JSON.lastVisitCityList;

export default class SimpleSelectCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[{fullname:"NA",
                id:0,
                name:"NA",
                sortLetters:"n",
                spellName:"NA"}],
            showSearchResult: false,
            keyword: '',
            searchResultList: [],
            allCityList: ALL_CITY_LIST,
            hotCityList: HOT_CITY_LIST,
            lastVisitCityList: LAST_VISIT_CITY_LIST,
            nowCityList: NOW_CITY_LIST
        };
    }

    onPressBack() {
        alert('你选择了返回====》header back');
    }

    onChanegeTextKeyword(newVal) {
        if (newVal === '') {
            this.setState({showSearchResult: false});
        } else {
            // 在这里过滤数据结果
            let dataList = this.filterCityData(newVal);

            this.setState({keyword: newVal, showSearchResult: true, searchResultList: dataList});
        }
    }

    filterCityData(text) {
        console.log('search for list', text);

        let rst = [];
        for (let idx = 0; idx < ALL_CITY_LIST.length; idx++) {
            let item = ALL_CITY_LIST[idx];
            if (item.name.indexOf(text) === 0 || item.spellName.indexOf(text) === 0) {
                rst.push(item);
            }
        }
        return rst;
    }

    onSelectCity(cityJson) {
        if (this.state.showSearchResult) {
            this.setState({showSearchResult: false, keyword: ''});
        }

        alert('你选择了城市====》' + cityJson.id + '#####' + cityJson.name);
    }
    //var fruits = [{name:"Banana"}, {name:"Orange"},  {name:"Apple"},  {name:"Mango"}];
    // 	 function sortName(a,b){
    //        return a.name.charCodeAt()-b.name.charCodeAt()
    //     }
    // 	fruits.sort(sortName);
    // 	console.log(fruits)

    sortName(a, b) {
        return a.name.charCodeAt() - b.name.charCodeAt()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            let data = nextProps.data;
            data.sort(this.sortName);
            this.setState({data: nextProps.data});
        }
    }

    render() {
        // console.log(this.state.allCityList);
        console.log(this.props.data);
        return (
            <View style={styles.container}>
                <Header onPressBack={this.onPressBack.bind(this)} title="选择城市"/>
                <SearchBox
                    keyword={this.state.keyword}
                    onChanegeTextKeyword={(vv) => {
                        this.onChanegeTextKeyword(vv)
                    }}/>{this.state.showSearchResult
                ? (<SearchResult
                    keyword={this.state.keyword}
                    onSelectCity={this.onSelectCity.bind(this)}
                    searchResultList={this.state.searchResultList}/>)
                : (
                    <View style={{flex: 1}}>
                        <CityList
                            onSelectCity={this.onSelectCity.bind(this)}
                            allCityList={this.props.data}
                            hotCityList={this.state.hotCityList}
                            lastVisitCityList={this.state.lastVisitCityList}
                            nowCityList={this.state.nowCityList}/>
                    </View>
                )}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        // paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
    },
    currentCity: {
        backgroundColor: '#ffffff',
        height: 20,
        margin: 5
    },
    currentCityText: {
        fontSize: ScreenUtil.setSpText(16)
    }
});
