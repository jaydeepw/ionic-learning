var FlickrApp = angular.module('ionicApp', ['ionic', 'ngResource', 'ngRoute'])

.factory('Flickr', function($resource, $q) {
  var photosPublic = $resource('http://api.flickr.com/services/feeds/photos_public.gne', 
      { format: 'json', jsoncallback: 'JSON_CALLBACK' }, 
      { 'load': { 'method': 'JSONP' } });
      
  return {
    search: function(query) {
      var q = $q.defer();
      photosPublic.load({
        tags: query
      }, function(resp) {
        q.resolve(resp);
      }, function(err) {
        q.reject(err);
      })
      
      return q.promise;
    }
  }
})

.controller('Ctrl1', function($scope, Flickr) {

  var doSearch = ionic.debounce(function(query) {
    Flickr.search(query).then(function(resp) {
      $scope.photos = resp;
      console.log(resp);
    });
  }, 500);
  
  $scope.search = function() {
    doSearch($scope.query);
  }

})

.controller('Ctrl2', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.phoneId = $routeParams.phoneId;
  }])

.controller('MyCtrl', ['$scope',
  function($scope) {
    $scope.goBack = function() {
      window.history.back();
    };
  }])

.directive('pushSearch', function() {
  /*return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header;

      $element.bind('scroll', function(e) {
        if(!header) {
          header = document.getElementById('search-bar');
        }
        st = e.detail.scrollTop;
        if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, 0px, 0)';
        } else {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
      });
    }
  }*/

  return {};
})

.directive('photo', function($window) {
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      var size = ($window.outerWidth / 3) - 2;
      $element.css('width', size + 'px');
    }
  }
});

FlickrApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/list.html',
        controller: 'Ctrl1'
      }).
      when('/:phoneId', {
        templateUrl: 'partials/details.html',
        controller: 'Ctrl2'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

function MyCtrl($scope, $ionicNavBarDelegate) {
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };
}