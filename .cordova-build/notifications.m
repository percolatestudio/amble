UIMutableUserNotificationAction *viewAction = [[UIMutableUserNotificationAction alloc] init];
viewAction.identifier = @"view";
viewAction.title = @"Check it out...";
viewAction.activationMode = UIUserNotificationActivationModeForeground;
viewAction.destructive = NO;
viewAction.authenticationRequired = YES; // Ignored with UIUserNotificationActivationModeForeground mode (YES is implied)

UIMutableUserNotificationAction *saveAction = [[UIMutableUserNotificationAction alloc] init];
saveAction.identifier = @"save";
saveAction.title = @"Save";
saveAction.activationMode = UIUserNotificationActivationModeBackground;
saveAction.destructive = NO;
saveAction.authenticationRequired = NO;

UIMutableUserNotificationAction *noThanksAction = [[UIMutableUserNotificationAction alloc] init];
noThanksAction.identifier = @"noThanks";
noThanksAction.title = @"No Thanks";
noThanksAction.activationMode = UIUserNotificationActivationModeBackground;
noThanksAction.destructive = NO;
noThanksAction.authenticationRequired = NO;

UIMutableUserNotificationCategory *actionsCategory = [[UIMutableUserNotificationCategory alloc] init];
actionsCategory.identifier = @"default";
[actionsCategory setActions:@[viewAction, saveAction, noThanksAction] forContext:UIUserNotificationActionContextDefault]; // You may provide up to 4 actions for this context
UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UserNotificationTypes categories:[NSSet setWithObject:actionsCategory]];