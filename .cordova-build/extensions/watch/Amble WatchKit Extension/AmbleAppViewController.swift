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
    
    func dealsRefreshed() {
        let deals = AmbleContext.sharedInstance.deals
        var dealCount = min(deals.count, 10)
        let visibleDeals = Array(deals[0..<dealCount])
        let controllers = Array(count: visibleDeals.count, repeatedValue: "DealBrief")
        WKInterfaceController.reloadRootControllersWithNames(controllers, contexts: visibleDeals)
    }
    
    func initializeAppClient(context:AmbleContext) -> AmbleAppClient {
        var appClient = AmbleAppClient(groupId: "group.com.percolatestudio.amble")
        let locChannel :String = "location"
        appClient.subscribe(toChannel: locChannel, withDataAvailable: { (message) -> Void in
            if let coordinates = message["coordinates"] as? Array<CLLocationDegrees> {
                context.currentLocation = CLLocationCoordinate2D(latitude: coordinates[1], longitude: coordinates[0])
            }
        })
        
        appClient.subscribe(toChannel: "deals", withDataAvailable: { (message) -> Void in
            if let deals = message["deals"] as? [[String:AnyObject]] {
                for dealDict in deals {
                    let deal = Deal(fromDictionary: dealDict)
                    context.addDeal(deal)
                }
                self.dealsRefreshed()
            }
        })
        return appClient;
    }
    
    override func handleActionWithIdentifier(identifier: String?, forRemoteNotification remoteNotification: [NSObject : AnyObject]) {
        if let dealDict = Deal.unwrapFromNotification(remoteNotification) {
            var context = AmbleContext.sharedInstance
            context.appClient.passMessage(["deals": [dealDict]], withIdentifier: "deals")
        }
    }
}
