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
    var nearbyDeals : [String:Deal]! = [:]
    var savedDeals : [String:Deal]! = [:]
    var notifiedDeals : [String:Deal]! = [:]
    static let sharedInstance = AmbleContext()
    static let maxVisibleDeals = 10
    
    private override init() {
        super.init()
    }
    
    func nearbyDealsChanged(newDeals :[[String:AnyObject]]) -> Bool {
        var newDealCount = 0
        var newDealIds :[String:Int] = [:]
        for dealDict in newDeals {
            let deal = Deal(fromDictionary: dealDict)
            newDealCount += self.nearbyDealAdded(deal)
            newDealIds[deal._id] = 1
        }
        var removedDealIds :[String] = []
        for (oldDealId, oldDeal) in self.nearbyDeals {
            if newDealIds.indexForKey(oldDealId) == nil {
                removedDealIds.append(oldDealId)
            }
        }
        for removedDealId in removedDealIds {
            self.nearbyDeals.removeValueForKey(removedDealId)
        }
        return newDealCount > 0 || removedDealIds.count > 0
    }

    // returns 1 if the deal is not currently
    // in the collection, 0 if it already exists
    func nearbyDealAdded(deal :Deal) -> Int {
        let dealsAdded = self.hasNearbyDeal(deal) ? 0 : 1
        self.nearbyDeals[deal._id] = deal
        return dealsAdded
    }

    func savedDealsChanged(newSavedDeals :[[String:AnyObject]]) -> Bool {
        self.savedDeals.removeAll(keepCapacity: false)
        for dealDict in newSavedDeals {
            let deal = Deal(fromDictionary: dealDict)
            self.savedDealAdded(deal)
        }
        return true
    }
    
    func savedDealAdded(deal :Deal) {
        self.savedDeals[deal._id] = deal
    }
    
    func savedDealRemoved(deal :Deal) {
        self.savedDeals.removeValueForKey(deal._id)
    }
    
    // returns 1 if the deal is not currently
    // in the collection, 0 if it already exists
    func notifiedDealAdded(deal :Deal) -> Int {
        let dealsAdded = (self.hasNotifiedDeal(deal) || self.hasNearbyDeal(deal)) ? 0 : 1
        self.notifiedDeals[deal._id] = deal
        return dealsAdded
    }
    
    func hasNearbyDeal(deal :Deal) -> Bool {
        return self.nearbyDeals.indexForKey(deal._id) != nil
    }
    
    func hasSavedDeal(deal :Deal) -> Bool {
        return self.savedDeals.indexForKey(deal._id) != nil
    }

    func hasNotifiedDeal(deal :Deal) -> Bool {
        return self.notifiedDeals.indexForKey(deal._id) != nil
    }

    var deals : [Deal] {
        get {
            var allDeals = self.nearbyDeals
            for (_id,deal) in self.notifiedDeals {
                allDeals[_id] = deal
            }
            var deals = Array(allDeals.values)
            if self.currentLocation != nil {
                deals.sort {
                    let distance1 = LocationUtils.distance(self.currentLocation!, to: $0.coordinates!)
                    let distance2 = LocationUtils.distance(self.currentLocation!, to: $1.coordinates!)
                    return distance1 < distance2
                }
            }
            var dealCount = min(deals.count, AmbleContext.maxVisibleDeals)
            let visibleDeals = Array(deals[0..<dealCount])
            return visibleDeals
        }
    }
    
    func dealDictionaries() -> [[String:AnyObject]] {
        return self.deals.map { return [$0._id:$0.dictionary] }
    }
}
