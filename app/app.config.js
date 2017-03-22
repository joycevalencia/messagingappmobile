angular
    .module('messagingApp')
    .config(configure);

configure.$inject = ['$stateProvider', '$urlRouterProvider'];
function configure ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'app/components/view/home.html',
            controller: 'homeCtrl'
        });
    $urlRouterProvider.otherwise("/home");
}
