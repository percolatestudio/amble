//
//  AmbleAppViewController.swift
//  Amble
//
//  Created by Tim Hingston on 5/6/15.
//
//

import WatchKit
import Foundation


class AmbleAppViewController: WKInterfaceController {

    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        
        var ambleContext = AmbleContext.sharedInstance
        ambleContext.appClient = self.initializeAppClient(ambleContext)
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    func resetDealPages() {
        let deals = AmbleContext.sharedInstance.deals
        let controllers = Array(count: deals.count, repeatedValue: "DealBrief")
        WKInterfaceController.reloadRootControllersWithNames(controllers, contexts: deals)
    }
    
    func initializeAppClient(context:AmbleContext) -> AmbleAppClient {
        var appClient = AmbleAppClient(groupId: "group.com.percolatestudio.amble")
        let locChannel :String = "location"
        appClient.subscribe(toChannel: locChannel, withDataAvailable: { (message) -> Void in
            if let coordinates = message["coordinates"] as? Array<CLLocationDegrees> {
                context.currentLocation = CLLocationCoordinate2D(latitude: coordinates[1], longitude: coordinates[0])
            }
        })
        
        appClient.subscribe(toChannel: "nearbyDeals", withDataAvailable: { (message) -> Void in
            if let deals = message["deals"] as? [[String:AnyObject]] {
                var needsRefresh = AmbleContext.sharedInstance.nearbyDealsChanged(deals)
                if (needsRefresh) {
                    self.resetDealPages()
                }
            }
        })
        
        appClient.subscribe(toChannel: "savedDeals", withDataAvailable: { (message) -> Void in
            if let deals = message["deals"] as? [[String:AnyObject]] {
                AmbleContext.sharedInstance.savedDealsChanged(deals)
            }
        })

        return appClient;
    }
    
    override func handleActionWithIdentifier(identifier: String?, forRemoteNotification remoteNotification: [NSObject : AnyObject]) {
        if let dealDict = Deal.unwrapFromNotification(remoteNotification) {
            let context = AmbleContext.sharedInstance
            let deal = Deal(fromDictionary: dealDict)
            if (context.notifiedDealAdded(deal) > 0) {
                self.resetDealPages()
            }

            switch identifier! {
                case "save":
                    AmbleContext.sharedInstance.appClient.call(method: "saveDeal", withParams: ["_id": deal._id], withCompletion: { (response, error) -> Void in
                        println("saved deal " + deal._id)
                    })
                default:
                    println("default notification received for dealId " + deal._id)
            }
        }
    }
}
