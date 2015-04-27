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
        if let locData :AnyObject = self.wormhole?.messageWithIdentifier(locChannel) {
            let locMessage :String = locData as String
            self.currentLocation = self.parseLocationMessage(locMessage)
        }
        self.wormhole?.listenForMessageWithIdentifier(locChannel, listener: { (message:AnyObject!) -> Void in
            let locMessage :String = message as String;
            self.currentLocation = self.parseLocationMessage(locMessage)
            self.refreshMap()
        });
    }
    
    override func handleActionWithIdentifier(identifier: String?, forRemoteNotification remoteNotification: [NSObject : AnyObject]) {
        var ambleData = AmbleNotificationData(fromNotification: remoteNotification)
        self.poiButton.setTitle(ambleData.poiName)
        self.currentPoiData = ambleData
        if ((ambleData.poiLocation) != nil) {
            self.refreshMap()
        }
    }
    
    func parseLocationMessage(locationMessage: String) -> CLLocationCoordinate2D {
        let latLong = split(locationMessage, {$0 == ","})
        let numberFormatter = NSNumberFormatter()
        numberFormatter.numberStyle = NSNumberFormatterStyle.DecimalStyle
        let currentCoords = CLLocationCoordinate2D(latitude: numberFormatter.numberFromString(latLong[0]) as CLLocationDegrees, longitude: numberFormatter.numberFromString(latLong[1]) as CLLocationDegrees)
        return currentCoords
    }
    
    func distance(from: CLLocationCoordinate2D, to:CLLocationCoordinate2D) -> CLLocationDistance {
        let from = CLLocation(latitude: from.latitude, longitude: from.longitude)
        let to = CLLocation(latitude: to.latitude, longitude: to.longitude)
        return from.distanceFromLocation(to)
    }
    
    func refreshMap() {
        var hasCurrentLocation = false
        var hasPoiLocation = false
        var mapRegionHeight :Double = 2500 // metres
        // initialize to invalid location
        var centerCoords : CLLocationCoordinate2D = CLLocationCoordinate2DMake(-37.8, 145)
        if let currentLocation = self.currentLocation? {
            hasCurrentLocation = true
            centerCoords = currentLocation
        }
        if let poiLocation = self.currentPoiData?.poiLocation? {
            hasPoiLocation = true
            if !hasCurrentLocation {
                centerCoords = poiLocation
            }
            else {
                mapRegionHeight = self.distance(currentLocation!, to: poiLocation) * 2.0
            }
        }
        let mapViewAspect = 1.0
        var mapRegionWidth = mapRegionHeight * mapViewAspect
        self.map.setRegion(MKCoordinateRegionMakeWithDistance(centerCoords, mapRegionWidth, mapRegionHeight))
        
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
        self.refreshMap()
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
