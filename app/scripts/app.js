'use strict';

/**
 * @ngdoc overview
 * @name smallcaseApp
 * @description
 * # smallcaseApp
 *
 * Main module of the application.
 */
angular
  .module('smallcaseApp', [
    'ngAnimate',
    'nvd3',
    'ngRoute',
    'ang-drag-drop'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/js', {
        templateUrl: 'views/portfolio.html',
        controller: 'PortfolioCtrl',
        controllerAs: 'portfolio'
      })
      .when('/ui', {
        templateUrl: 'views/ui.html',
        controller: 'UiCtrl',
        controllerAs: 'ui'
      })
      .otherwise({
        redirectTo: '/ui'
      });
  });
