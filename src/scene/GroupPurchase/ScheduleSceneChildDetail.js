import React, {PureComponent} from 'react'
import {Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {screen} from '../../common'
import LinearGradient from 'react-native-linear-gradient';
import {SpacingView} from '../../widget'
import {CalendarList} from 'react-native-calendars';
import testAppointmentsData from '../../testAppointmentsData'
import TimeUtils from '../Common/TimeUtils';
import Button from "../../widget/Button";
import RNFS from "react-native-fs";

type
Props = {
    navigation: any,
}

type
State = {
    data: Array < Object >,
    refreshState: number,
}

//具体时间表及其下单
class ScheduleSceneChildDetail extends PureComponent<Props, State> {

    static navigationOptions = () => ({
        header: null,
    });

    constructor(props: Props) {
        super(props);
        this.state = {
            StartDateTime:null,
            EndDateTime:null,
            phone: "13800138000",
            technician: 'Dr.Hello',
            date: new Date(),
            remarks: null,
            sectionTime: null,
            showRemarks: false,
            calendarList: true,
            showSelectTime: false,
            selectTime: null,
            showTimePoint: false,
            data: [],
            refreshState: false,
            loveTintColor: '#696969',
            handerBgc: '#69696900',
            falseSwitchIsOn: false,
            center: {
                longitude: 116.404,
                latitude: 39.915
            },
            mapImgUrl: ''
        }
    }

    componentWillUnmount() {
        StatusBar.setBackgroundColor("#0F143A00");
    }

    componentDidMount() {

    }

    timePointDetail() {
        let id = this.props.navigation.state.params.service.id;
        let info = null;
        let Morning = [], Midday = [], Evening = [];
        testAppointmentsData.testAppointmentsDataTimePoint.map((data) => {
            if (data.serviceItemId === id) {
                let dateS = data.startTime.substring(0, 16);
                dateS = dateS.replace(/-/g, '/');
                let dateE = data.endTime.substring(0, 16);
                dateE = dateE.replace(/-/g, '/');
                let timestamp = TimeUtils.formatTimeHHMM(dateS);
                let hour = timestamp.hour;
                let morningTime = timestamp.morningTime;
                let middayTime = timestamp.middayTime;
                let eveningTime = timestamp.eveningTime;
                let sectionTimeMo = TimeUtils.formatTimeHHMM(dateS).morningTime_minutesNull + ' - ' + TimeUtils.formatTimeHHMM(dateE).morningTime_minutesNull + 'am';
                let sectionTimeMi = TimeUtils.formatTimeHHMM(dateS).middayTime_minutesNull + ' - ' + TimeUtils.formatTimeHHMM(dateE).middayTime_minutesNull + 'pm';
                let sectionTimeEn = TimeUtils.formatTimeHHMM(dateS).eveningTime_minutesNull + ' - ' + TimeUtils.formatTimeHHMM(dateE).eveningTime_minutesNull + 'pm';
                if (hour < 12) {
                    //上午
                    Morning.push(
                        <TouchableOpacity style={styles.showTimePointDetail} activeOpacity={0.8} onPress={() => {
                            this.setState({
                                StartDateTime:dateS,
                                EndDateTime:dateE,
                                showSelectTime: true,
                                sectionTime: sectionTimeMo,
                                calendarList: false,
                                showTimePoint: false,
                                showRemarks: true
                            })
                        }}>
                            <View style={styles.showTimePointView}>
                                <Text style={[styles.timePoint]}>{morningTime} am</Text>
                            </View>
                        </TouchableOpacity>
                    )
                } else if (hour >= 12 && hour < 18) {
                    //下午
                    Midday.push(
                        <TouchableOpacity style={styles.showTimePointDetail} activeOpacity={0.8} onPress={() => {
                            this.setState({
                                StartDateTime:dateS,
                                EndDateTime:dateE,
                                showSelectTime: true,
                                sectionTime: sectionTimeMi,
                                calendarList: false,
                                showTimePoint: false,
                                showRemarks: true
                            })
                        }}>
                            <View style={styles.showTimePointView}>
                                <Text style={[styles.timePoint]}>{middayTime} pm</Text>
                            </View>
                        </TouchableOpacity>
                    )
                } else {
                    //晚上
                    Evening.push(
                        <TouchableOpacity style={styles.showTimePointDetail} activeOpacity={0.8} onPress={() => {
                            this.setState({
                                StartDateTime:dateS,
                                EndDateTime:dateE,
                                showSelectTime: true,
                                sectionTime: sectionTimeEn,
                                calendarList: false,
                                showTimePoint: false,
                                showRemarks: true
                            })
                        }}>
                            <View style={styles.showTimePointView}>
                                <Text style={[styles.timePoint]}>{eveningTime} pm</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            }
            info = {
                Morning: Morning,
                Midday: Midday,
                Evening: Evening,
            }
        });
        return info;
    }

    showTimePoint() {
        return (
            <View>
                <View
                    style={{
                        width: screen.width,
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#00000032',
                    }}>
                    <View style={styles.showTimePoint}>
                        <Text style={styles.showTimePointDetail}>Morning</Text>
                    </View>
                    <View style={styles.showTimePoint}>
                        <Text style={styles.showTimePointDetail}>Midday</Text>
                    </View>
                    <View style={styles.showTimePoint}>
                        <Text style={styles.showTimePointDetail}>Evening</Text>
                    </View>
                </View>
                <View style={{
                    width: screen.width,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                }}>
                    <View style={styles.showTimePoint}>
                        {this.timePointDetail().Morning}
                    </View>
                    <View style={styles.showTimePoint}>
                        {this.timePointDetail().Midday}
                    </View>
                    <View style={styles.showTimePoint}>
                        {this.timePointDetail().Evening}
                    </View>
                </View>
            </View>
        )
    }

    showSelectTime() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={{
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    padding: 10,
                    justifyContent: 'space-between'
                }}
                onPress={() => {
                    this.setState({
                        showTimePoint: true,
                        calendarList: true,
                        showRemarks: false
                    })
                }}
            >
                <Text style={{
                    color: this.state.selectTime === null ? "#707070" : "#1a1a1a",
                    fontFamily: 'arial',
                    fontSize: 13
                }}>
                    Time
                </Text>
                <Text style={{color: "#1a1a1a", fontFamily: 'arial', fontSize: 13}}>
                    {this.state.sectionTime}
                </Text>
            </TouchableOpacity>
        )
    }

    showTelephone() {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
                backgroundColor: '#fff'
            }}>
                <View style={{flexDirection: 'column', alignSelf: 'center',}}>
                    <Text style={{
                        color: this.state.selectTime === null ? "#707070" : "#1a1a1a",
                        fontFamily: 'arial',
                        fontSize: 13
                    }}>
                        Phone
                    </Text>
                </View>
                <TextInput
                    placeholder={this.state.phone}
                    placeholderTextColor={'#232323'}
                    underlineColorAndroid='transparent'
                    multiline={false}
                    maxLength={11}
                    dataDetectorTypes={'phoneNumber'}
                    keyboardType="numeric"
                    onChangeText={(value) => {
                        this.setState({phone: value});
                    }}
                    style={{
                        width: screen.width / 2,
                        fontSize: 13,
                        color: '#232323',
                        textAlignVertical: 'center',
                        textAlign: 'right',
                        paddingRight: 10
                    }}/>
            </View>
        )
    }

    showRemarks() {
        return (
            <View>
                <TextInput
                    placeholder="Remarks"
                    underlineColorAndroid='transparent'
                    multiline={true}
                    onChangeText={(value) => {
                        this.setState({remarks: value});
                    }}
                    style={{
                        backgroundColor: '#fff',
                        paddingLeft: 10,
                        width: screen.width,
                        height: screen.height / 4,
                        fontSize: 18,
                        color: '#232323',
                        textAlignVertical: 'top'
                    }}/>
            </View>
        )
    }

    showNextPageButton() {
        return (
            <View>
                <Button
                    title={'NEXT'}
                    style={{padding: 10, width: screen.width}}
                    titleStyle={{color: '#fff', fontFamily: 'arial', fontSize: 15}}
                    onPress={() => {
                        let scheduleItem = {
                            AppointmentId : Number(new Date()),
                            OrderDate:new Date(),
                            StartDateTime:this.state.StartDateTime,
                            EndDateTime:this.state.EndDateTime,
                            service: this.props.navigation.state.params.service,
                            commodityInfo:this.props.navigation.state.params.commodityInfo,
                            StaffId : this.state.technician,
                            date: this.state.date,
                            sectionTime: this.state.sectionTime,
                            remarks: this.state.remarks,
                            phone: this.state.phone,
                        };
                        this.writeFile(JSON.stringify(scheduleItem), 'scheduleItem.json')
                        // this.props.navigation.navigate('ScheduleSceneChild'
                        //     , {
                        //         // storeId: this.props.navigation.state.params.storeId,
                        //         // service:info,
                        //     });
                    }}
                />
            </View>
        )
    }

    writeFile(scheduleItem, fileName) {
        let path = RNFS.DocumentDirectoryPath + '/' + fileName;
        RNFS.readFile(path, 'utf8')
            .then((res) => {
                res = res === '' ? '[]' : res
                //let Temp  = res.replace(/\[/g,'');
                let array = JSON.parse(res);
                array.push(JSON.parse(scheduleItem));

                RNFS.writeFile(path, JSON.stringify(array), 'utf8')
                    .then((success) => {
                        alert('success')
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            })
            .catch((error) => {
                console.warn('error')
            });
    }

    calendarList() {
        return (
            <CalendarList
                pastScrollRange={0}
                futureScrollRange={6}
                horizontal
                pagingEnabled
                calendarHeight={310}
                style={{}}
                rowHasChanged={(r1, r2) => {
                    return r1.text !== r2.text
                }}
                markedDates={{
                    '2018-08-16': {marked: true},
                    '2018-08-18': {marked: true},
                }}
                onDayPress={(day) => {
                    if (day.dateString === '2018-08-16' || day.dateString === '2018-08-18') {
                        this.setState({showTimePoint: true})
                    } else {
                        this.setState({showTimePoint: false})
                    }
                    let formatTime = TimeUtils.formatDateDMY(day.year, day.month, day.day);
                    this.setState({
                        selectTime: formatTime,
                        date: day.dateString
                    })
                }}
            />
        );
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
                    <Text style={{color: '#ededed', fontSize: 12, fontFamily: 'arial'}}
                          numberOfLines={1}>APPOINTMENT BOOKING</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <View style={[styles.callbackIcon, {}]}/>
                    </TouchableOpacity>
                </View>

                <View style={{backgroundColor: '#f3f3f3', flex: 1, width: screen.width}}>
                    <ScrollView>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                flexDirection: 'row',
                                padding: 10,
                                justifyContent: 'space-between'
                            }}>
                            <Text style={{color: "#1a1a1a", fontFamily: 'arial', fontSize: 13}}>
                                {this.props.navigation.state.params.service.title}
                            </Text>
                            <Text style={{color: "#1a1a1a", fontFamily: 'arial', fontSize: 13}}>
                                Dr.Hello
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{
                                backgroundColor: '#fff',
                                flexDirection: 'row',
                                padding: 10,
                                justifyContent: 'space-between'
                            }}
                            onPress={() => {
                                this.setState({
                                    calendarList: true,
                                    showRemarks: false
                                })
                            }}>
                            <Text style={{
                                color: this.state.selectTime === null ? "#707070" : "#1a1a1a",
                                fontFamily: 'arial',
                                fontSize: 13
                            }}>
                                Date
                            </Text>
                            <Text style={{color: "#1a1a1a", fontFamily: 'arial', fontSize: 13}}>
                                {this.state.selectTime}
                            </Text>
                        </TouchableOpacity>
                        {this.state.showSelectTime && this.showSelectTime()}
                        {this.state.showRemarks && this.showTelephone()}
                        <SpacingView/>
                        {this.state.showRemarks && this.showRemarks()}

                        <SpacingView/>
                        {this.state.calendarList ? this.calendarList() : <View/>}
                        <SpacingView/>
                        {this.state.showTimePoint ? this.showTimePoint() : <View/>}
                        <SpacingView/>

                    </ScrollView>
                </View>
                {this.state.showRemarks && this.showNextPageButton()}
            </LinearGradient>
        )
    }

}


const styles = StyleSheet.create({
    showTimePoint: {
        width: screen.width / 3,
        alignItems: 'center',
    },
    showTimePointDetail: {
        padding: 5, color: '#151515', fontSize: 13, fontFamily: 'arial',

    },
    showTimePointView: {
        width: screen.width / 3 * 0.5,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#9c9c9c'
    },
    timePoint: {
        color: '#666666', fontSize: 13, fontFamily: 'arial',
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
});


export default ScheduleSceneChildDetail
