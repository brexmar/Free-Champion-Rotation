// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('fcr', ['ionic']);

API_KEY = 'censored';

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('index', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
	.state('champ', {
        url: '/champ/:id',
        templateUrl: 'templates/champ.html',
        controller: 'ChampController'
    });

    $urlRouterProvider.otherwise('/');
});

app.controller('GlobalController', ['$scope', GlobalCtrl]);
app.controller('HomeController', ['$scope', '$http', '$timeout', '$ionicLoading', HomeCtrl]);
app.controller('ChampController', ['$scope', '$ionicNavBarDelegate', '$http', '$stateParams', '$ionicLoading', '$ionicModal', ChampCtrl]);

function GlobalCtrl($scope) {
    $scope.week = null;
}

function HomeCtrl($scope, $http, $timeout, $ionicLoading) {
	// Setup the loader
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 0
	});
	
	// freChamps in scope
	freeChamps = [];
	
	// GET request
    $http({method: 'GET', url: 'https://eune.api.pvp.net/api/lol/eune/v1.2/champion?freeToPlay=true&api_key=' + API_KEY }).
    success(function(data, status, headers, config) {
		// success
		for (i = 0; i < data.champions.length; ++i) {
			$http({method: 'GET', url: 'https://eune.api.pvp.net/api/lol/static-data/eune/v1.2/champion/' + data.champions[i].id + '?api_key=' + API_KEY }).
			success(function(data2, status2, headers2, config2) {
				// success
				freeChamps.push(data2);
			}).
			error(function(data2, status2, headers2, config2) {
				// TODO error
			});
		}
    }).
    error(function(data, status, headers, config) {
		// TODO error
    }).
	then(function() {
		$ionicLoading.hide();
		$scope.freeChamps = freeChamps;
		console.log('done');
	});
	
	$scope.gotoChamp = function (id) {
		console.log(id);
	}
}

function ChampCtrl($scope, $ionicNavBarDelegate, $http, $stateParams, $ionicLoading, $ionicModal) {
	// Setup the loader
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 0
	});
	
	$scope.champ = [];
	
	champId = $stateParams.id;
	$http({method: 'GET', url: 'https://eune.api.pvp.net/api/lol/static-data/eune/v1.2/champion/' + champId + '?champData=all&api_key=' + API_KEY }).
	success(function(data, status, headers, config) {
		// success
		$scope.champ = data;
	}).
	error(function(data, status, headers, config) {
		// TODO error
	}).
	then(function() {
		$ionicLoading.hide();
		console.log('done');
	});
	
	$scope.getKey = function(n) {
		switch(n) {
			case 0:
				return 'Q';
			case 1:
				return 'W';
			case 2:
				return 'E';
			case 3:
				return 'R';
		}
	};
	
	 $scope.goBack = function() {
		 window.history.back();
	 };
	 
	 // Abilities modal
	  $ionicModal.fromTemplateUrl('abilities-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
	  $scope.openModal = function(spell, index) {
		$scope.modal.show();
		$scope.spell = spell;
		$scope.index = index + 2;
	  };
	  $scope.closeModal = function() {
		$scope.modal.hide();
	  };
	  
	// Skins modal
	  $ionicModal.fromTemplateUrl('skins-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal2) {
		$scope.modal2 = modal2;
	  });
	  $scope.openModal2 = function() {
		$scope.modal2.show();
	  };
	  $scope.closeModal2 = function() {
		$scope.modal2.hide();
	  };
	  
	  
	  $scope.openLink = function(link) {
			window.open(link, '_system', 'location=yes');
	  };
}


app.filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });