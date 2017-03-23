angular
    .module("messagingApp")
    .controller("homeCtrl", homeCtrl);
homeCtrl.$inject = ['$scope', '$localStorage'];
function homeCtrl($scope, $localStorage) {

    $scope.conversation = [];
    $scope.identity = {};
    $scope.messages = '';

    $localStorage.latitude = 0.0;
    $localStorage.longitude = 0.0;

    liveQuery();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(result){
            $localStorage.latitude = result.coords.latitude;
            $localStorage.longitude = result.coords.longitude;
            console.log($localStorage.latitude,$localStorage.longitude )
            if(!angular.isDefined($localStorage.identityId)){
                if(!angular.isDefined($localStorage.latitude) &&
                    !angular.isDefined($localStorage.longitude)){
                    setIdentity()
                } else {
                    setIdentity()
                }
            }
        }, function(error){
            console.log(error)
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    var Conversation = Parse.Object.extend('Conversation');
    var query = new Parse.Query(Conversation);
    query.descending('createdAt');
    query.find({
        success: function(results) {
            for(var i in results){
                var result = results [i].attributes;
                if (result.identityId.id == $localStorage.identityId){
                    console.log(result.messages);
                    $scope.conversation.push({
                        message:result.messages,
                        elementClass: 'oval-thought-border'
                    })
                } else {
                    console.log(result.messages);
                    $scope.conversation.push({
                        message:result.messages,
                        elementClass: 'rectangle-speech-border'
                    })
                }
            }
            $scope.$apply();
        },
        error: function(error) {
            console.log(error)
        }
    });

    $scope.send = function () {
        var Conversation = Parse.Object.extend("Conversation");
        var conversation = new Conversation();

        var identity = new Parse.Object("Identity");
        identity.id = $localStorage.identityId;

        var point = new Parse.GeoPoint({latitude: $localStorage.latitude, longitude: $localStorage.longitude});
        conversation.set("messages", $scope.messages);
        conversation.set("geolocation", point);
        conversation.set("identityId", identity);

        conversation.save({
            success: function(result) {
                console.log(result)
            },
            error: function(error) {
                console.log(error)
            }
        });
    };

    function setIdentity(){
        var Identity = Parse.Object.extend("Identity");
        var identity = new Identity();
        var point = new Parse.GeoPoint({latitude: $localStorage.latitude, longitude: $localStorage.longitude});
        identity.set("geolocation", point);
        identity.save({
            success: function(result) {
                $localStorage.identityId = result.id;
            },
            error: function(error) {
                console.log(error)
            }
        });
    }

    function liveQuery() {
        var liveQuery = new Parse.Query('Conversation');
        var Conversation = liveQuery.subscribe();
        Conversation.on('create', function(result){
            // console.log(.identityId.id);
            var result2 = result.attributes;
            if (result2.identityId.id == $localStorage.identityId){
                console.log(result2.messages);
                $scope.conversation.push({
                    message:result2.messages,
                    elementClass: 'oval-thought-border'
                })
            } else {
                console.log(result2.messages);
                $scope.conversation.push({
                    message:result2.messages,
                    elementClass: 'rectangle-speech-border'
                })
            }
            $scope.$apply();
        });
    }
}
