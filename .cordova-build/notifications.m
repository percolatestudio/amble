        UIMutableUserNotificationAction *viewAction = [[UIMutableUserNotificationAction alloc] init];
        viewAction.identifier = @"view";
        viewAction.title = @"Get Deal";
        viewAction.activationMode = UIUserNotificationActivationModeForeground;
        viewAction.destructive = NO;
        viewAction.authenticationRequired = YES; // Ignored with UIUserNotificationActivationModeForeground mode (YES is implied)
        
        UIMutableUserNotificationAction *saveAction = [[UIMutableUserNotificationAction alloc] init];
        saveAction.identifier = @"save";
        saveAction.title = @"Save";
        saveAction.activationMode = UIUserNotificationActivationModeBackground;
        saveAction.destructive = NO;
        saveAction.authenticationRequired = NO;
        
        UIMutableUserNotificationCategory *actionsCategory = [[UIMutableUserNotificationCategory alloc] init];
        actionsCategory.identifier = @"default";
        [actionsCategory setActions:@[viewAction, saveAction] forContext:UIUserNotificationActionContextDefault]; // You may provide up to 4 actions for this context
        
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UserNotificationTypes categories:[NSSet setWithObject:actionsCategory]];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
        [[UIApplication sharedApplication] registerForRemoteNotifications];
