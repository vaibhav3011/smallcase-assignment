'use strict';

/**
 * @ngdoc function
 * @name smallcaseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the smallcaseApp
 */
angular.module('smallcaseApp')
  .controller('PortfolioCtrl', function (api, $scope, $filter) {

    //Initializing graph
    $scope.init_graph = function(){
      $scope.worth_date = [];
      $scope.options = {
        chart: {
          type: 'lineChart',
          height: 300,
          x: function(d){
            return new Date(d.x);
          },
          y: function(d){return Math.round(d.y*100)/100; },
          dispatch: {
            stateChange: function(e){ console.log("stateChange"); },
            changeState: function(e){ console.log("changeState"); },
            tooltipShow: function(e){ console.log("tooltipShow"); },
            tooltipHide: function(e){ console.log("tooltipHide"); }
          },
          xAxis: {
            axisLabel: 'Time',
            tickFormat: function(d){
              return new Date(d).getDate()+'/'+(new Date(d).getMonth()+1)+'/'+new Date(d).getFullYear();
            }
          },
          yAxis: {
            axisLabel: 'Net Worth'
          },
          callback: function(chart){
            console.log("!!! lineChart callback !!!");
          }
        },
        title: {
          enable: true,
          text: 'Net Worth vs Time'
        }
      };

      _.forEach($scope.data.dates, function(date){
        $scope.worth_date.push({
          x : date,
          y : 0
        });
      });

      $scope.graph_data = [
        {
          values: $scope.worth_date,      //values - represents the array of {x,y} data points
          key: 'Worth - TIme graph', //key  - the name of the series.
          color: '#ff8b00',  //color - optional: choose your own line color.
          strokeWidth: 1,
          classed: 'line'
        }
      ];
    };

    $scope.net_worth = 0;
    $scope.price_to_earnings = 0;
    $scope.total_earnings = 0;
    $scope.selectedStocks = [];

    //Compute net worth
    $scope.compute_worth = function(){
      $scope.net_worth = 0;
      _.map($scope.selectedStocks, function(stock){
        $scope.net_worth += ($scope.data.price[stock.name]*stock.count);
      });
      return $scope.net_worth;
    };

    //Add and remove stock
    /*
    While adding/removing a stock, this function update, net worth and total earnings, compute p/e ration
    and also update the graph according to the stock added/removed
     */
    $scope.add_stock = function(stock){
      if($scope.data.stocks.indexOf(stock)>=0){
        $scope.selectedStocks.push({name : stock, count : 1});
        $scope.data.stocks.splice($scope.data.stocks.indexOf(stock), 1);
        $scope.net_worth += ($scope.data.price[stock]*1);
        $scope.total_earnings += $scope.data.eps[stock];
        $scope.compute_price_earning();

        for(var i=0;i<$scope.worth_date.length;i++){
          $scope.worth_date[i].y += $scope.data.historical[stock].point[i].price;
        }
      }
    };

    $scope.remove_stock = function(stock) {
      $scope.selectedStocks = _.filter($scope.selectedStocks, function (obj) {
        if (obj.name === stock.name) {
          $scope.data.stocks.push(stock.name);
          var worth = $scope.data.price[stock.name] * stock.count;
          var earn = $scope.data.eps[stock.name] * stock.count;
          $scope.net_worth = ($scope.net_worth > worth) ? ($scope.net_worth - worth) : 0;
          $scope.total_earnings = ($scope.total_earnings > earn) ? ($scope.total_earnings - earn) : 0;
          $scope.compute_price_earning();
          for(var i=0;i<$scope.worth_date.length;i++){
            var temp = $scope.data.historical[stock.name].point[i].price*stock.count;
            $scope.worth_date[i].y = Math.max(0, $scope.worth_date[i].y-temp);
          }
          return false;
        }
        return true;
      });
    };

    //Weight of a perticular stock
    $scope.compute_weight = function(stock){
      var weight = ($scope.data.price[stock.name]*stock.count*100)/$scope.net_worth;
      return weight;
    };

    //Compute total price earning for p/e ration
    $scope.compute_earnings = function(){
      $scope.total_earnings = 0;
      _.map($scope.selectedStocks, function(stock){
        $scope.total_earnings += ($scope.data.eps[stock.name]*stock.count);
      });
      return $scope.net_worth;
    };

    // Compute total p/e ratio
    $scope.compute_price_earning = function(){
      if(!$scope.net_worth || !$scope.total_earnings){
        $scope.net_worth = 0;
        $scope.total_earnings = 0;
        $scope.price_to_earnings = 0;
        return $scope.price_to_earnings;
      }
      else {
        $scope.price_to_earnings = $scope.net_worth / $scope.total_earnings;
        return $scope.price_to_earnings;
      }
    };

    //Update count - it can only be changed min to 1 using up-down arrow
    $scope.change_stock_count = function(stock){

      $scope.compute_worth();
      $scope.compute_earnings();
      $scope.compute_price_earning();

      for(var i=0;i<$scope.worth_date.length;i++){
        $scope.worth_date[i].y += $scope.data.historical[stock.name].point[i].price;
      }
    };

    // Drag and drop
    $scope.onDrop = function(event, data){
      if(data && typeof data==='string') {
        $scope.add_stock(data);
      }
    };

    $scope.onDropBack = function(event, data){
      if(data && _.isObject(data)){
        $scope.remove_stock(data);
      }
    };

    api.getData().then(function(data){
      console.log(data);
      if(data){
        $scope.data = data.data;
        $scope.data.stocks = _.keys($scope.data.price);

        //Picking dates from only one stock assuming that dates historical data for all stocks is same and also in increasing order of date
        $scope.data.dates = _.pluck($scope.data.historical.KALE.point,'date');
      }
      $scope.init_graph();
    }, function(err){
      //Log error
      console.log("error : " + err);
    });

  });
