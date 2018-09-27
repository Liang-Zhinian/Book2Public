package com.amap;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Parcelable;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.Toast;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.location.CoordinateConverter;
import com.amap.api.location.DPoint;
import com.amap.api.maps2d.AMap;
import com.amap.api.maps2d.CameraUpdate;
import com.amap.api.maps2d.CameraUpdateFactory;
import com.amap.api.maps2d.LocationSource;
import com.amap.api.maps2d.MapView;
import com.amap.api.maps2d.MapsInitializer;
import com.amap.api.maps2d.UiSettings;
import com.amap.api.maps2d.model.BitmapDescriptor;
import com.amap.api.maps2d.model.BitmapDescriptorFactory;
import com.amap.api.maps2d.model.CameraPosition;
import com.amap.api.maps2d.model.Circle;
import com.amap.api.maps2d.model.CircleOptions;
import com.amap.api.maps2d.model.LatLng;
import com.amap.api.maps2d.model.Marker;
import com.amap.api.maps2d.model.MarkerOptions;
import com.amap.api.services.cloud.CloudSearch;
import com.amap.api.services.core.AMapException;
import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.poisearch.PoiSearch;
import com.amap.util.SensorEventHelper;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import static com.amap.api.maps2d.AMapOptions.LOGO_POSITION_BOTTOM_RIGHT;
import static com.amap.api.maps2d.AMapOptions.ZOOM_POSITION_RIGHT_CENTER;

