import React, {UIManager} from 'react';

import {Text, TouchableOpacity, Vibration, View} from 'react-native';

import PickerView from './PickerView';

import BaseDialog from './BaseDialog';

import TimeUtils from '../utils/TimeUtils';

import MultiSlider from '@ptomasroos/react-native-multi-slider';


class DatePicker extends BaseDialog {

    static defaultProps = {
        removeSubviews: false,
        itemTextColor: 0x333333ff,
        itemSelectedColor: 0x1097D5ff,
        onPickerCancel: null,
        onPickerConfirm: null,
        unit: ['年', '月', '日'],
        selectedValue: [new Date().getFullYear() + '年', new Date().getMonth() + 1 + '月', new Date().getDate() + '日'],
        startYear: 1990,
        endYear: new Date().getFullYear(),

        startMonth: 1,
        endMonth: new Date().getMonth(),

        startDate: 0,
        endDate: new Date().getDate(),

        confirmText: 'Confirm',
        confirmTextSize: 14,
        confirmTextColor: '#333333',

        cancelText: 'Cancel',
        cancelTextSize: 14,
        cancelTextColor: '#333333',

        itemHeight: 40,

        HH: true,
        mm: true,
        ss: false
    };

    constructor(props) {
        super(props);
        this.state = this.getDateList();
    }

    multiSliderValue = [12,18];

    getDateList() {

        let unit = this.props.unit;
        let years = [];
        let months = [];
        let days = [];

        let startYear = this.props.startYear;
        let endYear = this.props.endYear;
        for (let i = 0; i < endYear + 1 - startYear; i++) {
            years.push(i + startYear + unit[0]);
        }



        let selectedYear = years[0];
        if (this.props.selectedValue) {
            selectedYear = this.props.selectedValue[0];
        }
        selectedYear = selectedYear.substr(0, selectedYear.length - unit[0].length);
        for (let i = 1; i < 13-this.props.startMonth; i++) {
            months.push(i+this.props.startMonth + unit[1]);
        }

        let selectedMonth = months[0];
        if (this.props.selectedValue) {
            selectedMonth = this.props.selectedValue[1];
        }
        selectedMonth = selectedMonth.substr(0, selectedMonth.length - unit[1].length);

        let dayCount = TimeUtils.getDaysInOneMonth(selectedYear, selectedMonth);
        if (selectedMonth.toString() === (this.props.startMonth + 1).toString()) {
            for (let i = 1; i <= dayCount - this.props.startDate; i++) {
                days.push(i + this.props.startDate + unit[2]);
            }
        } else {
            for (let i = 1; i <= dayCount; i++) {
                days.push(i + unit[2]);
            }
        }

        let selectedDay = days[0];
        if (this.props.selectedValue) {
            selectedDay = this.props.selectedValue[2];
        }
        selectedDay = selectedDay.substr(0, selectedDay.length - unit[2].length);


        pickerData = [years, months, days];
        // pickerData = [months, days];

        selectedIndex = [
            years.indexOf(selectedYear + unit[0]) == -1 ? years.length - 1 : years.indexOf(selectedYear + unit[0]),
            months.indexOf(selectedMonth + unit[1]),
            days.indexOf(selectedDay + unit[2]) == -1 ? days.length - 1 : days.indexOf(selectedDay + unit[2])];

        if (selectedIndex[2] != 0){this.props.selectedValue[2] = days[selectedIndex[2]];}

        // if (this.state.selectedIndex!=undefined){
        //     this.props.selectedValue[1] = this.state.selectedIndex[1];
        //     this.props.selectedValue[2] = this.state.selectedIndex[2];
        // }


        let data = {
            pickerData: pickerData,
            selectedIndex: selectedIndex,
        };
        return data;
    }

    _getContentPosition() {
        return { justifyContent: 'flex-end', alignItems: 'center' }
    }

    setSelectedValue(value){
        debugger;
        for (var i=0; i<value.length; i++) {
            this.props.selectedValue[i] = value[i];
        }
    }

    changeState(){
        this.setState({ ...this.getDateList() });
    }

