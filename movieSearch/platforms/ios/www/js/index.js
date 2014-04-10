// You may need to change the API key in case this demo app does not work
// in future.
// You can get it here.  http://developer.rottentomatoes.com/

// test key
// var API_KEY = "f8b9qaux45g3ptwezzrrf2hg";

// remove this later
var API_KEY = "7ect2zrb24k3fpa2bttzswqn";

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

.controller('Ctrl1', ['$scope', '$routeParams', '$http',  '$ionicPopup',
  function($scope, $routeParams, $http,  $ionicPopup) {
    $scope.phoneId = $routeParams.phoneId;

    $scope.search = function () {
      console.log($scope.query);

      if($scope.query != '')
        searchMovie($scope.query, $scope, $http, $ionicPopup);
    }
  }])

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

function searchMovie(moviename, $scope, $http, $ionicPopup) {
  var APIUrl = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=" + API_KEY + "&q=" + moviename + "&callback=JSON_CALLBACK";

  $http({method: 'JSONP', url: APIUrl})
    .success(function(data, status, headers, config) {

        var movieResult = data;
        // this callback will be called asynchronously
        // when the response is available
        // console.log('Success ');
        // console.log(movieResult);
        var totalResults = movieResult.movies.length;
        // console.log("total: " + totalResults);

        // if movies are found.
        // Update the UI.
        if( totalResults > 0 ) {
          $scope.movie_results = "Found " + totalResults + " movies";
          $scope.moviesList = movieResult;
          console.log(movieResult.movies[0]);
        } else {
          $scope.movie_results = "No results found!";
          $scope.moviesList = [];

          $ionicPopup.alert({
            title: 'No results found!',
            content: ''
          }).then(function(res) {
            console.log('No results found');
          });
        }
      })
    .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log('Error ' + status);

        $ionicPopup.alert({
          title: 'Something went wrong!',
          content: status
        }).then(function(res) {
          console.log('Do something on ok.');
        });
      });
}