//
//  PoiDetailViewController.swift
//  Amble
//
//  Created by Tim Hingston on 4/1/15.
//  Copyright (c) 2015 Percolate Studio. All rights reserved.
//

import WatchKit
import Foundation


class PoiDetailViewController: WKInterfaceController {

    @IBOutlet weak var addressLabel: WKInterfaceLabel!
    
    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        
        if let ambleData = context as? AmbleNotificationData {
            if let poiName = ambleData.poiName, let poiAddress = ambleData.poiAddress {
                self.addressLabel.setText(poiName + "\n" + poiAddress)
            }
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

}
