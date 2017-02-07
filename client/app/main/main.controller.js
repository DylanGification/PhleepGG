'use strict';

angular.module('phleepApp')
    .controller('MainCtrl', function($scope, $http, socket) {
        $scope.awesomeThings = [];

        $http.get('/api/things').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.deleteThing = function(thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });


        var apiURL = "http://localhost:9000/";

        $scope.data = {
            myPlatformSelect: "pc",
            myRegionSelect: "eu",
            myHeroSelect: "Ana",
            oppPlatformSelect: "pc",
            oppRegionSelect: "eu",
            oppHeroSelect: "ana"
        };

        //My details
        var myDetails = [];
        var allMyHeroesQP = [];
        var allMyHeroesComp = [];
        var myHeroQP = [];
        var myHeroComp = [];
        var myPlayedHeroesQP = [];
        var myPlayedHeroesComp = [];
        var myAchievements = [];

        //Opponent details
        var oppDetails = [];
        var allOppHeroesQP = [];
        var allOppHeroesComp = [];
        var oppHeroQP = [];
        var oppHeroComp = [];
        var oppPlayedHeroesQP = [];
        var oppPlayedHeroesComp = [];
        var oppAchievements = [];

        var myCall = false;
        var oppCall = false;
        var comparison = false;
        $scope.comparison = comparison;

        //---------------------------------------------------------------------------------------------------------------------------
        //MY DETAILS

        $scope.getMyData = function() {
            var myUserInput = $scope.myUserInput;
            var myUserName = myUserInput.replace("#", "-");
            var myPlatform = $scope.data.myPlatformSelect;
            var myRegion = $scope.data.myRegionSelect;

            //get basic profile data
            $http({
                method: 'GET',
                url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/profile"
            }).then(function successCallback(response) {
                myDetails = response.data;
                getMyDetails(myDetails);
            }, function errorCallback(response) { alert(response.error); });

            //get all heroes data from quick play
            $http({
                method: 'GET',
                url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/quickplay/allHeroes/"
            }).then(function successCallback(response) {
                allMyHeroesQP = response.data;
                getAllMyHeroesQP(allMyHeroesQP);
            }, function errorCallback(response) { alert(response); });

            //get all heroes data from competitive play
            $http({
                method: 'GET',
                url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/competitive/allHeroes/"
            }).then(function successCallback(response) {
                allMyHeroesComp = response.data;
                getAllMyHeroesComp(allMyHeroesComp);
            }, function errorCallback(response) { alert(response); });

            //get a singular hero's data from quick play
            // $http({
            //     method: 'GET',
            //     url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/quick-play/hero/" + hero + "/"
            // }).then(function successCallback(response) {
            //     myHeroQP = response.data;
            //     getMyHeroQP(myHeroQP);
            // }, function errorCallback(response) { alert(response); });

            //get a singular hero's data from competitive play
            // $http({
            //     method: 'GET',
            //     url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/competitive-play/hero/" + hero "/"
            // }).then(function successCallback(response) {
            //     myHeroComp = response.data;
            //     getMyHeroComp(myHeroComp);
            // }, function errorCallback(response) { alert(response); });

            //get list of most played heroes in quick play
            $http({
                method: 'GET',
                url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/quickplay/heroes"
            }).then(function successCallback(response) {
                myPlayedHeroesQP = response.data;
                getMyPlayedHeroesQP(myPlayedHeroesQP);
            }, function errorCallback(response) { alert(response); });

            //get list of most played heroes in competitive play
            $http({
                method: 'GET',
                url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/competitive/heroes"
            }).then(function successCallback(response) {
                myPlayedHeroesComp = response.data;
                getMyPlayedHeroesComp(myPlayedHeroesComp);
            }, function errorCallback(response) { alert(response); });

            //get list of my achievements
            $http({
                method: 'GET',
                url: apiURL + myPlatform + "/" + myRegion + "/" + myUserName + "/achievements"
            }).then(function successCallback(response) {
                myAchievements = response.data;
                getMyAchievements(myAchievements);
            }, function errorCallback(response) { alert(response); });
        }

        function getMyDetails(myDetails) {
            $scope.myAvatar = myDetails.data.avatar;
            $scope.myRankIcon = myDetails.data.competitive.rank_img;
            $scope.myUsername = myDetails.data.username;
            $scope.myLevel = myDetails.data.level;
            $scope.myLevelFrame = myDetails.data.levelFrame;
            $scope.myRank = myDetails.data.competitive.rank;
            $scope.myQPWins = myDetails.data.games.quick.wins;
            $scope.myCompWins = myDetails.data.games.competitive.wins;
            $scope.myQPPlaytime = myDetails.data.playtime.quick;
            $scope.myCompPlaytime = myDetails.data.playtime.competitive;
            $scope.myStar = myDetails.data.star;

            //-------------------------------------------------------
            var y = myDetails.data.games.competitive.wins / myDetails.data.games.competitive.played;
            var myCWR = (y * 100);
            $scope.myCompWinRate = myCWR.toFixed(2) + "%";
            myCall = true;
            if (oppCall == true && myCall == true) {
                compareDetails();
                $scope.comparison = true;
            }
            $scope.myUserInput = '';
        }

        function getAllMyHeroesQP(allMyHeroesQP) {
            $scope.myMeleeFinalBlowsQP = allMyHeroesQP.MeleeFinalBlows;
            $scope.mySoloKillsQP = allMyHeroesQP.SoloKills;
            $scope.myObjectiveKillsQP = allMyHeroesQP.ObjectiveKills;
            $scope.myFinalBlowsQP = allMyHeroesQP.FinalBlows;
            $scope.myDamageDoneQP = allMyHeroesQP.DamageDone;
            $scope.myEliminationsQP = allMyHeroesQP.Eliminations;
            $scope.myEnvironmentalKillsQP = allMyHeroesQP.EnvironmentalKills;
            $scope.myMultikillsQP = allMyHeroesQP.Multikills;
            $scope.myHealingDoneQP = allMyHeroesQP.HealingDone;
            $scope.myReconAssistsQP = allMyHeroesQP.ReconAssists;
            $scope.myTeleporterPadsDestroyedQP = allMyHeroesQP.TeleporterPadsDestroyed;
            $scope.myMostEliminationsInGameQP = allMyHeroesQP['Eliminations-MostinGame'];
            $scope.myMostFinalBlowsInGameQP = allMyHeroesQP['FinalBlows-MostinGame'];
            $scope.myMostDamageDoneInGameQP = allMyHeroesQP['DamageDone-MostinGame'];
            $scope.myMostHealingDoneInGameQP = allMyHeroesQP['HealingDone-MostinGame'];
            $scope.myMostDefensiveAssistsInGameQP = allMyHeroesQP['DefensiveAssists-MostinGame'];
            $scope.myMostOffensiveAssistsInGameQP = allMyHeroesQP['OffensiveAssists-MostinGame'];
            $scope.myMostObjectiveKillsInGameQP = allMyHeroesQP['ObjectiveKills-MostinGame'];
            $scope.myMostObjectiveTimeInGameQP = allMyHeroesQP['ObjectiveTime-MostinGame'];
            $scope.myBestMultikillQP = allMyHeroesQP['Multikill-Best'];
            $scope.myMostSoloKillsInGameQP = allMyHeroesQP['SoloKills-MostinGame'];
            $scope.myMostTimeSpentOnFireInGameQP = allMyHeroesQP['TimeSpentonFire-MostinGame'];
            $scope.myAverageMeleeFinalBlowsQP = allMyHeroesQP['MeleeFinalBlows-Average'];
            $scope.myAverageTimeSpentOnFireQP = allMyHeroesQP['TimeSpentonFire-Average'];
            $scope.myAverageSoloKillsQP = allMyHeroesQP['SoloKills-Average'];
            $scope.myAverageObjectiveTimeQP = allMyHeroesQP['ObjectiveTime-Average'];
            $scope.myAverageObjectiveKillsQP = allMyHeroesQP['ObjectiveKills-Average'];
            $scope.myAverageHealingDoneQP = allMyHeroesQP['HealingDone-Average'];
            $scope.myAverageFinalBlowsQP = allMyHeroesQP['FinalBlows-Average'];
            $scope.myAverageDeathsQP = allMyHeroesQP['Deaths-Average'];
            $scope.myAverageDamageDoneQP = allMyHeroesQP['DamageDone-Average'];
            $scope.myAverageEliminationsQP = allMyHeroesQP['Eliminations-Average'];
            $scope.myDeathsQP = allMyHeroesQP.Deaths;
            $scope.myEnvironmentalDeathsQP = allMyHeroesQP.EnvironmentalDeaths;
            $scope.myCardsQP = allMyHeroesQP.Cards;
            $scope.myMedalsQP = allMyHeroesQP.Medals;
            $scope.myGoldMedalsQP = allMyHeroesQP['Medals-Gold'];
            $scope.mySilverMedalsQP = allMyHeroesQP['Medals-Silver'];
            $scope.myBronzeMedalsQP = allMyHeroesQP['Medals-Bronze'];
            $scope.myTimeOnFireQP = allMyHeroesQP.TimeSpentonFire;
            $scope.myObjectiveTimeQP = allMyHeroesQP.ObjectiveTime;
            $scope.myMostMeleeFinalBlowsInGameQP = allMyHeroesQP['MeleeFinalBlows-MostinGame'];
            $scope.myDefensiveAssistsQP = allMyHeroesQP.DefensiveAssists;
            $scope.myAverageDefensiveAssistsQP = allMyHeroesQP['DefensiveAssists-Average'];
            $scope.myOffensiveAssistsQP = allMyHeroesQP.OffensiveAssists;
            $scope.myAverageOffensiveAssistsQP = allMyHeroesQP['OffensiveAssists-Average'];
        }

        function getAllMyHeroesComp(allMyHeroesComp) {
            $scope.myMeleeFinalBlowsComp = allMyHeroesComp.MeleeFinalBlows;
            $scope.mySoloKillsComp = allMyHeroesComp.SoloKills;
            $scope.myObjectiveKillsComp = allMyHeroesComp.ObjectiveKills;
            $scope.myFinalBlowsComp = allMyHeroesComp.FinalBlows;
            $scope.myDamageDoneComp = allMyHeroesComp.DamageDone;
            $scope.myEliminationsComp = allMyHeroesComp.Eliminations;
            $scope.myEnvironmentalKillsComp = allMyHeroesComp.EnvironmentalKills;
            $scope.myMultikillsComp = allMyHeroesComp.Multikills;
            $scope.myHealingDoneComp = allMyHeroesComp.HealingDone;
            $scope.myReconAssistsComp = allMyHeroesComp.ReconAssists;
            $scope.myTeleporterPadsDestroyedComp = allMyHeroesComp.TeleporterPadsDestroyed;
            $scope.myMostEliminationsInGameComp = allMyHeroesComp['Eliminations-MostinGame'];
            $scope.myMostFinalBlowsInGameComp = allMyHeroesComp['FinalBlows-MostinGame'];
            $scope.myMostDamageDoneInGameComp = allMyHeroesComp['DamageDone-MostinGame'];
            $scope.myMostHealingDoneInGameComp = allMyHeroesComp['HealingDone-MostinGame'];
            $scope.myMostDefensiveAssistsInGameComp = allMyHeroesComp['DefensiveAssists-MostinGame'];
            $scope.myMostOffensiveAssistsInGameComp = allMyHeroesComp['OffensiveAssists-MostinGame'];
            $scope.myMostObjectiveKillsInGameComp = allMyHeroesComp['ObjectiveKills-MostinGame'];
            $scope.myMostObjectiveTimeInGameComp = allMyHeroesComp['ObjectiveTime-MostinGame'];
            $scope.myBestMultikillComp = allMyHeroesComp['Multikill-Best'];
            $scope.myMostSoloKillsInGameComp = allMyHeroesComp['SoloKills-MostinGame'];
            $scope.myMostTimeSpentOnFireInGameComp = allMyHeroesComp['TimeSpentonFire-MostinGame'];
            $scope.myAverageMeleeFinalBlowsComp = allMyHeroesComp['MeleeFinalBlows-Average'];
            $scope.myAverageTimeSpentOnFireComp = allMyHeroesComp['TimeSpentonFire-Average'];
            $scope.myAverageSoloKillsComp = allMyHeroesComp['SoloKills-Average'];
            $scope.myAverageObjectiveTimeComp = allMyHeroesComp['ObjectiveTime-Average'];
            $scope.myAverageObjectiveKillsComp = allMyHeroesComp['ObjectiveKills-Average'];
            $scope.myAverageHealingDoneComp = allMyHeroesComp['HealingDone-Average'];
            $scope.myAverageFinalBlowsComp = allMyHeroesComp['FinalBlows-Average'];
            $scope.myAverageDeathsComp = allMyHeroesComp['Deaths-Average'];
            $scope.myAverageDamageDoneComp = allMyHeroesComp['DamageDone-Average'];
            $scope.myAverageEliminationsComp = allMyHeroesComp['Eliminations-Average'];
            $scope.myDeathsComp = allMyHeroesComp.Deaths;
            $scope.myEnvironmentalDeathsComp = allMyHeroesComp.EnvironmentalDeaths;
            $scope.myCardsComp = allMyHeroesComp.Cards;
            $scope.myMedalsComp = allMyHeroesComp.Medals;
            $scope.myGoldMedalsComp = allMyHeroesComp['Medals-Gold'];
            $scope.mySilverMedalsComp = allMyHeroesComp['Medals-Silver'];
            $scope.myBronzeMedalsComp = allMyHeroesComp['Medals-Bronze'];
            $scope.myTimeOnFireComp = allMyHeroesComp.TimeSpentonFire;
            $scope.myObjectiveTimeComp = allMyHeroesComp.ObjectiveTime;
            $scope.myMostMeleeFinalBlowsInGameComp = allMyHeroesComp['MeleeFinalBlows-MostinGame'];
            $scope.myDefensiveAssistsComp = allMyHeroesComp.DefensiveAssists;
            $scope.myAverageDefensiveAssistsComp = allMyHeroesComp['DefensiveAssists-Average'];
            $scope.myOffensiveAssistsComp = allMyHeroesComp.OffensiveAssists;
            $scope.myAverageOffensiveAssistsComp = allMyHeroesComp['OffensiveAssists-Average'];
        }

        function getMyHeroQP(myHeroQP) {

        }

        function getMyHeroComp(myHeroComp) {

        }

        function getMyPlayedHeroesQP(myPlayedHeroesQP) {
            for (var i = 0; i < myPlayedHeroesQP.length; i++) {
                var myMostPlayedQP = myPlayedHeroesQP[0];
                $scope.myMostPlayedQP = myMostPlayedQP.image;
                var playedHero = myPlayedHeroesQP[i];
            }
        }

        function getMyPlayedHeroesComp(myPlayedHeroesComp) {
            for (var i = 0; i < myPlayedHeroesComp.length; i++) {
                var myMostPlayedComp = myPlayedHeroesComp[0];
                $scope.myMostPlayedComp = myMostPlayedComp.image;
                var playedHero = myPlayedHeroesComp[i];
            }
        }

        function getMyAchievements(myAchievements) {
            $scope.myCompleteAchievements = myAchievements.numberOfAchievementsCompleted;
            var achievementList = myAchievements.achievements;
            for (var i = 0; i < achievementList.length; i++) {
                var achievementName = achievementList[i].name;
                var achievementFinished = achievementList[i].finished;
                var achievementImage = achievementList[i].image;
                var achievementDescription = achievementList[i].description;
                var achievementCategory = achievementList[i].category;
            }

        }

        //-----------------------------------------------------------------------------------------------------------------------
        //OPPONENT DETAILS

        $scope.getOppData = function() {
            var oppUserInput = $scope.oppUserInput;
            var oppUserName = oppUserInput.replace("#", "-");
            var oppPlatform = $scope.data.oppPlatformSelect;
            var oppRegion = $scope.data.oppRegionSelect;

            //get basic profile data
            $http({
                method: 'GET',
                url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/profile"
            }).then(function successCallback(response) {
                oppDetails = response.data;
                getOppDetails(oppDetails);
            }, function errorCallback(response) { alert(response.error); });

            //get all heroes data from quick play
            $http({
                method: 'GET',
                url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/quickplay/allHeroes/"
            }).then(function successCallback(response) {
                allOppHeroesQP = response.data;
                getAllOppHeroesQP(allOppHeroesQP);
            }, function errorCallback(response) { alert(response); });

            //get all heroes data from competitive play
            $http({
                method: 'GET',
                url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/competitive/allHeroes/"
            }).then(function successCallback(response) {
                allOppHeroesComp = response.data;
                getAllOppHeroesComp(allOppHeroesComp);
            }, function errorCallback(response) { alert(response); });

            //get a singular hero's data from quick play
            // $http({
            //     method: 'GET',
            //     url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/quick-play/hero/" + hero + "/"
            // }).then(function successCallback(response) {
            //     oppHeroQP = response.data;
            //     getOppHeroQP(oppHeroQP);
            // }, function errorCallback(response) { alert(response); });

            //get a singular hero's data from competitive play
            // $http({
            //     method: 'GET',
            //     url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/competitive-play/hero/" + hero + "/"
            // }).then(function successCallback(response) {
            //     oppHeroComp = response.data;
            //     getOppHeroComp(oppHeroComp);
            // }, function errorCallback(response) { alert(response); });

            //get list of most played heroes in quick play
            $http({
                method: 'GET',
                url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/quickplay/heroes"
            }).then(function successCallback(response) {
                oppPlayedHeroesQP = response.data;
                getOppPlayedHeroesQP(oppPlayedHeroesQP);
            }, function errorCallback(response) { alert(response); });

            //get list of most played heroes in competitive play
            $http({
                method: 'GET',
                url: apiURL + oppPlatform + "/" + oppRegion + "/" + oppUserName + "/competitive/heroes"
            }).then(function successCallback(response) {
                oppPlayedHeroesComp = response.data;
                getOppPlayedHeroesComp(oppPlayedHeroesComp);
            }, function errorCallback(response) { alert(response); });
        }

        function getOppDetails(oppDetails) {
            $scope.oppAvatar = oppDetails.data.avatar;
            $scope.oppUsername = oppDetails.data.username;
            $scope.oppLevel = oppDetails.data.level;
            $scope.oppRank = oppDetails.data.competitive.rank;
            $scope.oppQPWins = oppDetails.data.games.quick.wins;
            $scope.oppCompWins = oppDetails.data.games.competitive.wins;
            $scope.oppQPPlaytime = oppDetails.data.playtime.quick;
            $scope.oppCompPlaytime = oppDetails.data.playtime.competitive;
            $scope.oppLevelFrame = oppDetails.data.levelFrame;
            $scope.oppStar = oppDetails.data.star;
            $scope.oppRankIcon = oppDetails.data.competitive.rank_img;
            var q = oppDetails.data.games.quick.wins / oppDetails.data.games.quick.played;
            var oppQPWR = (q * 100);
            $scope.oppQPWinRate = oppQPWR.toFixed(2) + "%";
            var r = oppDetails.data.games.competitive.wins / oppDetails.data.games.competitive.played;
            var oppCWR = (r * 100);
            $scope.oppCompWinRate = oppCWR.toFixed(2) + "%";
            oppCall = true;
            if (oppCall == true && myCall == true) {
                compareDetails();
                $scope.comparison = true;
            }
            $scope.oppUserInput = '';
        }

        function getAllOppHeroesQP(allOppHeroesQP) {
            $scope.oppMeleeFinalBlowsQP = allOppHeroesQP.MeleeFinalBlows;
            $scope.oppSoloKillsQP = allOppHeroesQP.SoloKills;
            $scope.oppObjectiveKillsQP = allOppHeroesQP.ObjectiveKills;
            $scope.oppFinalBlowsQP = allOppHeroesQP.FinalBlows;
            $scope.oppDamageDoneQP = allOppHeroesQP.DamageDone;
            $scope.oppEliminationsQP = allOppHeroesQP.Eliminations;
            $scope.oppEnvironmentalKillsQP = allOppHeroesQP.EnvironmentalKills;
            $scope.oppMultikillsQP = allOppHeroesQP.Multikills;
            $scope.oppHealingDoneQP = allOppHeroesQP.HealingDone;
            $scope.oppReconAssistsQP = allOppHeroesQP.ReconAssists;
            $scope.oppTeleporterPadsDestroyedQP = allOppHeroesQP.TeleporterPadsDestroyed;
            $scope.oppMostEliminationsInGameQP = allOppHeroesQP['Eliminations-MostinGame'];
            $scope.oppMostFinalBlowsInGameQP = allOppHeroesQP['FinalBlows-MostinGame'];
            $scope.oppMostDamageDoneInGameQP = allOppHeroesQP['DamageDone-MostinGame'];
            $scope.oppMostHealingDoneInGameQP = allOppHeroesQP['HealingDone-MostinGame'];
            $scope.oppMostDefensiveAssistsInGameQP = allOppHeroesQP['DefensiveAssists-MostinGame'];
            $scope.oppMostOffensiveAssistsInGameQP = allOppHeroesQP['OffensiveAssists-MostinGame'];
            $scope.oppMostObjectiveKillsInGameQP = allOppHeroesQP['ObjectiveKills-MostinGame'];
            $scope.oppMostObjectiveTimeInGameQP = allOppHeroesQP['ObjectiveTime-MostinGame'];
            $scope.oppBestMultikillQP = allOppHeroesQP['Multikill-Best'];
            $scope.oppMostSoloKillsInGameQP = allOppHeroesQP['SoloKills-MostinGame'];
            $scope.oppMostTimeSpentOnFireInGameQP = allOppHeroesQP['TimeSpentonFire-MostinGame'];
            $scope.oppAverageMeleeFinalBlowsQP = allOppHeroesQP['MeleeFinalBlows-Average'];
            $scope.oppAverageTimeSpentOnFireQP = allOppHeroesQP['TimeSpentonFire-Average'];
            $scope.oppAverageSoloKillsQP = allOppHeroesQP['SoloKills-Average'];
            $scope.oppAverageObjectiveTimeQP = allOppHeroesQP['ObjectiveTime-Average'];
            $scope.oppAverageObjectiveKillsQP = allOppHeroesQP['ObjectiveKills-Average'];
            $scope.oppAverageHealingDoneQP = allOppHeroesQP['HealingDone-Average'];
            $scope.oppAverageFinalBlowsQP = allOppHeroesQP['FinalBlows-Average'];
            $scope.oppAverageDeathsQP = allOppHeroesQP['Deaths-Average'];
            $scope.oppAverageDamageDoneQP = allOppHeroesQP['DamageDone-Average'];
            $scope.oppAverageEliminationsQP = allOppHeroesQP['Eliminations-Average'];
            $scope.oppDeathsQP = allOppHeroesQP.Deaths;
            $scope.oppEnvironmentalDeathsQP = allOppHeroesQP.EnvironmentalDeaths;
            $scope.oppCardsQP = allOppHeroesQP.Cards;
            $scope.oppMedalsQP = allOppHeroesQP.Medals;
            $scope.oppGoldMedalsQP = allOppHeroesQP['Medals-Gold'];
            $scope.oppSilverMedalsQP = allOppHeroesQP['Medals-Silver'];
            $scope.oppBronzeMedalsQP = allOppHeroesQP['Medals-Bronze'];
            $scope.oppTimeOnFireQP = allOppHeroesQP.TimeSpentonFire;
            $scope.oppObjectiveTimeQP = allOppHeroesQP.ObjectiveTime;
            $scope.oppMostMeleeFinalBlowsInGameQP = allOppHeroesQP['MeleeFinalBlows-MostinGame'];
            $scope.oppDefensiveAssistsQP = allOppHeroesQP.DefensiveAssists;
            $scope.oppAverageDefensiveAssistsQP = allOppHeroesQP['DefensiveAssists-Average'];
            $scope.oppOffensiveAssistsQP = allOppHeroesQP.OffensiveAssists;
            $scope.oppAverageOffensiveAssistsQP = allOppHeroesQP['OffensiveAssists-Average'];
        }

        function getAllOppHeroesComp(allOppHeroesComp) {
            $scope.oppMeleeFinalBlowsComp = allOppHeroesComp.MeleeFinalBlows;
            $scope.oppSoloKillsComp = allOppHeroesComp.SoloKills;
            $scope.oppObjectiveKillsComp = allOppHeroesComp.ObjectiveKills;
            $scope.oppFinalBlowsComp = allOppHeroesComp.FinalBlows;
            $scope.oppDamageDoneComp = allOppHeroesComp.DamageDone;
            $scope.oppEliminationsComp = allOppHeroesComp.Eliminations;
            $scope.oppEnvironmentalKillsComp = allOppHeroesComp.EnvironmentalKills;
            $scope.oppMultikillsComp = allOppHeroesComp.Multikills;
            $scope.oppHealingDoneComp = allOppHeroesComp.HealingDone;
            $scope.oppReconAssistsComp = allOppHeroesComp.ReconAssists;
            $scope.oppTeleporterPadsDestroyedComp = allOppHeroesComp.TeleporterPadsDestroyed;
            $scope.oppMostEliminationsInGameComp = allOppHeroesComp['Eliminations-MostinGame'];
            $scope.oppMostFinalBlowsInGameComp = allOppHeroesComp['FinalBlows-MostinGame'];
            $scope.oppMostDamageDoneInGameComp = allOppHeroesComp['DamageDone-MostinGame'];
            $scope.oppMostHealingDoneInGameComp = allOppHeroesComp['HealingDone-MostinGame'];
            $scope.oppMostDefensiveAssistsInGameComp = allOppHeroesComp['DefensiveAssists-MostinGame'];
            $scope.oppMostOffensiveAssistsInGameComp = allOppHeroesComp['OffensiveAssists-MostinGame'];
            $scope.oppMostObjectiveKillsInGameComp = allOppHeroesComp['ObjectiveKills-MostinGame'];
            $scope.oppMostObjectiveTimeInGameComp = allOppHeroesComp['ObjectiveTime-MostinGame'];
            $scope.oppBestMultikillComp = allOppHeroesComp['Multikill-Best'];
            $scope.oppMostSoloKillsInGameComp = allOppHeroesComp['SoloKills-MostinGame'];
            $scope.oppMostTimeSpentOnFireInGameComp = allOppHeroesComp['TimeSpentonFire-MostinGame'];
            $scope.oppAverageMeleeFinalBlowsComp = allOppHeroesComp['MeleeFinalBlows-Average'];
            $scope.oppAverageTimeSpentOnFireComp = allOppHeroesComp['TimeSpentonFire-Average'];
            $scope.oppAverageSoloKillsComp = allOppHeroesComp['SoloKills-Average'];
            $scope.oppAverageObjectiveTimeComp = allOppHeroesComp['ObjectiveTime-Average'];
            $scope.oppAverageObjectiveKillsComp = allOppHeroesComp['ObjectiveKills-Average'];
            $scope.oppAverageHealingDoneComp = allOppHeroesComp['HealingDone-Average'];
            $scope.oppAverageFinalBlowsComp = allOppHeroesComp['FinalBlows-Average'];
            $scope.oppAverageDeathsComp = allOppHeroesComp['Deaths-Average'];
            $scope.oppAverageDamageDoneComp = allOppHeroesComp['DamageDone-Average'];
            $scope.oppAverageEliminationsComp = allOppHeroesComp['Eliminations-Average'];
            $scope.oppDeathsComp = allOppHeroesComp.Deaths;
            $scope.oppEnvironmentalDeathsComp = allOppHeroesComp.EnvironmentalDeaths;
            $scope.oppCardsComp = allOppHeroesComp.Cards;
            $scope.oppMedalsComp = allOppHeroesComp.Medals;
            $scope.oppGoldMedalsComp = allOppHeroesComp['Medals-Gold'];
            $scope.oppSilverMedalsComp = allOppHeroesComp['Medals-Silver'];
            $scope.oppBronzeMedalsComp = allOppHeroesComp['Medals-Bronze'];
            $scope.oppTimeOnFireComp = allOppHeroesComp.TimeSpentonFire;
            $scope.oppObjectiveTimeComp = allOppHeroesComp.ObjectiveTime;
            $scope.oppMostMeleeFinalBlowsInGameComp = allOppHeroesComp['MeleeFinalBlows-MostinGame'];
            $scope.oppDefensiveAssistsComp = allOppHeroesComp.DefensiveAssists;
            $scope.oppAverageDefensiveAssistsComp = allOppHeroesComp['DefensiveAssists-Average'];
            $scope.oppOffensiveAssistsComp = allOppHeroesComp.OffensiveAssists;
            $scope.oppAverageOffensiveAssistsComp = allOppHeroesComp['OffensiveAssists-Average'];

        }

        function getOppHeroQP(oppHeroQP) {

        }

        function getOppHeroComp(oppHeroComp) {

        }

        function getOppPlayedHeroesQP(oppPlayedHeroesQP) {
            for (var i = 0; i < oppPlayedHeroesQP.length; i++) {
                var oppMostPlayedQP = oppPlayedHeroesQP[0];
                $scope.oppMostPlayedQP = oppMostPlayedQP.image;
            }
        }

        function getOppPlayedHeroesComp(oppPlayedHeroesComp) {

        }

        //------------------------------------------------------------------------------------------------------------------------
        //COMPARISON INFORMATION

        function compareDetails() {
            $scope.levelDif = parseInt($scope.myLevel) - parseInt($scope.oppLevel);
            $scope.rankDif = parseInt($scope.myRank) - parseInt($scope.oppRank);
            $scope.qpWinsDif = parseInt($scope.myQPWins) - parseInt($scope.oppQPWins);
            $scope.compWinsDif = parseInt($scope.myCompWins) - parseInt($scope.oppCompWins);
            var qpWinRateDif = parseFloat($scope.myQPWinRate) - parseFloat($scope.oppQPWinRate);
            $scope.qpWinRateDif = qpWinRateDif.toFixed(2) + "%";
            var compWinRateDif = parseFloat($scope.myCompWinRate) - parseFloat($scope.oppCompWinRate);
            $scope.compWinRateDif = compWinRateDif.toFixed(2) + "%";
        }
      });
