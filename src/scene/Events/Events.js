import React from 'react';
import {BVLinearGradient, Image, Linking, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {screen} from '../../common/index'
import LinearGradient from 'react-native-linear-gradient';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import RNFS from "react-native-fs";

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};
LocaleConfig.locales['cn'] = {
    monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    monthNamesShort: ['1.','2.','3','4','5','6','7.','8','9.','10.','11.','12.'],
    dayNames: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
    dayNamesShort: ['一','二','三','四','五','六','日']
};

// LocaleConfig.defaultLocale = 'cn';

type Props = {
    navigation: any,
}

type State = {
    data: Array<Object>,
    refreshState: number,
}


class Events extends React.Component {

    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });

    constructor(props: Props) {
        super(props)

        this.state = {
            mouthOfSchedule:[],
            data: [],
            items: {}
        }
    }
    componentWillMount() {
        // let path = RNFS.DocumentDirectoryPath + '/scheduleItem.json';
        //
        // RNFS.readFile(path, 'utf8')
        //     .then((res) => {
        //         console.log(res);
        //         res = res === '' ? '[]' : res;
        //         this.setState({mouthOfSchedule:JSON.parse(res)});
        //         // let array = JSON.parse(res);
        //         // this.fun03(res)
        //     })
        //     .catch((error) => {
        //         console.warn(error)
        //     });
    }

    componentDidMount() {
        let path = RNFS.DocumentDirectoryPath + '/scheduleItem.json';

        RNFS.readFile(path, 'utf8')
            .then((res) => {
                res = res === '' ? '[]' : res;
                this.setState({mouthOfSchedule:JSON.parse(res)});
                // let array = JSON.parse(res);
            })
            .catch((error) => {
                console.warn(error)
            });
    }

    render() {
        const vacation = {key:'vacation', color: 'red', selectedDotColor: 'blue'};
        const massage = {key:'massage', color: 'blue', selectedDotColor: 'blue'};
        const workout = {key:'workout', color: 'green'};
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.linearGradient]}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: screen.width,
                    padding:10,
                }}>
                  {/*<TouchableOpacity activeOpacity={0.5} onPress={() => {*/}
                      {/*this.props.navigation.goBack();*/}
                  {/*}}>*/}
                      {/*<Image source={require('../../img/mine/icon_homepage_left_arrow.png')}*/}
                             {/*style={[styles.callbackIcon, {}]}*/}
                             {/*onPress={() => {*/}
                                 {/*this.props.navigation.goBack();*/}
                             {/*}}*/}
                      {/*/>*/}
                  {/*</TouchableOpacity>*/}
                  <Text style={{color: '#fff', fontSize: 13, fontFamily: 'arial'}}>SCHEDULE</Text>
                  {/*<TouchableOpacity activeOpacity={0.5} onPress={() => {*/}
                      {/*this.props.navigation.goBack();*/}
                  {/*}}>*/}
                      {/*<View style={[styles.callbackIcon, {}]}/>*/}
                  {/*</TouchableOpacity>*/}
              </View>
                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={new Date()}//默认选中日期
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    futureScrollRange={12}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    // minDate={'2018-08-08'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    // maxDate={'2018-08-30'}
                    // Hide knob button. Default = false
                    hideKnob={false}
                    // theme={{
                        // agendaDayTextColor: '#b25234',
                        // agendaDayNumColor: '#949494',
                        // agendaTodayColor: 'red',
                        // agendaKnobColor: '#7fadff'
                    // }}
                    // monthFormat={'yyyy'}
                    //theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                    // renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                    style={{width:screen.width}}
                />
            </LinearGradient>
        )
    }

    loadItems(day) {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                this.state.items[strTime] = [];
                const numItems = this.state.mouthOfSchedule.length;
                for (let j = 0; j < numItems; j++) {
                    const ScheduleDate = this.state.mouthOfSchedule[j].date;
                    if (strTime.toString() === ScheduleDate.toString()) {
                        this.state.items[strTime].push(this.state.mouthOfSchedule[j]);
                    }
                }
            }
            const newItems = {};
            Object.keys(this.state.items).forEach(key => {
                newItems[key] = this.state.items[key];
            });
            this.setState({
                items: newItems
            });
        }, 1000);
    }

    renderItem(item) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {

                }}
                style={[styles.item, {flexDirection: 'column'}]}
            >
                <View>
                    <Text>{item.commodityInfo.title}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>{item.service.title}</Text>
                    <Text>{item.StaffId}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Image source={require('../../img/public/phone.png')}/>
                    <Text
                        style={{marginLeft: 5, textDecorationLine: 'underline '}}
                        onPress={() => {
                            Linking.openURL('tel:' + item.commodityInfo.phone)
                        }}
                    >{item.commodityInfo.phone}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text>Empty !</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    linearGradient: {
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop:screen.statusBarHeight,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
    },
    item: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 10,
        flex:1,
        justifyContent:'center',
    },
    emptyDate: {
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        flex:1,
        justifyContent:'flex-end',
    }
});


export default Events