public class RCTAMapView extends FrameLayout implements LocationSource,
        AMapLocationListener,
        AMap.OnCameraChangeListener,
        AMap.OnMapLoadedListener {
    private String centerMarker = "";
    private String locationMarker = "";
    private static int SCROLL_BY_PX = 1;
    private MapView MAPVIEW;
    private LatLng latLng;
    private OnLocationChangedListener mListener;
    private AMapLocationClient mlocationClient;
    private AMapLocationClientOption mLocationOption;
    private SensorEventHelper mSensorHelper;
    private int STROKE_COLOR = Color.argb(180, 3, 145, 255);
    private int FILL_COLOR = Color.argb(10, 0, 0, 180);
    private float strokeWidth = 1f;
    private AMap AMAP;
    private Marker mLocMarker;
    private Circle mCircle;
    private LatLng location;//定位标记
    private int PAGESIZE = 10;//每页显示数量
    private boolean isFirstMove = true;
    private String MapLanguage = "cn";//中英
    private UiSettings mapUiSettings;

    private MarkerOptions markerOption;
    private float RADIUS = 0;//定位圆圈
    private double zoomLevel = 18;
    private int HEIGHT, WIDTH, viewWidth, viewHeight;
    private ThemedReactContext CONTEXT;
    private ViewGroup.LayoutParams PARAM;
    private boolean hasLocationMarker = false;
    private boolean zoomControls = false;//显示缩放按钮
    private boolean zoomGestures = true;//手势缩放
    private boolean scaleControls = false;//比例尺
    private boolean myLocation = false;//定位按钮
    private boolean compassEnable = false;//指南针
    private boolean onceLocation = true;
    private ImageView CenterView;
    private long startTime;

    private String testDataFromJson;//测试json数据

    private CloudSearch.Query mQuery;
    private CloudSearch mCloudSearch;

    public RCTAMapView(ThemedReactContext context) {
        super(context);
        this.CONTEXT = context;
        CenterView = new ImageView(context);
        Resources resources = context.getCurrentActivity().getResources();
        DisplayMetrics dm = resources.getDisplayMetrics();

        PARAM = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        /**
         * 处理中心点控件位置
         */
//        if (centerMarker != null && centerMarker != "") {
//            HEIGHT = getHeight();
//            WIDTH = getWidth();
//            LayoutParams params = (LayoutParams) CenterView.getLayoutParams();
//
//            viewWidth = CenterView.getMeasuredWidth();
//            viewHeight = CenterView.getMeasuredHeight();
//
//            params.setMargins(WIDTH / 2 - viewWidth / 2, HEIGHT / 2 - viewHeight, 0, 0);
//            CenterView.setLayoutParams(params);
//        }

        super.onLayout(changed, left, top, right, bottom);

    }

    /**
     * Activity onResume后调用view的onAttachedToWindow
     */
    @Override
    protected void onAttachedToWindow() {
//       MapsInitializer.loadWorldGridMap(true);
        init();
        super.onAttachedToWindow();
    }

    /**
     * 初始化控件,定位位置
     */
    private void init() {
        mSensorHelper = new SensorEventHelper(CONTEXT);
        if (mSensorHelper != null) {
            mSensorHelper.registerSensorListener();
        }
        MAPVIEW = new MapView(CONTEXT);
        MAPVIEW.setLayoutParams(PARAM);
        this.addView(MAPVIEW);
        MAPVIEW.onCreate(CONTEXT.getCurrentActivity().getIntent().getExtras());

        if (centerMarker != null && centerMarker != "") {
            CenterView.setLayoutParams(new ViewGroup.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
            CenterView.setImageResource(getImageId(centerMarker));
            this.addView(CenterView, 1);
        }
        AMAP = MAPVIEW.getMap();
        setMapOptions();
        MapsInitializer.loadWorldGridMap(true);
        setUpMap();
    }


    /**
     * 对地图添加onMapIsAbroadListener
     */
    private void setUpMap() {
        AMAP.setOnCameraChangeListener(new AMap.OnCameraChangeListener() {

            @Override
            public void onCameraChangeFinish(CameraPosition cameraPosition) {
//                ToastUtil.showShortToast(getApplicationContext(), "当前地图中心位置是否在国外: "+cameraPosition.isAbroad);
            }

            @Override
            public void onCameraChange(CameraPosition cameraPosition) {
            }
        });
    }


    /**
     * 设置一些amap的属性
     */
    private void setMapOptions() {

        AMAP.setMapType(AMap.MAP_TYPE_NORMAL);// 矢量地图模式

        mapUiSettings = AMAP.getUiSettings();//实例化UiSettings类
        mapUiSettings.setZoomControlsEnabled(zoomControls);//显示缩放按钮

        mapUiSettings.setZoomPosition(ZOOM_POSITION_RIGHT_CENTER);//缩放按钮  右边界中部：ZOOM_POSITION_RIGHT_CENTER 右下：ZOOM_POSITION_RIGHT_BUTTOM。
        mapUiSettings.setLogoPosition(LOGO_POSITION_BOTTOM_RIGHT);//Logo的位置 左下：LOGO_POSITION_BOTTOM_LEFT 底部居中：LOGO_POSITION_BOTTOM_CENTER 右下：LOGO_POSITION_BOTTOM_RIGHT
        mapUiSettings.setCompassEnabled(compassEnable);//指南针
        mapUiSettings.setZoomGesturesEnabled(zoomGestures);//手势缩放
        mapUiSettings.setScaleControlsEnabled(scaleControls);//比例尺

        changeCamera(
                CameraUpdateFactory.newCameraPosition(new CameraPosition(
                        latLng, (float) zoomLevel, 30, 0)));

        hasLocationMarker = true;
        addLocationMarker(latLng, RADIUS, mLocMarker);

        AMAP.setLocationSource(this);// 设置定位监听
        AMAP.setOnCameraChangeListener(this);// 对amap添加移动地图事件监听器
        mapUiSettings.setMyLocationButtonEnabled(myLocation);// 设置默认定位按钮是否显示
        AMAP.setMyLocationEnabled(true);// 设置为true表示显示定位层并可触发定位，false表示隐藏定位层并不可触发定位，默认是false

        AMAP.setOnMapLoadedListener(listener);
    }

    AMap.OnMapLoadedListener listener;

    public void setOnMapLoadedListener(AMap.OnMapLoadedListener l) {
        listener = l;
    }

    /**
     * 中心点添加定位标记
     *
     * @param latLng
     * @param RADIUS
     * @param mLocMarker
     */
    private void addLocationMarker(LatLng latLng, float RADIUS, Marker mLocMarker) {
        addCircle(latLng, RADIUS);//添加定位精度圆
//        addMarker(latLng);//添加定位图标
//        mSensorHelper.setCurrentMarker(mLocMarker);//定位图标旋转
    }

    /**
     * 调用函数moveCamera来改变可视区域
     */
    protected void changeCamera(CameraUpdate update) {

        AMAP.moveCamera(update);

    }

    /**
     * 获得图片资源ID
     *
     * @return
     */
    private int getImageId(String fileName) {
        int drawableId = CONTEXT.getCurrentActivity().getResources().getIdentifier(fileName, "drawable", CONTEXT.getCurrentActivity().getClass().getPackage().getName());
        if (drawableId == 0) {
            drawableId = CONTEXT.getCurrentActivity().getResources().getIdentifier("splash", "drawable", CONTEXT.getCurrentActivity().getPackageName());
        }

        return drawableId;
    }

    /**
     * 根据动画调用函数animateCamera来改变可视区域
     */
    private void animateCamera(CameraUpdate update, AMap.CancelableCallback callback) {

        AMAP.animateCamera(update, 1000, callback);

    }

    @Override
    protected Parcelable onSaveInstanceState() {
        if (CONTEXT.getCurrentActivity().getIntent() != null && CONTEXT.getCurrentActivity().getIntent().getExtras() != null) {
            MAPVIEW.onSaveInstanceState(CONTEXT.getCurrentActivity().getIntent().getExtras());
        }
        return super.onSaveInstanceState();
    }

    @Override
    protected void onDetachedFromWindow() {
        this.removeView(MAPVIEW);
        MAPVIEW.onDestroy();
        super.onDetachedFromWindow();
    }

    /**
     * 对应onResume、对应onPause
     *
     * @param hasWindowFocus
     */
    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {

        super.onWindowFocusChanged(hasWindowFocus);

        if (hasWindowFocus) {
//            对应onResume
            MAPVIEW.onResume();
        } else {
            //对应onPause
            MAPVIEW.onPause();

        }

    }

    @Override
    public void onLocationChanged(AMapLocation amapLocation) {
//
//        if (!isFirstMove) {
//            isFirstMove = true;
//        }
//
//        if (mListener != null && amapLocation != null) {
//            if (amapLocation != null
//                    && amapLocation.getErrorCode() == 0) {
//
//                location = new LatLng(amapLocation.getLatitude(), amapLocation.getLongitude());
////                Log.i("TEST", "getLatitude:"+amapLocation.getLatitude()+"getLongitude:"+amapLocation.getLongitude());
//              String  DEFAULTCITY = amapLocation.getCity();
//                if (!hasLocationMarker) {
//                    hasLocationMarker = true;
//                    addLocationMarker(location, RADIUS, mLocMarker);
////                    首次定位到点location
////                    AMAP.moveCamera(CameraUpdateFactory.newLatLngZoom(location, zoomLevel));
//                } else {
//                    mCircle.setCenter(location);
//                    mCircle.setRadius(RADIUS);
//                    mLocMarker.setPosition(location);
//                }
//                //移动镜头定位到点location
//                AMAP.moveCamera(CameraUpdateFactory.newLatLngZoom(location, (float) zoomLevel));
//
//                changeCamera(
//                        CameraUpdateFactory.newCameraPosition(new CameraPosition(location, (float) zoomLevel, 30, 0)));
//              /*  animateCamera(CameraUpdateFactory.newCameraPosition(new CameraPosition(
//                        location, zoomLevel, 30, 0)),null);*/
//                changeCamera(CameraUpdateFactory.scrollBy(0, -SCROLL_BY_PX));
//            } else {
//                String errText = "定位失败," + amapLocation.getErrorCode() + ": " + amapLocation.getErrorInfo();
//                Log.i("TEST", errText);
//
//            }
//        }
//        long endTime2 = System.currentTimeMillis();
//        Log.i("Test", "onLocationChangedFINISH:" + (endTime2 - startTime + ",getLatitude=" + amapLocation.getLatitude() + "getLongitude=" + amapLocation.getLongitude()));
    }

    /**
     * 获得当前控件中心点坐标
     */
    public LatLng getCenterLocation() {
        LatLng latlng = AMAP.getCameraPosition().target;
//    addMarkersToMap(latlng);
        return latlng;
    }

    /**
     * 获得当前控件中心点坐标
     */
    public void setCenterLocation(double latitude, double longitude) {
        LatLng latlng = new LatLng(latitude, longitude);
        AMAP.moveCamera(CameraUpdateFactory.newLatLngZoom(latlng, (float) zoomLevel));
//    addMarkersToMap(latlng);
    }

    /**
     * 在地图上添加marker
     */
    private void addMarkersToMap(LatLng latlng, JSONObject object) {

        try {
            markerOption = new MarkerOptions()
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE))
                    .position(latlng)
                    .title(object.get("Id").toString())
                    .draggable(true);
            AMAP.addMarker(markerOption);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 定位到设备定位位置
     */
    public void startLocation() {
        startTime = System.currentTimeMillis();
        Log.i("Test", "startTime:" + startTime);
        if (mlocationClient == null) {
            Log.i("Test", "mlocationClient = null");
            mlocationClient = new AMapLocationClient(CONTEXT);
            mLocationOption = new AMapLocationClientOption();
            //设置定位监听
            mlocationClient.setLocationListener(this);
            //设置为高精度定位模式
            mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
            mLocationOption.setOnceLocation(onceLocation);
//            mLocationOption.setOnceLocationLatest(true);
            mLocationOption.setLocationCacheEnable(true);//定位缓存策略
//            mLocationOption.setInterval(10);
//            mLocationOption.setInterval(3*60*1000);
            //设置定位参数
            mlocationClient.setLocationOption(mLocationOption);

            // 此方法为每隔固定时间会发起一次定位请求，为了减少电量消耗或网络流量消耗，
            // 注意设置合适的定位时间的间隔（最小间隔支持为2000ms），并且在合适时间调用stopLocation()方法来取消定位请求
            // 在定位结束后，在合适的生命周期调用onDestroy()方法
            // 在单次定位情况下，定位无论成功与否，都无需调用stopLocation()方法移除请求，定位sdk内部会移除

        }
        mlocationClient.startLocation();
    }

    protected void addCircle(LatLng latlng, float RADIUS) {
        try {
            AMAP.clear();
            if (MapLanguage.equals("cn")) {
                AMAP.setMapLanguage(AMap.CHINESE);
            } else {
                AMAP.setMapLanguage(AMap.ENGLISH);
            }
            CircleOptions options = new CircleOptions();
            options.strokeWidth(strokeWidth);//圆圈的宽度
            options.fillColor(FILL_COLOR);//圆饼填充的颜色
            options.strokeColor(STROKE_COLOR);//线填充的颜色
            options.center(latlng);//中心坐标
            options.radius(RADIUS);//半径范围
            addMarker(latlng);//添加定位图标
            mCircle = AMAP.addCircle(options);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (latlng != null && testDataFromJson != null) {
            try {
                try {
                    JSONObject jsonObject = new JSONObject(testDataFromJson);
                    JSONArray json = jsonObject.getJSONArray("testData");
                    if (json.length() > 0) {
                        for (int i = 0; i < json.length(); i++) {
                            JSONObject job = json.getJSONObject(i);
                            String dataLnt = job.get("LatLng").toString();
                            JSONObject obj = new JSONObject(dataLnt);
                            double latitude = Double.parseDouble(obj.get("latitude").toString());
                            double longitude = Double.parseDouble(obj.get("longitude").toString());
                            LatLng end = new LatLng(latitude, longitude);
                            if (calculateDistance(latlng, end) <= RADIUS) {
                                addMarkersToMap(end, job);
                            }
                        }
                    }
                } catch (Exception e) {
                    JSONArray json = new JSONArray(testDataFromJson);
//                    JSONArray json = jsonObject.getJSONArray(testDataFromJson);
                    if (json.length() > 0) {
                        for (int i = 0; i < json.length(); i++) {
                            JSONObject job = json.getJSONObject(i);
                            double latitude = Double.parseDouble(job.get("Latitude").toString());
                            double longitude = Double.parseDouble(job.get("Longitude").toString());

                            DPoint dPoint = new DPoint(latitude, longitude);

                            LatLng end = convert(dPoint);
                            if (calculateDistance(latlng, end) <= RADIUS) {
                                addMarkersToMap(end, job);
                            }
                        }
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

//        for (Object obj:testDataFromJson) {
//            if(calculateDistance(latlng,latlng)<=RADIUS){
//            addMarkersToMap(latlng);}
//        }


//        @SuppressLint("ObjectAnimatorBinding") ObjectAnimator radiusAnim = ObjectAnimator.ofFloat(mCircle, "radius", RADIUS, 0.0f, RADIUS);
//        radiusAnim.setDuration(1000);
//        radiusAnim.setRepeatCount(ValueAnimator.INFINITE);//无限循环
////        translationYAnim.setRepeatMode(ValueAnimator.INFINITE);
//        radiusAnim.start();

    }

    //坐标转换
    private LatLng convert(DPoint dPoint) {
        try {
            //初始化坐标转换类
            CoordinateConverter converter = new CoordinateConverter(CONTEXT);
            /**
             * 设置坐标来源,这里使用百度坐标作为示例
             * 可选的来源包括：
             * <li>CoordType.BAIDU ： 百度坐标
             * <li>CoordType.MAPBAR ： 图吧坐标
             * <li>CoordType.MAPABC ： 图盟坐标
             * <li>CoordType.SOSOMAP ： 搜搜坐标
             * <li>CoordType.ALIYUN ： 阿里云坐标
             * <li>CoordType.GOOGLE ： 谷歌坐标
             * <li>CoordType.GPS ： GPS坐标
             */
            converter.from(CoordinateConverter.CoordType.GOOGLE);
            //设置需要转换的坐标
            converter.coord(dPoint);
            //转换成高德坐标
            DPoint destPoint = converter.convert();
            if (null != destPoint) {
                LatLng end = new LatLng(destPoint.getLatitude(), destPoint.getLongitude());
                return end;
//                tvConvertReult.setText("转换后坐标(经度、纬度):" + destPoint.getLongitude() + "," + destPoint.getLatitude());
            } else {
                return null;
//                Toast.makeText(getApplicationContext(), "坐标转换失败", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
//            Toast.makeText(getApplicationContext(), "坐标转换失败", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 获取两点间距离
     *
     * @param start
     * @param end
     * @return
     */
    public static int calculateDistance(LatLng start, LatLng end) {
        double x1 = start.longitude;
        double y1 = start.latitude;
        double x2 = end.longitude;
        double y2 = end.latitude;
        return calculateDistance(x1, y1, x2, y2);

    }

    public static int calculateDistance(double x1, double y1, double x2, double y2) {
        final double NF_pi = 0.01745329251994329; // 弧度 PI/180
        x1 *= NF_pi;
        y1 *= NF_pi;
        x2 *= NF_pi;
        y2 *= NF_pi;
        double sinx1 = Math.sin(x1);
        double siny1 = Math.sin(y1);
        double cosx1 = Math.cos(x1);
        double cosy1 = Math.cos(y1);
        double sinx2 = Math.sin(x2);
        double siny2 = Math.sin(y2);
        double cosx2 = Math.cos(x2);
        double cosy2 = Math.cos(y2);
        double[] v1 = new double[3];
        v1[0] = cosy1 * cosx1 - cosy2 * cosx2;
        v1[1] = cosy1 * sinx1 - cosy2 * sinx2;
        v1[2] = siny1 - siny2;
        double dist = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);

        return (int) (Math.asin(dist / 2) * 12742001.5798544);
    }


    private void addMarker(LatLng latlng) {
//        if (mLocMarker != null) {
//            return;
//        }

//        Bitmap bMap = BitmapFactory.decodeResource(this.getResources(),
//                R.drawable.navi_map_gps_locked);
        Bitmap bMap = BitmapFactory.decodeResource(this.getResources(),
                getImageId(locationMarker));
        BitmapDescriptor des = BitmapDescriptorFactory.fromBitmap(bMap);

//		BitmapDescriptor des = BitmapDescriptorFactory.fromResource(R.drawable.navi_map_gps_locked);
        MarkerOptions options = new MarkerOptions();
        options.icon(des);
        options.anchor(0.5f, 0.5f);
        options.position(latlng);
        // 将Marker设置为贴地显示，可以双指下拉看效果

        mLocMarker = AMAP.addMarker(options);
    }


    @Override
    public void activate(OnLocationChangedListener listener) {
        mListener = listener;
//        startLocation();
    }

    @Override
    public void deactivate() {
        mListener = null;
        if (mlocationClient != null) {
            mlocationClient.stopLocation();
            mlocationClient.onDestroy();
        }
        mlocationClient = null;
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {


    }

    /**
     * 控制中心点动画 获取中心点坐标 查询周边
     *
     * @param cameraPosition
     */
    @Override
    public void onCameraChangeFinish(CameraPosition cameraPosition) {
        /**
         * 中心点动画开始
         */
        ObjectAnimator translationYAnim = ObjectAnimator.ofFloat(CenterView, "translationY", 0.0f, -viewHeight / 2, 0.0f);
        translationYAnim.setDuration(600);
//        translationYAnim.setRepeatCount(ValueAnimator.RESTART);//重复一次
//        translationYAnim.setRepeatMode(ValueAnimator.INFINITE);
        translationYAnim.start();
        /**
         * 中心点动画结束
         */


        if (!isFirstMove) {
            return;
        }
        LatLng latlng = AMAP.getCameraPosition().target;//获取屏幕中心点

        WritableMap eventMap = Arguments.createMap();
        WritableMap dataMap = Arguments.createMap();
        WritableMap centerCoordinateMap = Arguments.createMap();
        centerCoordinateMap.putDouble("latitude", latlng.latitude);
        centerCoordinateMap.putDouble("longitude", latlng.longitude);
        dataMap.putMap("centerCoordinate", centerCoordinateMap);
        eventMap.putMap("data", dataMap);
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "onDidMoveByUser",
                eventMap);

    }

    public void setHasLocationMarker(boolean hasLocationMarker) {
        this.hasLocationMarker = hasLocationMarker;
    }

    public void setZoomControls(boolean zoomControls) {
        this.zoomControls = zoomControls;
    }

    public void setZoomGestures(boolean zoomGestures) {
        this.zoomGestures = zoomGestures;
    }

    public void setScaleControls(boolean scaleControls) {
        this.scaleControls = scaleControls;
    }

    public void setCompassEnable(boolean compassEnable) {
        this.compassEnable = compassEnable;
    }

    public void setOnceLocation(boolean onceLocation) {
        this.onceLocation = onceLocation;
    }

    public void setRADIUS(float RADIUS) {
        this.RADIUS = RADIUS;
    }

    public void setHEIGHT(int HEIGHT) {
        this.HEIGHT = HEIGHT;
    }

    public void setWIDTH(int WIDTH) {
        this.WIDTH = WIDTH;
    }

    public void setViewWidth(int viewWidth) {
        this.viewWidth = viewWidth;
    }

    public void setViewHeight(int viewHeight) {
        this.viewHeight = viewHeight;
    }

    public void setLatLng(LatLng latLng) {
        this.latLng = latLng;
    }

    public void setCenterMarker(String centerMarker) {
        this.centerMarker = centerMarker;
    }

    public void setLocationMarker(String locationMarker) {
        this.locationMarker = locationMarker;
    }

    public void setZoomLevel(double zoomLevel) {
        this.zoomLevel = zoomLevel;
    }

    public void setSTROKE_COLOR(int STROKE_COLOR) {
        this.STROKE_COLOR = STROKE_COLOR;
    }

    public void setFILL_COLOR(int FILL_COLOR) {
        this.FILL_COLOR = FILL_COLOR;
    }

    public void setStrokeWidth(float strokeWidth) {
        this.strokeWidth = strokeWidth;
    }

    public void setMapLanguage(String MapLanguage) {
        this.MapLanguage = MapLanguage;
    }

    public void setTestDataFromJson(String testDataFromJson) {
        this.testDataFromJson = testDataFromJson;
    }

    public MapView getMAPVIEW() {
        return MAPVIEW;
    }

    public void setMyLocation(boolean myLocation) {
        this.myLocation = myLocation;
    }

    @Override
    public void onMapLoaded() {

    }
}
