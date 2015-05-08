//
//  Deal.swift
//  Amble
//
//  Created by Tim Hingston on 4/1/15.
//  Copyright (c) 2015 Percolate Studio. All rights reserved.
//

import WatchKit
import CoreLocation

class Deal: NSObject {
   
    var _id: String!
    var provider: String!
    var merchant :String!
    var dealDescription :String!
    var dealUrl: String?
    var imageUrl: String?
    var value: Double = 0.0
    var price: Double = 0.0
    var expiry: NSDate?
    var coordinates :CLLocationCoordinate2D?
    var address :String!
    var city :String!
    var postalCode :String!
    var state :String!
    var country :String!
    var dictionary :[String: AnyObject]!

    init(fromNotification remoteNotification: [NSObject:AnyObject]) {
        super.init()
        if let dealDict = Deal.unwrapFromNotification(remoteNotification) {
            self.parseDeal(dealDict)
        }
    }
    
    init(fromDictionary dealDict: [String:AnyObject]) {
        super.init()
        self.parseDeal(dealDict)
    }
    
    class func unwrapFromNotification(remoteNotification: [NSObject:AnyObject]) -> [String:AnyObject]? {
        if let ejson = remoteNotification["ejson"] as? NSString {
            if let data = ejson.dataUsingEncoding(NSUTF8StringEncoding) {
                var error:NSError? = nil
                if let jsonObject = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers, error: &error) as? [String:AnyObject] {
                    if let dealDict = jsonObject["deal"] as? [String:AnyObject] {
                        return dealDict
                    }
                }
                else {
                    println("Could not parse JSON: \(error!)")
                }
            }
            else {
                println("Could not create data stream")
            }
        }
        else {
            println("ejson field not found in notification")
        }
        return nil
    }
    
    func parseDeal(dealDict: [String:AnyObject]) {
        self._id = dealDict["_id"] as? String ?? ""
        self.merchant = dealDict["merchant"] as? String ?? ""
        self.dealDescription = dealDict["description"] as? String ?? ""
        self.dealUrl = dealDict["dealUrl"] as? String ?? nil
        self.imageUrl = dealDict["imageUrl"] as? String ?? nil
        self.value = (dealDict["value"] as? Double ?? 0.0) / 100.0
        self.price = (dealDict["price"] as? Double ?? 0.0) / 100.0
        self.provider = dealDict["type"] as? String ?? ""
        if let expiry = dealDict["expiry"] as? [String:AnyObject], date = expiry["$date"] as? Double {
            self.expiry = NSDate(timeIntervalSince1970: (date / 1000) as NSTimeInterval)
        }
        
        if let location = dealDict["location"] as? [String:AnyObject] {
            self.address = location["address"] as? String ?? ""
            self.city = location["city"] as? String ?? ""
            self.postalCode = location["postalCode"] as? String ?? ""
            self.state = location["state"] as? String ?? ""
            self.country = location["country"] as? String ?? ""
            
            if let coordinates = location["coordinates"] as? Array<CLLocationDegrees> {
                self.coordinates = CLLocationCoordinate2D(latitude: coordinates[1], longitude: coordinates[0])
            }
        }
        self.dictionary = dealDict
    }
}
