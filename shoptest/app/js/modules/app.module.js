var app = angular.module("shop-with-me", ["ui.router", "ngNotify", "pubnub.angular.service", "ngStamplay", "ngSanitize"])

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state("Home", {
        url : '/',
        templateUrl : "../../views/home.html",
        controller: "HomeController",
        resolve : {
          loggedin : function(User) {
            return User.current();
          }
        }
    })
    .state("Account", {
        url : '/account/:tab?list',
        templateUrl : "../../views/account.html",
        controller : "AccountController",
    })
    .state("List", {
      url : "/list/:slug",
      templateUrl : '../../views/list.html',
      controller : "ListController",
      resolve : {
        loggedin : function(User) {
          return User.current();
        },
        list : function(List, $stateParams) {
          return List.getList($stateParams.slug);
        },
        items : function(Item, $stateParams) {
          return Item.getListItems($stateParams.slug);
        }
      }
    })

  $urlRouterProvider.otherwise("/");

  $locationProvider.html5Mode(true);

})

app.run(function(Pubnub, User, $rootScope, ngNotify) {

  Stamplay.init("dynamictodo");

  Pubnub.init({
    publish_key : "pub-c-1ae487a3-2c0b-4805-8b75-61073826ec94",
    subscribe_key : "sub-c-467f5968-dd3f-11e6-b6b1-02ee2ddab7fe",
    ssl : (('https:' === window.location.protocol) ? true : false)
  })

  User.current()
    .then(
      function(response) {
        $rootScope.user = response.user;
      }
    )

  //  New
  ngNotify.config({
    duration: 3000,
    type: 'info',
    html: true
  });

})
