angular
    .module("messagingApp")
    .controller("homeCtrl", homeCtrl);
homeCtrl.$inject = ['$scope', '$localStorage'];
function homeCtrl($scope, $localStorage) {

    console.log('hello nothing');

    $scope.identity = {};
    $scope.messages = '';

    $localStorage.latitude = 0.0;
    $localStorage.longitude = 0.0;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(result){
            $localStorage.latitude = result.coords.latitude;
            $localStorage.longitude = result.coords.longitude;
        }, function(error){
            console.log(error)
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    if(angular.isDefined($localStorage.identityId)){

    } else {
        if(!angular.isDefined($localStorage.latitude) &&
            !angular.isDefined($localStorage.longitude)){
            setIdentity()
        }
    }

    /*var Identity = Parse.Object.extend('Identity');
    var query = new Parse.Query(Identity);
    query.find({
        success: function(results) {
            $scope.identity = results[0].attributes;
            console.log('inside async: ',$scope.identity);
        },
        error: function(error) {
            console.log(error)
        }
    });*/

    $scope.send = function () {
        console.log($scope.messages);
        var Conversation = Parse.Object.extend("Conversation");
        var conversation = new Conversation();

        var point = new Parse.GeoPoint({latitude: $localStorage.latitude, longitude: $localStorage.longitude});
        conversation.set("messages", $scope.messages);
        conversation.set("geolocation", point);

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

    console.log($localStorage.latitude, $localStorage.longitude);
    console.log('outside async: ', $scope.identity)

}
