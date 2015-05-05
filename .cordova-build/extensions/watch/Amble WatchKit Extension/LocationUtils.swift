//
//  LocationUtils.swift
//  Amble
//
//  Created by Tim Hingston on 5/6/15.
//
//

import WatchKit
import Foundation

class LocationUtils: NSObject {
    
    class func toCoordinates(fromLat latitude:String, andLong longitude:String) -> CLLocationCoordinate2D? {
        let numberFormatter = NSNumberFormatter()
        numberFormatter.numberStyle = NSNumberFormatterStyle.DecimalStyle
        if let lat = numberFormatter.numberFromString(latitude)?.doubleValue,
            let lng = numberFormatter.numberFromString(longitude)?.doubleValue {
                return CLLocationCoordinate2D(latitude: lat, longitude: lng)
        }
        return nil;
    }
    
    class func distance(from: CLLocationCoordinate2D, to:CLLocationCoordinate2D) -> CLLocationDistance {
        let from = CLLocation(latitude: from.latitude, longitude: from.longitude)
        let to = CLLocation(latitude: to.latitude, longitude: to.longitude)
        return from.distanceFromLocation(to)
    }
}
