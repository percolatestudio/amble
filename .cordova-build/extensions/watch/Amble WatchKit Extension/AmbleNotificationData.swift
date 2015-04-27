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

    init(fromNotification remoteNotification: [NSObject : AnyObject]) {
        super.init()
        if let ejson = remoteNotification["ejson"] as? NSString {
            self.parsePayload(fromJSON: ejson)
        }
    }

    func parsePayload(fromJSON jsonPayload: NSString) {
        if let data = jsonPayload.dataUsingEncoding(NSUTF8StringEncoding) {
            var error:NSError? = nil
            if let jsonObject :AnyObject = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers, error: &error) {
                if let payload = jsonObject as? NSDictionary {
                    self.parsePoi(fromDictionary: payload)
                }
            }
            else {
                println("Could not parse JSON: \(error!)")
            }
        }
    }
    
    func parsePoi(fromDictionary payload: NSDictionary) {
        if let poi = payload["poi"] as? NSDictionary {
            if let poiName = poi["name"] as? NSString {
                self.poiName = poiName;
            }
            if let poiAddress = poi["address"] as? NSString {
                self.poiAddress = poiAddress;
            }
            if let poiLocation = poi["loc"] as? NSDictionary {
                let poiLatitude = poiLocation["lat"] as NSString;
                let poiLongitude = poiLocation["long"] as NSString;
                
                let numberFormatter = NSNumberFormatter()
                numberFormatter.numberStyle = NSNumberFormatterStyle.DecimalStyle
                self.poiLocation = CLLocationCoordinate2D(latitude: numberFormatter.numberFromString(poiLatitude) as CLLocationDegrees, longitude: numberFormatter.numberFromString(poiLongitude) as CLLocationDegrees);
            }
        }
    }
}
