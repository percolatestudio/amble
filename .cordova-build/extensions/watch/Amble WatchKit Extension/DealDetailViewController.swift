//
//  DealDetailViewController.swift
//  Amble WatchKit Extension
//
//  Created by Tim Hingston on 3/30/15.
//  Copyright (c) 2015 Percolate Studio. All rights reserved.
//

import WatchKit
import Foundation

class DealDetailViewController: WKInterfaceController {
    
    weak var map: WKInterfaceMap!
    @IBOutlet weak var table: WKInterfaceTable!
    var deal :Deal!

    enum RowIds: Int {
        case Header = 0, Map, Action, Save
    }

    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        self.deal = context as! Deal
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
        self.updateTable()
        self.refreshMap()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    func distanceText(forDistance :CLLocationDistance) -> NSAttributedString {
        var units = "km"
        var distance = forDistance / 1000.0
        if deal.country == "US" {
            distance = distance / 1.6
            units = "mi"
        }
        let distanceText :String = String(format: "%.1f%@", distance, units)
        var distanceStr = NSMutableAttributedString(string: distanceText, attributes: [NSFontAttributeName : UIFont.systemFontOfSize(26.0)])
        
        let unitsStart = count(distanceText) - count(units)
        distanceStr.addAttribute(NSFontAttributeName, value: UIFont.systemFontOfSize(16.0), range: NSRange(location:unitsStart,length:count(units)))
        return distanceStr
    }
    
    func priceText(forPrice :Double, withCurrency currency:String="$") -> NSAttributedString {
        let priceText = String(format: "%.0f$", forPrice)
        var priceStr = NSMutableAttributedString(string: priceText, attributes: [NSFontAttributeName : UIFont.systemFontOfSize(26.0)])
        
        let currencyStart = count(priceText) - count(currency)
        priceStr.addAttribute(NSFontAttributeName, value: UIFont.systemFontOfSize(16.0), range: NSRange(location:currencyStart,length:count(currency)))
        return priceStr
    }
    
    func timeRemaining(forExpiry :NSDate) -> String {
        let now = NSDate(timeIntervalSinceNow: 0)
        let totalHours = round((forExpiry.timeIntervalSince1970 - now.timeIntervalSince1970) / (60*60))
        let days = floor(totalHours / 24.0)
        let hours = totalHours % 24
        return String(format:"%.0fD %.0fHR TO GO", days, hours)
    }
    
    func discountText(forPrice :Double, andValue value:Double) -> String {
        let pct = 100 * (1.0 - (forPrice / value))
        return String(format:"%.0f%% OFF", pct)
    }
    
    func updateSaveRow() {
        var saveRow = self.table.rowControllerAtIndex(RowIds.Save.rawValue) as! DealDetailSaveRow
        let saveText = AmbleContext.sharedInstance.hasSavedDeal(self.deal) ? "UNSAVE DEAL" : "SAVE DEAL"
        saveRow.saveDealLabel.setText(saveText)
    }

    func updateTable() {
        self.table.setRowTypes(["DealDetailHeaderRow", "DealDetailMapRow", "DealDetailActionRow", "DealDetailSaveRow"])
        var headerRow = self.table.rowControllerAtIndex(RowIds.Header.rawValue) as! DealDetailHeaderRow
        headerRow.dealNearYouLabel.setText("DEAL NEAR YOU")
        headerRow.descriptionLabel.setText(self.deal.dealDescription)
        headerRow.valueLabel.setText(String(format: " $%.0f ", self.deal.price))
        if let imageUrl = deal.imageUrl {
            ImageUtils.loadImage(imageUrl, forGroupBackground: headerRow.container)
        }

        var mapRow = self.table.rowControllerAtIndex(RowIds.Map.rawValue) as! DealDetailMapRow
        self.map = mapRow.map
        mapRow.getDirectionsLabel.setText("GET DIRECTIONS")
        
        if let currentLocation = AmbleContext.sharedInstance.currentLocation, dealLocation = deal.coordinates {
            var distance = LocationUtils.distance(currentLocation, to: dealLocation)
            mapRow.distanceLabel.setAttributedText(self.distanceText(distance))
        }
        else {
            mapRow.distanceLabel.setText("--")
        }
        mapRow.merchantLabel.setText(deal.merchant)
        mapRow.addressLabel.setText(deal.address)
        
        var actionRow = self.table.rowControllerAtIndex(RowIds.Action.rawValue) as! DealDetailActionRow
        actionRow.buyDealLabel.setText("BUY DEAL")
        actionRow.valueLabel.setAttributedText(self.priceText(self.deal.price))
        if let expiry = self.deal.expiry {
            actionRow.timeRemainingLabel.setText(self.timeRemaining(expiry))
        }
        else {
            actionRow.timeRemainingLabel.setText("--")
        }
        
        actionRow.discountLabel.setText(self.discountText(self.deal.price, andValue: self.deal.value))
        
        self.updateSaveRow()
    }
    
    func refreshMap() {
        var hasCurrentLocation = false
        var hasPoiLocation = false
        var mapRegionSize :Double = 5000 // metres
        // initialize to invalid location
        var centerCoords : CLLocationCoordinate2D = CLLocationCoordinate2DMake(-37.8, 145)
        if let currentLocation = AmbleContext.sharedInstance.currentLocation {
            hasCurrentLocation = true
            centerCoords = currentLocation
        }
        if let poiLocation = self.deal.coordinates {
            hasPoiLocation = true
            if !hasCurrentLocation {
                centerCoords = poiLocation
            }
            else {
                let poiDistance = LocationUtils.distance(AmbleContext.sharedInstance.currentLocation!, to: poiLocation) * 2.0
                if poiDistance < mapRegionSize {
                    mapRegionSize = poiDistance
                }
                else {
                    centerCoords = poiLocation
                }
            }
        }
        self.map.setRegion(MKCoordinateRegionMakeWithDistance(centerCoords, mapRegionSize, mapRegionSize))
        
        if (hasCurrentLocation) {
            map.addAnnotation(AmbleContext.sharedInstance.currentLocation!, withPinColor: WKInterfaceMapPinColor.Purple)
        }
        if (hasPoiLocation) {
            map.addAnnotation(self.deal.coordinates!, withPinColor: WKInterfaceMapPinColor.Green)
        }
    }
    
    override func table(table: WKInterfaceTable, didSelectRowAtIndex rowIndex: Int) {
        if let rowId = RowIds(rawValue: rowIndex) {
            let context = AmbleContext.sharedInstance
            switch rowId {
            case .Action:
                context.appClient.call(method: "openDeal", withParams: ["_id": self.deal._id], withCompletion: { (response, error) -> Void in
                    println("opened deal " + self.deal._id)
                })
            case .Save:
                if (context.hasSavedDeal(self.deal)) {
                    context.savedDealRemoved(self.deal)
                    context.appClient.call(method: "unsaveDeal", withParams: ["_id": self.deal._id], withCompletion: { (response, error) -> Void in
                        println("unsaved deal " + self.deal._id)
                    })
                }
                else {
                    context.savedDealAdded(self.deal)
                    context.appClient.call(method: "saveDeal", withParams: ["_id": self.deal._id], withCompletion: { (response, error) -> Void in
                        println("saved deal " + self.deal._id)
                    })
                }
                self.updateSaveRow()
            default:
                println("bad row id")
            }
        }
    }
}