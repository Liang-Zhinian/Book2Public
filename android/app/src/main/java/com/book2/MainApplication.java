package com.book2;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.amap.RCTAMapPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

import com.rnfs.RNFSPackage;
import com.sensors.RNSensorsPackage;

import cn.qiuxiang.react.amap3d.AMap3DPackage;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.zmxv.RNSound.RNSoundPackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new SvgPackage(),
                    new VectorIconsPackage(),
                    new LinearGradientPackage(),
                    new RCTAMapPackage(),
                    new AMap3DPackage(),
                    new RNSensorsPackage(),
                    new RNFSPackage(),
                    new RNI18nPackage(),
                    new RCTCapturePackage()
                    , new FastImageViewPackage()
                    , new RNSoundPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
