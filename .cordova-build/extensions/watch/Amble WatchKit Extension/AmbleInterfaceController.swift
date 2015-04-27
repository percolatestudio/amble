//
//  AmbleInterfaceController.swift
//  Amble WatchKit Extension
//
//  Created by Tim Hingston on 3/30/15.
//  Copyright (c) 2015 Percolate Studio. All rights reserved.
//

import WatchKit
import Foundation

class AmbleInterfaceController: WKInterfaceController {

    @IBOutlet weak var map: WKInterfaceMap!
    @IBOutlet weak var poiButton: WKInterfaceButton!
    
    var currentPoiData :AmbleNotificationData?;
    var currentLocation :CLLocationCoordinate2D?;
    var wormhole :MMWormhole?;
    
    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        
        // Configure interface objects here.
        
        self.wormhole = MMWormhole(applicationGroupIdentifier: "group.com.percolatestudio.amble", optionalDirectory: nil)
        let locChannel :String = "location"
        var locData :AnyObject? = self.wormhole?.messageWithIdentifier(locChannel)

        if (locData != nil) {
            let locMessage :String = locData as! String
            self.currentLocation = self.parseLocationMessage(locMessage)
            self.refreshMap()
        }
        self.wormhole?.listenForMessageWithIdentifier(locChannel, listener: { (message:AnyObject!) -> Void in
            let locMessage :String = message as! String;
            self.currentLocation = self.parseLocationMessage(locMessage)
            self.refreshMap()
        });
    }
    
    override func handleActionWithIdentifier(identifier: String?, forRemoteNotification remoteNotification: [NSObject : AnyObject]) {
        var ambleData = AmbleNotificationData(fromNotification: remoteNotification)
        if let poiName = ambleData.poiName as? String {
            self.poiButton.setTitle(poiName)
        }
        self.currentPoiData = ambleData
        if ((ambleData.poiLocation) != nil) {
            self.refreshMap()
        }
    }
    
    func parseLocationMessage(locationMessage: String) -> CLLocationCoordinate2D {
        let latLong = split(locationMessage) {$0 == ","}
        let numberFormatter = NSNumberFormatter()
        numberFormatter.numberStyle = NSNumberFormatterStyle.DecimalStyle
        let currentCoords = CLLocationCoordinate2D(latitude: numberFormatter.numberFromString(latLong[0]) as! CLLocationDegrees, longitude: numberFormatter.numberFromString(latLong[1]) as! CLLocationDegrees)
        return currentCoords;
    }
    
    func refreshMap() {
        var hasCurrentLocation = self.currentLocation != nil;
        var hasPoiLocation = self.currentPoiData != nil && self.currentPoiData!.poiLocation != nil;
        var currentMapRect :MKMapRect = MKMapRectNull
        if (hasCurrentLocation) {
            let currentMapPoint = MKMapPointForCoordinate(self.currentLocation!)
            currentMapRect = MKMapRectMake(currentMapPoint.x, currentMapPoint.y, 5.0, 5.0)
        }
        if (hasPoiLocation) {
            let poiMapPoint = MKMapPointForCoordinate(self.currentPoiData!.poiLocation!)
            let poiMapRect = MKMapRectMake(poiMapPoint.x, poiMapPoint.y, 5.0, 5.0)
            if (hasCurrentLocation) {
                currentMapRect = MKMapRectUnion(currentMapRect, poiMapRect)
            }
            else {
                currentMapRect = poiMapRect
            }
        }
        if (hasCurrentLocation || hasPoiLocation) {
            map.setVisibleMapRect(currentMapRect)
        }
        if (hasCurrentLocation) {
            map.addAnnotation(self.currentLocation!, withPinColor: WKInterfaceMapPinColor.Purple)
        }
        if (hasPoiLocation) {
            map.addAnnotation(self.currentPoiData!.poiLocation!, withPinColor: WKInterfaceMapPinColor.Green)
        }
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    override func contextForSegueWithIdentifier(segueIdentifier: String) -> AnyObject? {
        if (segueIdentifier == "seguePoiDetail") {
            return self.currentPoiData
        }
        return nil;
    }
}
