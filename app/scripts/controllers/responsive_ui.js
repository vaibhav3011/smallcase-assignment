'use strict';

/**
 * @ngdoc function
 * @name smallcaseApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the smallcaseApp
 */
angular.module('smallcaseApp')
  .controller('UiCtrl', function ($scope) {
    $scope.open_menu = function(){
      $scope.display_menu = !$scope.display_menu;
      if($scope.display_menu){
        document.getElementById('content').style.display = 'none';
      }
      else{
        document.getElementById('content').style.display = 'block';
      }
    };

    $scope.active_index = 1;
    $scope.select_tab = function(index){
      document.getElementById('tab'+$scope.active_index).classList.remove('bg-red',  'fg-white');
      document.getElementById('mtab'+$scope.active_index).classList.remove('bg-red',  'fg-white');
      document.getElementById('tab'+index).classList.add('bg-red',  'fg-white');
      document.getElementById('mtab'+index).classList.add('bg-red',  'fg-white');

      $scope.active_index = index;
    }
  });