    renderPicker() {
        return this.state.pickerData.map((item, pickerId) => {

            if (item&&pickerId!==0) {
                return <PickerView
                    key={'picker' + pickerId}
                    itemTextColor={this.props.itemTextColor}
                    itemSelectedColor={this.props.itemSelectedColor}
                    list={item}
                    onPickerSelected={(toValue) => {
                        // debugger;
                        //是否联动的实现位置
                        Vibration.vibrate( [0, 20,0, 0]);
                        this.props.selectedValue[pickerId] = toValue;

                        // this.props.onPickerSelected(pickerId,toValue);
                        this.setState({ ...this.getDateList() });
                        this.setState({
                            multiSliderValue:
                                [this.props.SliderValue.start, this.props.SliderValue.end]
                        });
                    }}
                    selectedIndex={this.state.selectedIndex[pickerId]*1}
                    fontSize={this.getSize(14)}
                    itemWidth={this.mScreenWidth/2 / this.state.pickerData.length}
                    itemHeight={this.props.itemHeight}
                    ref={'PickerViewRef' + pickerId}
                />
            }
        });
    }

    multiSliderValuesChange = (values) => {
        Vibration.vibrate( [0, 10,0, 0]);
        this.multiSliderValue=[ this.props.SliderValue.start, this.props.SliderValue.end];
        this.setState({
            multiSliderValue: values,
        });

    };
    timeListTemp = [];
    timeList() {
        let timeList = [];
        var t = new Date();
        t.setHours(0);
        t.setMinutes(0);
        for (var i = 0; i < 48; i++) {
            var tm = t.getMinutes()<10?'':':'+t.getMinutes().toString();

            var tt = t.getHours()<12?t.getHours().toString()+tm+'am':t.getHours()===12?t.getHours()+'pm':(t.getHours() % 12).toString()+tm+'pm';
            timeList.push(tt);
            t.setMinutes(t.getMinutes() + 30)
        }
        this.timeListTemp=timeList;
    }

    componentWillMount() {
        this.timeList()
        this.setState({
            multiSliderValue:
                [this.props.SliderValue.start, this.props.SliderValue.end]
        })
    }

    renderContent() {
        this.getDateList();
        return <View
            style={{
                backgroundColor:'#fff',
                justifyContent: 'flex-end', alignItems: 'center',
                height: this.props.itemHeight * 3 + this.getSize(15) + this.getSize(44), width: this.mScreenWidth,
            }}>
            <View style={{ width: this.mScreenWidth, height: this.props.itemHeight * 3 + this.getSize(15), flexDirection: 'row', position: 'absolute', bottom: 0 }}>
                {this.renderPicker()}
                <View style={{backgroundColor:'#fff',}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
                        <Text style={{}}>start:{this.timeListTemp[this.state.multiSliderValue[0]]}</Text>
                        <Text style={{}}>end:{this.timeListTemp[this.state.multiSliderValue[1]]}</Text>
                    </View>
                    <View style={{marginLeft:10,marginRight:10}}>
                        <MultiSlider
                            values={[this.props.SliderValue.start,this.props.SliderValue.end]}
                            // values={[this.props.SliderValue.start,this.props.SliderValue.end]}
                            sliderLength={this.mScreenWidth*0.63}
                            onValuesChange={this.multiSliderValuesChange}
                            min={0}
                            max={47}
                            step={1}
                            allowOverlap
                            snapped
                            markerStyle={{padding:8,backgroundColor:'#095FFF'}}
                            trackStyle={{marginBottom:5}}
                        />
                    </View>
                </View>

            </View>
            <View style={{
                width: this.mScreenWidth, height: this.getSize(44),
                backgroundColor: '#ffffff', flexDirection: 'row',
                justifyContent: 'space-between', position: 'absolute', top: 0
            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.dismiss(() => this.props.onPickerCancel && this.props.onPickerCancel(this.props.selectedValue));
                    }}
                    style={{ width: this.getSize(60), height: this.getSize(44), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: this.props.cancelTextSize, fontWeight: '400', color: this.props.cancelTextColor }}>{this.props.cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.dismiss(() => this.props.onPickerConfirm && this.props.onPickerConfirm(this.props.selectedValue, this.timeListTemp[this.state.multiSliderValue[0]], this.timeListTemp[this.state.multiSliderValue[1]], {
                            SliderValue:
                                {
                                    start: this.state.multiSliderValue[0],
                                    end: this.state.multiSliderValue[1]
                                }
                        }));
                        // this.refs['PickerViewRef1'].confirmData(this.state.pickerData);
                    }}
                    style={{ width: this.getSize(60), height: this.getSize(44), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: this.props.confirmTextSize, fontWeight: '400', color: this.props.confirmTextColor }}>{this.props.confirmText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

export default DatePicker;