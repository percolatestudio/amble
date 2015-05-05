//
//  DealBriefViewController.swift
//  Amble
//
//  Created by Tim Hingston on 5/5/15.
//
//

import WatchKit
import Foundation


class DealBriefViewController: WKInterfaceController {

    @IBOutlet weak var table: WKInterfaceTable!
    @IBOutlet weak var container: WKInterfaceGroup!
    var deal: Deal!
    
    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        self.deal = context as! Deal
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
        self.updateTable()
        if let imageUrl = deal.imageUrl {
            ImageUtils.loadImage(imageUrl, forGroupBackground: self.container)
        }

    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

    func updateTable() {
        self.table.setNumberOfRows(1, withRowType: "DealBriefRow")
        var row = self.table.rowControllerAtIndex(0) as! DealBriefRow
        row.descriptionLabel.setText(self.deal.dealDescription)
        row.valueLabel.setText(String(format: " $%.0f ", self.deal.price))
    }
    
    override func table(table: WKInterfaceTable, didSelectRowAtIndex rowIndex: Int) {
        self.presentControllerWithName("DealDetail", context: self.deal)
    }
    
}
