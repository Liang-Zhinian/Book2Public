import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent, View, ViewPropTypes} from 'react-native';

type PropsType = {
        minValue? : number,
        maxValue ? : number,
        defaultValue ? : number,
        step ? : number,
        num ? : number,
        unit ? : string,
        mMax ? : number,
        mMin ? : number,
        mCountScale ? : number,
        mScaleScrollViewRange ? : number,
        mScaleMargin ? : number,
        mScaleHeight ? : number,
        mScaleMaxHeight ? : number,
        // mRectWidth ? : number,
        mRectHeight ? : number,
        FirstScale ? : number,
    } &typeof (View);

export default class ReactScrollRuler extends Component {
    static propTypes = {
        minValue: PropTypes.number,
        maxValue: PropTypes.number,
        defaultValue: PropTypes.number,
        FirstScale : PropTypes.number,
        step: PropTypes.number,
        num: PropTypes.number,
        unit: PropTypes.string,
        onSelect: PropTypes.func,
        ...ViewPropTypes,

        mMax: PropTypes.number,
        mMin: PropTypes.number,
        mCountScale: PropTypes.number,
        // mScaleScrollViewRange: PropTypes.number.isRequired,
        mScaleMargin: PropTypes.number,
        mScaleHeight: PropTypes.number,
        mScaleMaxHeight: PropTypes.number,
        // mRectWidth: PropTypes.number.isRequired,
        mRectHeight: PropTypes.number,
    };
    props: PropsType;
    rulerRef: any;

    setNativeProps(props: PropsType) {
        this.rulerRef.setNativeProps(props);
    }

    _onSelect = (event) => {
        if (!this.props.onSelect) {
            return;
        }
        this.props.onSelect(event.nativeEvent.value);
    }

    render() {
        const {
            minValue,
            maxValue,
            defaultValue,
            step,
            num,
            unit,
            FirstScale,
            mMax,
            mMin,
            mCountScale,
            // mScaleScrollViewRange,
            mScaleMargin,
            mScaleHeight,
            mScaleMaxHeight,
            // mRectWidth,
            mRectHeight,
            onSelect,
            ...otherProps,

        } = this.props;

        return (
            <ARNScrollRuler
                ref={(component) => {
                    this.rulerRef = component;
                }}
                minValue={minValue}
                maxValue={maxValue}
                defaultValue={defaultValue}
                FirstScale={FirstScale}
                step={step}
                num={num}
                unit={unit}
                onSelect={this._onSelect}
                {...otherProps}

                mMax={mMax}
                mMin={mMin}
                mCountScale={mCountScale}
                // mScaleScrollViewRange={mScaleScrollViewRange}
                mScaleMargin={mScaleMargin}
                mScaleHeight={mScaleHeight}
                mScaleMaxHeight={mScaleMaxHeight}
                // mRectWidth={mRectWidth}
                mRectHeight={mRectHeight}
            />
        );
    }
}

{/*<RNScrollRuler*/
}
{/*ref={(component) => {*/
}
{/*this.rulerRef = component;*/
}
{/*}}*/
}
{/*minValue={minValue}*/
}
{/*maxValue={maxValue}*/
}
{/*defaultValue={defaultValue}*/
}
{/*step={step}*/
}
{/*num={num}*/
}
{/*unit={unit}*/
}
{/*onSelect={this._onSelect}*/
}
{/*{...otherProps}*/
}
{/*/>*/
}

const ARNScrollRuler = requireNativeComponent('HorizontalReactScrollRuler', ReactScrollRuler, {
    nativeOnly: {onSelect: true}
});