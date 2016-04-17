'use strict'

var app=angular.module("myApp", ["firebase"]);
var bewonerWait = 5; // time in minutes to wait beteween pushes
var quoteScoreWait = 4; // time in secodns to wait between pushes

app.controller("myController", function($scope, $firebaseObject, $firebaseArray) {
    var fb = new Firebase('https://villa65pc.firebaseio.com/');
    var bewonerRef = fb.child("bewoners");
    $scope.bewoners = $firebaseArray(bewonerRef);

    var quoteRef = fb.child("quotes");
    $scope.quotes = $firebaseArray(quoteRef);
    $scope.winner = "";

    bewonerRef.on('value', function(snapshot) {
        var highestScore = 0;
        var bewoners = snapshot.val();
        for (var bewoner in bewoners){
            if (bewoners[bewoner].score > highestScore) {
                highestScore = bewoners[bewoner].score;
                $scope.winner = bewoner;
            }
        };
    })

    $scope.increment = function(bewoner, points) {
        console.log($scope.bewoners.indexOf(Math.max.apply(window,$scope.bewoners.score)));
        var d = new Date();
        var curScore = bewoner.score;
        var lastEdit = bewoner.lastEdit;
        // check if enough time has passed
        var timeDiff = d.getTime() - lastEdit - 1000*60*bewonerWait;
        if (timeDiff > 0 || isNaN(timeDiff)) {
            bewoner.lastEdit = d.getTime();
            bewoner.score = curScore + points;
            $scope.bewoners.$save(bewoner);
        } else {
            timeDiff = Math.round(timeDiff/100/60)/-10;
            alert("You need to wait " + timeDiff + " min before awarding another point");
        }
    };

    $scope.submitQuote = function() {
        if ($scope.villaQuote) {
            $scope.quotes.$add({
                text: $scope.villaQuote,
                score: 0,
                timeStamp: Firebase.ServerValue.TIMESTAMP,
                lastKuddo: 0
            });
            $scope.villaQuote = '';
        }
    };

    $scope.kuddoQuote = function(quote){
        var d = new Date();
        var timeDiff = d.getTime() - quote.lastKuddo - 1000*quoteScoreWait;
        if(timeDiff > 0 || isNaN(timeDiff)) {
            quote.score = quote.score + 1;
            quote.lastKuddo = d.getTime();
            $scope.quotes.$save(quote);
            console.log(timeDiff);
        } else {
            timeDiff = Math.round(timeDiff/100)/-10;
            alert("You need to wait " + timeDiff + " seconds before awarding another point");
        }
    }

    $scope.predicate = 'score';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
});