App.info({
  id: 'com.percolatestudio.amble',
  name: 'Amble',
  version: '0.1.0',
  description: 'Get notified about interesting things that are nearby.',
  author: 'Percolate Studio',
  email: 'support@ambleapp.com',
  website: 'http://amblepp.com'
});

App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('DisallowOverscroll', true);
App.setPreference('LoadUrlTimeoutValue', 60000);

// Set up resources such as icons and launch screens.
// App.icons({
//   // iOS
//   'iphone': '.cordova-build/resources/production/ios/icons/icon-60.png',
//   'iphone_2x': '.cordova-build/resources/production/ios/icons/icon-60@2x.png',
//   'ipad': '.cordova-build/resources/production/ios/icons/icon-76.png',
//   'ipad_2x': '.cordova-build/resources/production/ios/icons/icon-76@2x.png',

//   // Android
//   'android_ldpi': '.cordova-build/resources/production/android/icons/icon-36.png',
//   'android_mdpi': '.cordova-build/resources/production/android/icons/icon-48.png',
//   'android_hdpi': '.cordova-build/resources/production/android/icons/icon-72.png',
//   'android_xhdpi': '.cordova-build/resources/production/android/icons/icon-96.png'
// });

// App.launchScreens({
//   // iOS
//   'iphone': '.cordova-build/resources/common/ios/splash/Default~iphone.png',
//   'iphone_2x': '.cordova-build/resources/common/ios/splash/Default@2x~iphone.png',
//   'iphone5': '.cordova-build/resources/common/ios/splash/Default-568h@2x~iphone.png',
//   'ipad_portrait': '.cordova-build/resources/common/ios/splash/Default-Portrait~ipad.png',
//   'ipad_portrait_2x': '.cordova-build/resources/common/ios/splash/Default-Portrait@2x~ipad.png',
//   'ipad_landscape': '.cordova-build/resources/common/ios/splash/Default-Landscape~ipad.png',
//   'ipad_landscape_2x': '.cordova-build/resources/common/ios/splash/Default-Landscape@2x~ipad.png',

//   // Android
//   'android_ldpi_portrait': '.cordova-build/resources/common/android/splash/splash-ldpi-portrait.png',
//   'android_ldpi_landscape': '.cordova-build/resources/common/android/splash/splash-ldpi-landscape.png',
//   'android_mdpi_portrait': '.cordova-build/resources/common/android/splash/splash-mdpi-portrait.png',
//   'android_mdpi_landscape': '.cordova-build/resources/common/android/splash/splash-mdpi-landscape.png',
//   'android_hdpi_portrait': '.cordova-build/resources/common/android/splash/splash-hdpi-portrait.png',
//   'android_hdpi_landscape': '.cordova-build/resources/common/android/splash/splash-hdpi-landscape.png',
//   'android_xhdpi_portrait': '.cordova-build/resources/common/android/splash/splash-xhdpi-portrait.png',
//   'android_xhdpi_landscape': '.cordova-build/resources/common/android/splash/splash-xhdpi-landscape.png'
// });