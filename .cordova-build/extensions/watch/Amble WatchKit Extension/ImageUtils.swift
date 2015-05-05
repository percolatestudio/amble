//
//  ImageUtils.swift
//  Amble
//
//  Created by Tim Hingston on 5/6/15.
//
//

import WatchKit

class ImageUtils: NSObject {
    
    class func loadImage(url:String, forGroupBackground: WKInterfaceGroup) {
        // load image
        let image_url:String = url
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)) {
            let url:NSURL = NSURL(string:image_url)!
            var imageData:NSData = NSData(contentsOfURL: url)!
            
            // update ui
            dispatch_async(dispatch_get_main_queue()) {
                forGroupBackground.setBackgroundImageData(imageData)
            }
        }
    }
    
}
