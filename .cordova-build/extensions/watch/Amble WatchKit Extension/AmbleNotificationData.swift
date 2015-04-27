//
//  AmbleNotificationData.swift
//  Amble
//
//  Created by Tim Hingston on 4/1/15.
//  Copyright (c) 2015 Percolate Studio. All rights reserved.
//

import UIKit
import CoreLocation

class AmbleNotificationData: NSObject {
   
    var poiName :NSString?;
    var poiLocation :CLLocationCoordinate2D?;
    var poiAddress :NSString?;
    var userFirstName :NSString?;
    var userLastName :NSString?;

    init(fromNotification remoteNotification: [NSObject : AnyObject]) {
        if let poi = remoteNotification["poi"] as? Dictionary<NSString, AnyObject> {
            if let poiName = poi["name"] as? NSString {
                self.poiName = poiName;
            }
            if let poiAddress = poi["address"] as? NSString {
                self.poiAddress = poiAddress;
            }
            if let poiLocation = poi["loc"] as? Dictionary<NSString, AnyObject> {
                let poiLatitude = poiLocation["lat"] as! NSString;
                let poiLongitude = poiLocation["long"] as! NSString;

                let numberFormatter = NSNumberFormatter()
                numberFormatter.numberStyle = NSNumberFormatterStyle.DecimalStyle
                self.poiLocation = CLLocationCoordinate2D(latitude: numberFormatter.numberFromString(poiLatitude as String) as! CLLocationDegrees, longitude: numberFormatter.numberFromString(poiLongitude as String) as! CLLocationDegrees);
            }
            if let poiUser = poi["user"] as? Dictionary<NSString, AnyObject> {
                self.userFirstName = poiUser["first"] as? NSString;
                self.userLastName = poiUser["last"] as? NSString;
            }
        }
    }
}
