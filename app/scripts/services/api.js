'use strict';

/**
 * @ngdoc service
 * @name smallcaseApp.api
 * @description
 * # api
 * Factory in the smallcaseApp.
 */
angular.module('smallcaseApp')
  .factory('api', function ($http, $q){



    // Public API here
    return {
      getData: function (){
        var deferred = $q.defer();
        $http.get('/data.json')
          .then(function (res){
            deferred.resolve(res);
          }, function (res){
            deferred.reject(res);
          });
        return deferred.promise;
      }
    };
  });
