//
//  AmbleContext.swift
//  Amble
//
//  Created by Tim Hingston on 5/6/15.
//
//

import WatchKit
import Foundation

class AmbleContext: NSObject {
    var appClient : AmbleAppClient!
    var currentLocation : CLLocationCoordinate2D?
    var deals : Array<Deal>! = []
    
    static let sharedInstance = AmbleContext()
    
    private override init() {
        super.init()
    }
    
    // returns true if the deal is not currently
    // in the collection
    func addDeal(deal :Deal) -> Bool {
        var dealIndex = -1
        var isNew = true
        for (index,obj) in enumerate(self.deals) {
            let existingDeal = obj as Deal
            if existingDeal._id == deal._id {
                dealIndex = index
                isNew = false
                break;
            }
        }
        if isNew {
            self.deals.insert(deal, atIndex: 0)
        }
        else {
            self.deals[dealIndex] = deal
        }
        return isNew
    }
}
