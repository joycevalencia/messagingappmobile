angular
    .module("messagingApp", ['ui.router', 'ngStorage'])
    .run(appRun);
appRun.$inject = ['$rootScope'];
function appRun($rootScope){
    var currentLocation = window.location.href;

    Parse.initialize(
        "myAppId",
        "myjavascriptKey"
    );
    Parse.serverURL = 'http://localhost:1337/parse';

    /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        var currentUser = parseService.getCurrentUser();
        var targetState = toState.name;

        if (!currentUser){
            if (targetState == 'login' || targetState == 'signup-client'  || targetState == 'home'
                || targetState == 'signup-provider' || targetState == 'completion-client' || targetState == 'completion-provider') {
                return;
            } else {
                console.log('UNAUTHORIZED ACCESS')
                event.preventDefault();
                $state.transitionTo('login');
            }
        } else {

            if (targetState == 'completion-client' || targetState == 'completion-provider') {
                if (currentUser.get('isSignupComplete')) {

                    if (currentUser.get('type') == 'CLIENT') {
                        console.log('USER COMPLETED SIGNING UP. REDIRECTING TO CLIENT HOMEPAGE...')
                        event.preventDefault();
                        $state.transitionTo('client-home');
                    } else if (currentUser.get('type') == 'PROVIDER') {
                        console.log('USER COMPLETED SIGNING UP. REDIRECTING TO SERVICE PROVIDER HOMEPAGE...')
                        event.preventDefault();
                        var userPointer = {__type: "Pointer", className: "_User", objectId: currentUser.id};
                        var Provider = Parse.Object.extend("Provider");
                        var query = new Parse.Query(Provider);
                        query.equalTo('userId',userPointer);
                        query.find({
                            success:function(results){
                                $localStorage.providerId = results[0].id;
                                $localStorage.providerServiceType = results[0].get('serviceType');
                                $localStorage.providerType = results[0].get('type');
                                $localStorage.rating = results[0].get('rating');
                                $localStorage.transaction = results[0].get('transaction');
                                $localStorage.location = results[0].get('location');
                                if(results[0].get('type') == 'COMPANY'){
                                    $state.transitionTo('providerCompany-home');
                                }else{
                                    $state.transitionTo('provider-home');
                                }
                            },
                            error:function(error){

                            }
                        })
                    } else {
                        console.log('UNAUTHORIZED LOGIN. REDIRECTING TO LOGIN PAGE...')
                        Parse.User.logOut().then(function() {
                            event.preventDefault();
                            $state.transitionTo('login');
                        });
                    }

                } else {
                    return;
                }
            } else if (targetState == 'login' || targetState == 'signup-client' || targetState == 'signup-provider') {
                if (currentUser.get('isSignupComplete')) {

                    if (currentUser.get('type') == 'CLIENT') {
                        console.log('USER IS LOGGED IN. REDIRECTING TO CLIENT HOMEPAGE...')
                        event.preventDefault();
                        $state.transitionTo('client-home');
                    } else if (currentUser.get('type') == 'PROVIDER') {
                        console.log('USER IS LOGGED IN. REDIRECTING TO SERVICE PROVIDER HOMEPAGE...')
                        event.preventDefault();
                        var userPointer = {__type: "Pointer", className: "_User", objectId: currentUser.id};
                        var Provider = Parse.Object.extend("Provider");
                        var query = new Parse.Query(Provider);
                        query.equalTo('userId',userPointer);
                        query.find({
                            success:function(results){
                                $localStorage.providerId = results[0].id;
                                $localStorage.providerServiceType = results[0].get('serviceType');
                                $localStorage.providerType = results[0].get('type');
                                $localStorage.rating = results[0].get('rating');
                                $localStorage.transaction = results[0].get('transaction');
                                $localStorage.location = results[0].get('location');
                                if(results[0].get('type') == 'COMPANY'){
                                    $state.transitionTo('providerCompany-home');
                                }else{
                                    $state.transitionTo('provider-home');
                                }
                            },
                            error:function(error){

                            }
                        })
                    } else {
                        console.log('UNAUTHORIZED LOGIN. REDIRECTING TO LOGIN PAGE...')
                        Parse.User.logOut().then(function() {
                            event.preventDefault();
                            $state.transitionTo('login');
                        });
                    }

                } else {

                    if (currentUser.get('type') == 'CLIENT') {
                        console.log('USER DOES NOT COMPLETED SIGNING UP. REDIRECTING TO CLIENT COMPLETION...')
                        event.preventDefault();
                        $state.transitionTo('completion-client');
                    } else if (currentUser.get('type') == 'PROVIDER') {
                        console.log('USER DOES NOT COMPLETED SIGNING UP. REDIRECTING TO PROVIDER COMPLETION...')
                        event.preventDefault();
                        $state.transitionTo('completion-provider');
                    } else {
                        console.log('UNAUTHORIZED LOGIN. REDIRECTING TO LOGIN PAGE...')
                        Parse.User.logOut().then(function() {
                            event.preventDefault();
                            $state.transitionTo('login');
                        });
                    }

                }
            } else {
                if (currentUser.get('isSignupComplete')) {

                    if (targetState.indexOf('client-') > -1) {
                        if (currentUser.get('type') == 'CLIENT') {
                            return;
                        } else if (currentUser.get('type') == 'PROVIDER') {
                            console.log('UNAUTHORIZED PAGE ACCESS. REDIRECTING TO PROVIDER HOMEPAGE...')
                            event.preventDefault();
                            $state.transitionTo('provider-home');
                        } else {
                            console.log('UNAUTHORIZED LOGIN. REDIRECTING TO LOGIN PAGE...')
                            return;
                        }
                    } else if (targetState.indexOf('provider-') > -1) {
                        if (currentUser.get('type') == 'CLIENT') {
                            console.log('UNAUTHORIZED PAGE ACCESS. REDIRECTING TO CLIENT HOMEPAGE...')
                            event.preventDefault();
                            $state.transitionTo('client-home');
                        } else if (currentUser.get('type') == 'PROVIDER') {
                            return;
                        } else {
                            console.log('UNAUTHORIZED LOGIN. REDIRECTING TO LOGIN PAGE...')
                            return;
                        }
                    }

                } else {

                    if (currentUser.get('type') == 'CLIENT') {
                        console.log('USER DOES NOT COMPLETED SIGNING UP. REDIRECTING TO CLIENT COMPLETION...')
                        event.preventDefault();
                        $state.transitionTo('completion-client');
                    } else if (currentUser.get('type') == 'PROVIDER') {
                        console.log('USER DOES NOT COMPLETED SIGNING UP. REDIRECTING TO PROVIDER COMPLETION...')
                        event.preventDefault();
                        $state.transitionTo('completion-provider');
                    } else {
                        console.log('UNAUTHORIZED LOGIN. REDIRECTING TO LOGIN PAGE...')
                        Parse.User.logOut().then(function() {
                            event.preventDefault();
                            $state.transitionTo('login');
                        });
                    }

                }
            }

        }
    });

    $rootScope.$on('$stateChangeSuccess', function(){
        $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
    });*/


}
