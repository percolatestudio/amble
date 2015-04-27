//
//  AmbleNotificationController.swift
//  Amble WatchKit Extension
//
//  Created by Tim Hingston on 3/30/15.
//  Copyright (c) 2015 Percolate Studio. All rights reserved.
//

import WatchKit
import Foundation


class AmbleNotificationController: WKUserNotificationInterfaceController {

    @IBOutlet weak var headerLabel: WKInterfaceLabel!
    @IBOutlet weak var footerLabel: WKInterfaceLabel!
    
    override init() {
        // Initialize variables here.
        super.init()
        
        // Configure interface objects here.
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

    /*
    override func didReceiveLocalNotification(localNotification: UILocalNotification, withCompletion completionHandler: ((WKUserNotificationInterfaceType) -> Void)) {
        // This method is called when a local notification needs to be presented.
        // Implement it if you use a dynamic notification interface.
        // Populate your dynamic notification interface as quickly as possible.
        //
        // After populating your dynamic notification interface call the completion block.
        completionHandler(.Custom)
    }
    */
    
    override func didReceiveRemoteNotification(remoteNotification: [NSObject : AnyObject], withCompletion completionHandler: ((WKUserNotificationInterfaceType) -> Void)) {
        
        var ambleData = AmbleNotificationData(fromNotification: remoteNotification);
        if let poiName = ambleData.poiName {
            let headerText = poiName + " is only steps away..."
            var styledHeaderText = NSMutableAttributedString(string: headerText);
            styledHeaderText.addAttribute(NSFontAttributeName, value: UIFont.preferredFontForTextStyle(UIFontTextStyleHeadline), range: NSRange(location:0, length: poiName.length));
            self.headerLabel.setAttributedText(styledHeaderText);
        }
        if let poiAddress = ambleData.poiAddress {
            self.footerLabel.setText(poiAddress)
        }
        
        completionHandler(.Custom)
    }
}
