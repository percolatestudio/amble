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
   
    var poiName :String?
    var poiLocation :CLLocationCoordinate2D?
    var poiAddress :String?

    class func toCoordinates(fromLat latitude:String, andLong longitude:String) -> CLLocationCoordinate2D? {
        let numberFormatter = NSNumberFormatter()
        numberFormatter.numberStyle = NSNumberFormatterStyle.DecimalStyle
        if let lat = numberFormatter.numberFromString(latitude)?.doubleValue,
            let lng = numberFormatter.numberFromString(longitude)?.doubleValue {
                return CLLocationCoordinate2D(latitude: lat, longitude: lng)
        }
        return nil;
    }
    
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
            if let poiName = poi["name"] as? String {
                self.poiName = poiName;
            }
            if let poiAddress = poi["address"] as? String {
                self.poiAddress = poiAddress;
            }
            if let poiLocation = poi["loc"] as? NSDictionary {
                if let lat = poiLocation["lat"] as? String,
                    let lng = poiLocation["long"] as? String
                {
                    self.poiLocation = AmbleNotificationData.toCoordinates(fromLat: lat, andLong: lng)
                }
            }
        }
    }
}
