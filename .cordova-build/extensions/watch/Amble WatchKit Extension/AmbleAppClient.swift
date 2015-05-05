//
//  AmbleAppClient.swift
//  Amble
//
//  Created by Tim Hingston on 5/5/15.
//
//

import Foundation

struct AppRequest {
    var requestId: String
    var methodName: String
    var params: [String: AnyObject]
    var completionHandler: ((response:AnyObject?, error:NSError?) -> Void)
}

class AmbleAppClient :NSObject {
    
    var requests: [String: AppRequest]
    var wormhole :MMWormhole
    var listeners :Set<String>
    
    
    init(groupId:String) {
        self.requests = [:]
        self.wormhole = MMWormhole(applicationGroupIdentifier: groupId, optionalDirectory: nil)
        self.listeners = Set<String>()
        super.init()
    }
    
    func subscribe(toChannel channel:String, withDataAvailable dataAvailable:((message:[String: AnyObject]!) -> Void)) {
        if (listeners.contains(channel)) {
            return
        }
        listeners.insert(channel)
        if let currentValue = self.wormhole.messageWithIdentifier(channel) as? String {
            if let response = self.parseMessage(currentValue) {
                dataAvailable(message: response)
            }
        }
        self.wormhole.listenForMessageWithIdentifier(channel, listener: { (data) -> Void in
            if let json = data as? String {
                if let response = self.parseMessage(json) {
                    dataAvailable(message: response)
                }
            }
        })
    }
    
    func passMessage(message:AnyObject, withIdentifier identifier:String) {
        var error:NSError? = nil
        if let data = NSJSONSerialization.dataWithJSONObject(message, options:NSJSONWritingOptions(0), error: &error) {
            let json = NSString(data: data, encoding: NSUTF8StringEncoding)
            self.wormhole.passMessageObject(json, identifier: identifier)
        }
        else {
            println(error)
        }
    }
    
    func parseMessage(message:String) -> [String: AnyObject]? {
        if let data = message.dataUsingEncoding(NSUTF8StringEncoding) {
            var error:NSError? = nil
            if let jsonObject = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers, error: &error) as? [String: AnyObject] {
                return jsonObject;
            }
        }
        return nil;
    }
    
    func call(method methodName:String, withParams params:[String: AnyObject], withCompletion completionHandler:((response:AnyObject?, error:NSError?) -> Void)) {
        let requestId :String = NSUUID().UUIDString
        let request = AppRequest(requestId: requestId, methodName: methodName, params: params, completionHandler: completionHandler)
        self.requests[requestId] = request
        let responseQueueName :String = "response." + methodName;
        self.subscribe(toChannel: responseQueueName, withDataAvailable: self.handleResponse)
        
        var error:NSError? = nil
        let message = ["requestId": requestId, "params": params]
        let requestQueueName = "request." + methodName
        self.passMessage(message, withIdentifier: requestQueueName)
    }
    
    func handleResponse(response:[String: AnyObject]!) {
        if let requestId = response["requestId"] as? String {
            let request = self.requests[requestId]
            if request != nil {
                if let error = response["error"] as? String {
                    let err = NSError(domain: error, code: 0, userInfo: nil)
                    request?.completionHandler(response: nil, error: err)
                }
                else if let data : AnyObject? = response["data"] {
                    request?.completionHandler(response: data, error: nil)
                }
                self.requests.removeValueForKey(requestId)
            }
        }
    }
}