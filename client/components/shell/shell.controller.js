'use strict';

angular.module('phleepApp')
    .controller('ShellCtrl', function($mdSidenav, $mdDialog, $mdColorPalette, $scope, $rootScope, $location, Auth) {

        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $rootScope.selectedGame = "OW";

        $scope.owChosen = true;
        $scope.lolChosen = false;

        $scope.logout = function() {
            Auth.logout();
            $location.path('/login');
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        var originatorEv;
        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.notificationsEnabled = true;
        $scope.toggleNotifications = function() {
            $scope.notificationsEnabled = !$scope.notificationsEnabled;
        };

        $scope.switchToOW = function() {
            $rootScope.selectedGame = "OW";
            $scope.lolChosen = false;
            $scope.owChosen = true;
        }

        $scope.switchToLOL = function() {
            $rootScope.selectedGame = "LOL";
            $scope.lolChosen = true;
            $scope.owChosen = false;
        }
    });
