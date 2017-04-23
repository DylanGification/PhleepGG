'use strict';
angular.module('phleepApp').controller('MainCtrl', function($scope, $http, socket, $rootScope) {

    // var apiURL = "http://54.72.42.73:4444";
    var apiURL = "https://owapi.net";
    var LOL_API_KEY = "api_key=690b6aa5-4f70-4eac-8d8c-808bd08ead0c";

    //OW Regions and Platforms
    $scope.myPlatforms = ["PC", "XBL", "PSN"];
    $scope.myRegions = ["EU", "US", "KR", "ANY"];
    $scope.oppPlatforms = ["PC", "XBL", "PSN"];
    $scope.oppRegions = ["EU", "US", "KR", "ANY"];

    //League of Legends Regions
    $scope.myLOLRegions = ["EUW", "NA", "KR", "RU", "EUNE", "OCE", "TR", "JP", "BR", "LAS"];
    $scope.oppLOLRegions = ["EUW", "NA", "KR", "RU", "EUNE", "OCE", "TR", "JP", "BR", "LAS"];

    //My details
    var myDetails = [];
    var myAchievements = [];
    $scope.myUserInput = "";
    $scope.myLOLUserInput = "";


    //Opponent details
    var oppDetails = [];
    var rankedMatch = [];
    var unrankedMatch = [];
    var leagueStats = [];
    var profileDetails = [];
    $scope.hideStats = true;
    $scope.hideLOLStats = true;
    $scope.hideCompare = true;
    $scope.hideLoader = true;
    $scope.hideLoaderCompare = true;

    $scope.showLoader = function() {
        $scope.hideLoaderCompare = false;
    }

    $scope.compare = function() {
        setTimeout(function() { $scope.getMyData(); }, 5000);
        $scope.getOppData();
    }
    var userID;
    var num = 0;

    //Comparison Details
    var myCall = false;
    var oppCall = false;
    var comparison = false;

    $scope.getOWData = function() {
        console.log("initial num " + num);
        $http({
            method: 'GET',
            url: "/data/pc_t3.json",
            type: 'json'
        }).then(function successCallback(response) {
            var tempmyDetails = response.data;
            var myUserInput = tempmyDetails[num].Username;
            var myUserName = myUserInput.replace("#", "-");
            var myRegion = $scope.myRegion.toLowerCase();
            var myPlatform = $scope.platform;
            console.log(myUserName);
            $http({
                method: 'GET',
                // url: apiURL + myUserName + "/blob" + "?platform=" + "xbl",
                url: apiURL + "/api/v3/u/" + myUserName + "/blob" + "?platform=" + "pc",
                // url: apiURL + myUserName + "/blob" + "?platform=" + "psn",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                myDetails = response.data;
                if (myDetails[myRegion] == null || myDetails[myRegion].stats.competitive == null) {
                    myRegion = "us";
                }
                if (myDetails[myRegion] == null || myDetails[myRegion].stats.competitive == null) {
                    myRegion = "kr";
                }
                if (myDetails[myRegion] == null && myDetails[myRegion].stats.competitive == null) {
                    num++;
                    if (num < 1001) {
                        setTimeout(function() { $scope.getNewData(); }, 5000);
                    }
                }
                console.log(myRegion);
                $http.post('/api/overwatchs', {
                    name: myUserName,
                    level: myDetails[myRegion].stats.quickplay.overall_stats.level,
                    prestige: myDetails[myRegion].stats.competitive.overall_stats.prestige,
                    rank: myDetails[myRegion].stats.competitive.overall_stats.comprank,
                    avatar: myDetails[myRegion].stats.competitive.overall_stats.avatar,
                    qp: {
                        total: {
                            objKills: myDetails[myRegion].stats.quickplay.game_stats.objective_kills,
                            rate: myDetails[myRegion].stats.quickplay.overall_stats.win_rate,
                            games: myDetails[myRegion].stats.quickplay.overall_stats.games,
                            wins: myDetails[myRegion].stats.quickplay.overall_stats.wins,
                            loss: myDetails[myRegion].stats.quickplay.overall_stats.losses,
                            healing: myDetails[myRegion].stats.quickplay.game_stats.healing_done,
                            offAssists: myDetails[myRegion].stats.quickplay.game_stats.offensive_assists,
                            defAssists: myDetails[myRegion].stats.quickplay.game_stats.defensive_assists,
                            recAssists: myDetails[myRegion].stats.quickplay.game_stats.recon_assists,
                            teleDestroyed: myDetails[myRegion].stats.quickplay.game_stats.teleporter_pads_destroyed,
                            objTime: myDetails[myRegion].stats.quickplay.game_stats.objective_time,
                            melee: myDetails[myRegion].stats.quickplay.game_stats.melee_final_blows,
                            medals: myDetails[myRegion].stats.quickplay.game_stats.medals,
                            cards: myDetails[myRegion].stats.quickplay.game_stats.cards,
                            multikillBest: myDetails[myRegion].stats.quickplay.game_stats.multikill_best,
                            multikills: myDetails[myRegion].stats.quickplay.game_stats.multikills,
                            damageDone: myDetails[myRegion].stats.quickplay.game_stats.damage_done,
                            bronze: myDetails[myRegion].stats.quickplay.game_stats.medals_bronze,
                            silver: myDetails[myRegion].stats.quickplay.game_stats.medals_silver,
                            gold: myDetails[myRegion].stats.quickplay.game_stats.medals_gold,
                            envKills: myDetails[myRegion].stats.quickplay.game_stats.environmental_kills,
                            soloKills: myDetails[myRegion].stats.quickplay.game_stats.solo_kills,
                            onFire: myDetails[myRegion].stats.quickplay.game_stats.time_spent_on_fire,
                            finalBlows: myDetails[myRegion].stats.quickplay.game_stats.final_blows,
                            timePlayed: myDetails[myRegion].stats.quickplay.game_stats.time_played,
                            envDeaths: myDetails[myRegion].stats.quickplay.game_stats.environmental_deaths,
                            kpd: myDetails[myRegion].stats.quickplay.game_stats.kpd,
                            elims: myDetails[myRegion].stats.quickplay.game_stats.eliminations,
                            deaths: myDetails[myRegion].stats.quickplay.game_stats.deaths
                        },
                        most: {
                            objKills: myDetails[myRegion].stats.quickplay.game_stats.objective_kills_most_in_game,
                            melee: myDetails[myRegion].stats.quickplay.game_stats.melee_final_blows_most_in_game,
                            onFire: myDetails[myRegion].stats.quickplay.game_stats.time_spent_on_fire_most_in_game,
                            finalBlows: myDetails[myRegion].stats.quickplay.game_stats.final_blows_most_in_game,
                            defAssists: myDetails[myRegion].stats.quickplay.game_stats.defensive_assists_most_in_game,
                            offAssists: myDetails[myRegion].stats.quickplay.game_stats.offensive_assists_most_in_game,
                            healing: myDetails[myRegion].stats.quickplay.game_stats.healing_done_most_in_game,
                            elims: myDetails[myRegion].stats.quickplay.game_stats.eliminations_most_in_game,
                            soloKills: myDetails[myRegion].stats.quickplay.game_stats.solo_kills_most_in_game,
                            damageDone: myDetails[myRegion].stats.quickplay.game_stats.damage_done_most_in_game,
                            objTime: myDetails[myRegion].stats.quickplay.game_stats.objective_time_most_in_game
                        },
                        average: {
                            healing: myDetails[myRegion].stats.quickplay.average_stats.healing_done_avg,
                            elims: myDetails[myRegion].stats.quickplay.average_stats.eliminations_avg,
                            melee: myDetails[myRegion].stats.quickplay.average_stats.melee_final_blows_avg,
                            finalBlows: myDetails[myRegion].stats.quickplay.average_stats.final_blows_avg,
                            offAssists: myDetails[myRegion].stats.quickplay.average_stats.offensive_assists_avg,
                            defAssists: myDetails[myRegion].stats.quickplay.average_stats.defensive_assists_avg,
                            damageDone: myDetails[myRegion].stats.quickplay.average_stats.damage_done_avg,
                            deaths: myDetails[myRegion].stats.quickplay.average_stats.deaths_avg,
                            objTime: myDetails[myRegion].stats.quickplay.average_stats.objective_time_avg,
                            soloKills: myDetails[myRegion].stats.quickplay.average_stats.solo_kills_avg,
                            onFire: myDetails[myRegion].stats.quickplay.average_stats.time_spent_on_fire_avg,
                            objKills: myDetails[myRegion].stats.quickplay.average_stats.objective_kills_avg
                        }
                    },
                    comp: {
                        total: {
                            rate: myDetails[myRegion].stats.competitive.overall_stats.win_rate,
                            games: myDetails[myRegion].stats.competitive.overall_stats.games,
                            wins: myDetails[myRegion].stats.competitive.overall_stats.wins,
                            loss: myDetails[myRegion].stats.competitive.overall_stats.losses,
                            objKills: myDetails[myRegion].stats.competitive.game_stats.objective_kills,
                            healing: myDetails[myRegion].stats.competitive.game_stats.healing_done,
                            offAssists: myDetails[myRegion].stats.competitive.game_stats.offensive_assists,
                            defAssists: myDetails[myRegion].stats.competitive.game_stats.defensive_assists,
                            recAssists: myDetails[myRegion].stats.competitive.game_stats.recon_assists,
                            teleDestroyed: myDetails[myRegion].stats.competitive.game_stats.teleporter_pads_destroyed,
                            objTime: myDetails[myRegion].stats.competitive.game_stats.objective_time,
                            melee: myDetails[myRegion].stats.competitive.game_stats.melee_final_blows,
                            medals: myDetails[myRegion].stats.competitive.game_stats.medals,
                            cards: myDetails[myRegion].stats.competitive.game_stats.cards,
                            multikillBest: myDetails[myRegion].stats.competitive.game_stats.multikill_best,
                            multikills: myDetails[myRegion].stats.competitive.game_stats.multikills,
                            damageDone: myDetails[myRegion].stats.competitive.game_stats.damage_done,
                            bronze: myDetails[myRegion].stats.competitive.game_stats.medals_bronze,
                            silver: myDetails[myRegion].stats.competitive.game_stats.medals_silver,
                            gold: myDetails[myRegion].stats.competitive.game_stats.medals_gold,
                            envKills: myDetails[myRegion].stats.competitive.game_stats.environmental_kills,
                            soloKills: myDetails[myRegion].stats.competitive.game_stats.solo_kills,
                            onFire: myDetails[myRegion].stats.competitive.game_stats.time_spent_on_fire,
                            finalBlows: myDetails[myRegion].stats.competitive.game_stats.final_blows,
                            timePlayed: myDetails[myRegion].stats.competitive.game_stats.time_played,
                            envDeaths: myDetails[myRegion].stats.competitive.game_stats.environmental_deaths,
                            kpd: myDetails[myRegion].stats.competitive.game_stats.kpd,
                            elims: myDetails[myRegion].stats.competitive.game_stats.eliminations,
                            deaths: myDetails[myRegion].stats.competitive.game_stats.deaths
                        },
                        most: {
                            objKills: myDetails[myRegion].stats.competitive.game_stats.objective_kills_most_in_game,
                            melee: myDetails[myRegion].stats.competitive.game_stats.melee_final_blows_most_in_game,
                            onFire: myDetails[myRegion].stats.competitive.game_stats.time_spent_on_fire_most_in_game,
                            finalBlows: myDetails[myRegion].stats.competitive.game_stats.final_blows_most_in_game,
                            defAssists: myDetails[myRegion].stats.competitive.game_stats.defensive_assists_most_in_game,
                            offAssists: myDetails[myRegion].stats.competitive.game_stats.offensive_assists_most_in_game,
                            healing: myDetails[myRegion].stats.competitive.game_stats.healing_done_most_in_game,
                            elims: myDetails[myRegion].stats.competitive.game_stats.eliminations_most_in_game,
                            soloKills: myDetails[myRegion].stats.competitive.game_stats.solo_kills_most_in_game,
                            damageDone: myDetails[myRegion].stats.competitive.game_stats.damage_done_most_in_game,
                            objTime: myDetails[myRegion].stats.competitive.game_stats.objective_time_most_in_game
                        },
                        average: {
                            healing: myDetails[myRegion].stats.competitive.average_stats.healing_done_avg,
                            elims: myDetails[myRegion].stats.competitive.average_stats.eliminations_avg,
                            melee: myDetails[myRegion].stats.competitive.average_stats.melee_final_blows_avg,
                            finalBlows: myDetails[myRegion].stats.competitive.average_stats.final_blows_avg,
                            offAssists: myDetails[myRegion].stats.competitive.average_stats.offensive_assists_avg,
                            defAssists: myDetails[myRegion].stats.competitive.average_stats.defensive_assists_avg,
                            damageDone: myDetails[myRegion].stats.competitive.average_stats.damage_done_avg,
                            deaths: myDetails[myRegion].stats.competitive.average_stats.deaths_avg,
                            objTime: myDetails[myRegion].stats.competitive.average_stats.objective_time_avg,
                            soloKills: myDetails[myRegion].stats.competitive.average_stats.solo_kills_avg,
                            onFire: myDetails[myRegion].stats.competitive.average_stats.time_spent_on_fire_avg,
                            objKills: myDetails[myRegion].stats.competitive.average_stats.objective_kills_avg
                        }
                    },
                    heroes: {
                        playtime: {
                            ana: myDetails[myRegion].heroes.playtime.competitive.ana + myDetails[myRegion].heroes.playtime.quickplay.ana,
                            bastion: myDetails[myRegion].heroes.playtime.competitive.bastion + myDetails[myRegion].heroes.playtime.quickplay.bastion,
                            dva: myDetails[myRegion].heroes.playtime.competitive.dva + myDetails[myRegion].heroes.playtime.quickplay.dva,
                            genji: myDetails[myRegion].heroes.playtime.competitive.genji + myDetails[myRegion].heroes.playtime.quickplay.genji,
                            hanzo: myDetails[myRegion].heroes.playtime.competitive.hanzo + myDetails[myRegion].heroes.playtime.quickplay.hanzo,
                            junkrat: myDetails[myRegion].heroes.playtime.competitive.junkrat + myDetails[myRegion].heroes.playtime.quickplay.junkrat,
                            lucio: myDetails[myRegion].heroes.playtime.competitive.lucio + myDetails[myRegion].heroes.playtime.quickplay.lucio,
                            mccree: myDetails[myRegion].heroes.playtime.competitive.mccree + myDetails[myRegion].heroes.playtime.quickplay.mccree,
                            mei: myDetails[myRegion].heroes.playtime.competitive.mei + myDetails[myRegion].heroes.playtime.quickplay.mei,
                            mercy: myDetails[myRegion].heroes.playtime.competitive.mercy + myDetails[myRegion].heroes.playtime.quickplay.mercy,
                            orisa: myDetails[myRegion].heroes.playtime.competitive.orisa + myDetails[myRegion].heroes.playtime.quickplay.orisa,
                            pharah: myDetails[myRegion].heroes.playtime.competitive.pharah + myDetails[myRegion].heroes.playtime.quickplay.pharah,
                            reaper: myDetails[myRegion].heroes.playtime.competitive.reaper + myDetails[myRegion].heroes.playtime.quickplay.reaper,
                            reinhardt: myDetails[myRegion].heroes.playtime.competitive.reinhardt + myDetails[myRegion].heroes.playtime.quickplay.reinhardt,
                            roadhog: myDetails[myRegion].heroes.playtime.competitive.roadhog + myDetails[myRegion].heroes.playtime.quickplay.roadhog,
                            soldier76: myDetails[myRegion].heroes.playtime.competitive.soldier76 + myDetails[myRegion].heroes.playtime.quickplay.soldier76,
                            sombra: myDetails[myRegion].heroes.playtime.competitive.sombra + myDetails[myRegion].heroes.playtime.quickplay.sombra,
                            symmetra: myDetails[myRegion].heroes.playtime.competitive.symmetra + myDetails[myRegion].heroes.playtime.quickplay.symmetra,
                            torbjorn: myDetails[myRegion].heroes.playtime.competitive.torbjorn + myDetails[myRegion].heroes.playtime.quickplay.torbjorn,
                            tracer: myDetails[myRegion].heroes.playtime.competitive.tracer + myDetails[myRegion].heroes.playtime.quickplay.tracer,
                            widowmaker: myDetails[myRegion].heroes.playtime.competitive.widowmaker + myDetails[myRegion].heroes.playtime.quickplay.widowmaker,
                            winston: myDetails[myRegion].heroes.playtime.competitive.winston + myDetails[myRegion].heroes.playtime.quickplay.winston,
                            zarya: myDetails[myRegion].heroes.playtime.competitive.zarya + myDetails[myRegion].heroes.playtime.quickplay.zarya,
                            zenyatta: myDetails[myRegion].heroes.playtime.competitive.zenyatta + myDetails[myRegion].heroes.playtime.quickplay.zenyatta
                        }
                    }
                });
                console.log("Added " + myUserName + " to MongoDB");
                num++;
                if (num < 1001) {
                    setTimeout(function() { $scope.getNewData(); }, 5000);
                }
            }, function errorCallback(response) {
                console.log(response.error);
                num++;
                if (num < 1001) {
                    setTimeout(function() { $scope.getNewData(); }, 5000);
                }
            });
        });
    }

    $scope.getMyData = function() {
        $scope.hideLoader = false;
        var myUserName = $scope.myUserInput.replace("#", "-");
        var myRegion = $scope.myRegion.toLowerCase();
        var myPlatform = $scope.myPlatform.toLowerCase();
        $http({
            method: 'GET',
            url: apiURL + "/api/v3/u/" + myUserName + "/blob" + "?platform=" + myPlatform,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            myDetails = response.data;
            $http.post('/api/overwatchs', {
                name: myUserName,
                level: myDetails[myRegion].stats.quickplay.overall_stats.level,
                prestige: myDetails[myRegion].stats.competitive.overall_stats.prestige,
                rank: myDetails[myRegion].stats.competitive.overall_stats.comprank,
                avatar: myDetails[myRegion].stats.competitive.overall_stats.avatar,
                qp: {
                    total: {
                        objKills: myDetails[myRegion].stats.quickplay.game_stats.objective_kills,
                        rate: myDetails[myRegion].stats.quickplay.overall_stats.win_rate,
                        games: myDetails[myRegion].stats.quickplay.overall_stats.games,
                        wins: myDetails[myRegion].stats.quickplay.overall_stats.wins,
                        loss: myDetails[myRegion].stats.quickplay.overall_stats.losses,
                        healing: myDetails[myRegion].stats.quickplay.game_stats.healing_done,
                        offAssists: myDetails[myRegion].stats.quickplay.game_stats.offensive_assists,
                        defAssists: myDetails[myRegion].stats.quickplay.game_stats.defensive_assists,
                        recAssists: myDetails[myRegion].stats.quickplay.game_stats.recon_assists,
                        teleDestroyed: myDetails[myRegion].stats.quickplay.game_stats.teleporter_pads_destroyed,
                        objTime: myDetails[myRegion].stats.quickplay.game_stats.objective_time,
                        melee: myDetails[myRegion].stats.quickplay.game_stats.melee_final_blows,
                        medals: myDetails[myRegion].stats.quickplay.game_stats.medals,
                        cards: myDetails[myRegion].stats.quickplay.game_stats.cards,
                        multikillBest: myDetails[myRegion].stats.quickplay.game_stats.multikill_best,
                        multikills: myDetails[myRegion].stats.quickplay.game_stats.multikills,
                        damageDone: myDetails[myRegion].stats.quickplay.game_stats.damage_done,
                        bronze: myDetails[myRegion].stats.quickplay.game_stats.medals_bronze,
                        silver: myDetails[myRegion].stats.quickplay.game_stats.medals_silver,
                        gold: myDetails[myRegion].stats.quickplay.game_stats.medals_gold,
                        envKills: myDetails[myRegion].stats.quickplay.game_stats.environmental_kills,
                        soloKills: myDetails[myRegion].stats.quickplay.game_stats.solo_kills,
                        onFire: myDetails[myRegion].stats.quickplay.game_stats.time_spent_on_fire,
                        finalBlows: myDetails[myRegion].stats.quickplay.game_stats.final_blows,
                        timePlayed: myDetails[myRegion].stats.quickplay.game_stats.time_played,
                        envDeaths: myDetails[myRegion].stats.quickplay.game_stats.environmental_deaths,
                        kpd: myDetails[myRegion].stats.quickplay.game_stats.kpd,
                        elims: myDetails[myRegion].stats.quickplay.game_stats.eliminations,
                        deaths: myDetails[myRegion].stats.quickplay.game_stats.deaths
                    },
                    most: {
                        objKills: myDetails[myRegion].stats.quickplay.game_stats.objective_kills_most_in_game,
                        melee: myDetails[myRegion].stats.quickplay.game_stats.melee_final_blows_most_in_game,
                        onFire: myDetails[myRegion].stats.quickplay.game_stats.time_spent_on_fire_most_in_game,
                        finalBlows: myDetails[myRegion].stats.quickplay.game_stats.final_blows_most_in_game,
                        defAssists: myDetails[myRegion].stats.quickplay.game_stats.defensive_assists_most_in_game,
                        offAssists: myDetails[myRegion].stats.quickplay.game_stats.offensive_assists_most_in_game,
                        healing: myDetails[myRegion].stats.quickplay.game_stats.healing_done_most_in_game,
                        elims: myDetails[myRegion].stats.quickplay.game_stats.eliminations_most_in_game,
                        soloKills: myDetails[myRegion].stats.quickplay.game_stats.solo_kills_most_in_game,
                        damageDone: myDetails[myRegion].stats.quickplay.game_stats.damage_done_most_in_game,
                        objTime: myDetails[myRegion].stats.quickplay.game_stats.objective_time_most_in_game
                    },
                    average: {
                        healing: myDetails[myRegion].stats.quickplay.average_stats.healing_done_avg,
                        elims: myDetails[myRegion].stats.quickplay.average_stats.eliminations_avg,
                        melee: myDetails[myRegion].stats.quickplay.average_stats.melee_final_blows_avg,
                        finalBlows: myDetails[myRegion].stats.quickplay.average_stats.final_blows_avg,
                        offAssists: myDetails[myRegion].stats.quickplay.average_stats.offensive_assists_avg,
                        defAssists: myDetails[myRegion].stats.quickplay.average_stats.defensive_assists_avg,
                        damageDone: myDetails[myRegion].stats.quickplay.average_stats.damage_done_avg,
                        deaths: myDetails[myRegion].stats.quickplay.average_stats.deaths_avg,
                        objTime: myDetails[myRegion].stats.quickplay.average_stats.objective_time_avg,
                        soloKills: myDetails[myRegion].stats.quickplay.average_stats.solo_kills_avg,
                        onFire: myDetails[myRegion].stats.quickplay.average_stats.time_spent_on_fire_avg,
                        objKills: myDetails[myRegion].stats.quickplay.average_stats.objective_kills_avg
                    }
                },
                comp: {
                    total: {
                        rate: myDetails[myRegion].stats.competitive.overall_stats.win_rate,
                        games: myDetails[myRegion].stats.competitive.overall_stats.games,
                        wins: myDetails[myRegion].stats.competitive.overall_stats.wins,
                        loss: myDetails[myRegion].stats.competitive.overall_stats.losses,
                        objKills: myDetails[myRegion].stats.competitive.game_stats.objective_kills,
                        healing: myDetails[myRegion].stats.competitive.game_stats.healing_done,
                        offAssists: myDetails[myRegion].stats.competitive.game_stats.offensive_assists,
                        defAssists: myDetails[myRegion].stats.competitive.game_stats.defensive_assists,
                        recAssists: myDetails[myRegion].stats.competitive.game_stats.recon_assists,
                        teleDestroyed: myDetails[myRegion].stats.competitive.game_stats.teleporter_pads_destroyed,
                        objTime: myDetails[myRegion].stats.competitive.game_stats.objective_time,
                        melee: myDetails[myRegion].stats.competitive.game_stats.melee_final_blows,
                        medals: myDetails[myRegion].stats.competitive.game_stats.medals,
                        cards: myDetails[myRegion].stats.competitive.game_stats.cards,
                        multikillBest: myDetails[myRegion].stats.competitive.game_stats.multikill_best,
                        multikills: myDetails[myRegion].stats.competitive.game_stats.multikills,
                        damageDone: myDetails[myRegion].stats.competitive.game_stats.damage_done,
                        bronze: myDetails[myRegion].stats.competitive.game_stats.medals_bronze,
                        silver: myDetails[myRegion].stats.competitive.game_stats.medals_silver,
                        gold: myDetails[myRegion].stats.competitive.game_stats.medals_gold,
                        envKills: myDetails[myRegion].stats.competitive.game_stats.environmental_kills,
                        soloKills: myDetails[myRegion].stats.competitive.game_stats.solo_kills,
                        onFire: myDetails[myRegion].stats.competitive.game_stats.time_spent_on_fire,
                        finalBlows: myDetails[myRegion].stats.competitive.game_stats.final_blows,
                        timePlayed: myDetails[myRegion].stats.competitive.game_stats.time_played,
                        envDeaths: myDetails[myRegion].stats.competitive.game_stats.environmental_deaths,
                        kpd: myDetails[myRegion].stats.competitive.game_stats.kpd,
                        elims: myDetails[myRegion].stats.competitive.game_stats.eliminations,
                        deaths: myDetails[myRegion].stats.competitive.game_stats.deaths
                    },
                    most: {
                        objKills: myDetails[myRegion].stats.competitive.game_stats.objective_kills_most_in_game,
                        melee: myDetails[myRegion].stats.competitive.game_stats.melee_final_blows_most_in_game,
                        onFire: myDetails[myRegion].stats.competitive.game_stats.time_spent_on_fire_most_in_game,
                        finalBlows: myDetails[myRegion].stats.competitive.game_stats.final_blows_most_in_game,
                        defAssists: myDetails[myRegion].stats.competitive.game_stats.defensive_assists_most_in_game,
                        offAssists: myDetails[myRegion].stats.competitive.game_stats.offensive_assists_most_in_game,
                        healing: myDetails[myRegion].stats.competitive.game_stats.healing_done_most_in_game,
                        elims: myDetails[myRegion].stats.competitive.game_stats.eliminations_most_in_game,
                        soloKills: myDetails[myRegion].stats.competitive.game_stats.solo_kills_most_in_game,
                        damageDone: myDetails[myRegion].stats.competitive.game_stats.damage_done_most_in_game,
                        objTime: myDetails[myRegion].stats.competitive.game_stats.objective_time_most_in_game
                    },
                    average: {
                        healing: myDetails[myRegion].stats.competitive.average_stats.healing_done_avg,
                        elims: myDetails[myRegion].stats.competitive.average_stats.eliminations_avg,
                        melee: myDetails[myRegion].stats.competitive.average_stats.melee_final_blows_avg,
                        finalBlows: myDetails[myRegion].stats.competitive.average_stats.final_blows_avg,
                        offAssists: myDetails[myRegion].stats.competitive.average_stats.offensive_assists_avg,
                        defAssists: myDetails[myRegion].stats.competitive.average_stats.defensive_assists_avg,
                        damageDone: myDetails[myRegion].stats.competitive.average_stats.damage_done_avg,
                        deaths: myDetails[myRegion].stats.competitive.average_stats.deaths_avg,
                        objTime: myDetails[myRegion].stats.competitive.average_stats.objective_time_avg,
                        soloKills: myDetails[myRegion].stats.competitive.average_stats.solo_kills_avg,
                        onFire: myDetails[myRegion].stats.competitive.average_stats.time_spent_on_fire_avg,
                        objKills: myDetails[myRegion].stats.competitive.average_stats.objective_kills_avg
                    }
                },
                heroes: {
                    playtime: {
                        ana: myDetails[myRegion].heroes.playtime.competitive.ana + myDetails[myRegion].heroes.playtime.quickplay.ana,
                        bastion: myDetails[myRegion].heroes.playtime.competitive.bastion + myDetails[myRegion].heroes.playtime.quickplay.bastion,
                        dva: myDetails[myRegion].heroes.playtime.competitive.dva + myDetails[myRegion].heroes.playtime.quickplay.dva,
                        genji: myDetails[myRegion].heroes.playtime.competitive.genji + myDetails[myRegion].heroes.playtime.quickplay.genji,
                        hanzo: myDetails[myRegion].heroes.playtime.competitive.hanzo + myDetails[myRegion].heroes.playtime.quickplay.hanzo,
                        junkrat: myDetails[myRegion].heroes.playtime.competitive.junkrat + myDetails[myRegion].heroes.playtime.quickplay.junkrat,
                        lucio: myDetails[myRegion].heroes.playtime.competitive.lucio + myDetails[myRegion].heroes.playtime.quickplay.lucio,
                        mccree: myDetails[myRegion].heroes.playtime.competitive.mccree + myDetails[myRegion].heroes.playtime.quickplay.mccree,
                        mei: myDetails[myRegion].heroes.playtime.competitive.mei + myDetails[myRegion].heroes.playtime.quickplay.mei,
                        mercy: myDetails[myRegion].heroes.playtime.competitive.mercy + myDetails[myRegion].heroes.playtime.quickplay.mercy,
                        orisa: myDetails[myRegion].heroes.playtime.competitive.orisa + myDetails[myRegion].heroes.playtime.quickplay.orisa,
                        pharah: myDetails[myRegion].heroes.playtime.competitive.pharah + myDetails[myRegion].heroes.playtime.quickplay.pharah,
                        reaper: myDetails[myRegion].heroes.playtime.competitive.reaper + myDetails[myRegion].heroes.playtime.quickplay.reaper,
                        reinhardt: myDetails[myRegion].heroes.playtime.competitive.reinhardt + myDetails[myRegion].heroes.playtime.quickplay.reinhardt,
                        roadhog: myDetails[myRegion].heroes.playtime.competitive.roadhog + myDetails[myRegion].heroes.playtime.quickplay.roadhog,
                        soldier76: myDetails[myRegion].heroes.playtime.competitive.soldier76 + myDetails[myRegion].heroes.playtime.quickplay.soldier76,
                        sombra: myDetails[myRegion].heroes.playtime.competitive.sombra + myDetails[myRegion].heroes.playtime.quickplay.sombra,
                        symmetra: myDetails[myRegion].heroes.playtime.competitive.symmetra + myDetails[myRegion].heroes.playtime.quickplay.symmetra,
                        torbjorn: myDetails[myRegion].heroes.playtime.competitive.torbjorn + myDetails[myRegion].heroes.playtime.quickplay.torbjorn,
                        tracer: myDetails[myRegion].heroes.playtime.competitive.tracer + myDetails[myRegion].heroes.playtime.quickplay.tracer,
                        widowmaker: myDetails[myRegion].heroes.playtime.competitive.widowmaker + myDetails[myRegion].heroes.playtime.quickplay.widowmaker,
                        winston: myDetails[myRegion].heroes.playtime.competitive.winston + myDetails[myRegion].heroes.playtime.quickplay.winston,
                        zarya: myDetails[myRegion].heroes.playtime.competitive.zarya + myDetails[myRegion].heroes.playtime.quickplay.zarya,
                        zenyatta: myDetails[myRegion].heroes.playtime.competitive.zenyatta + myDetails[myRegion].heroes.playtime.quickplay.zenyatta
                    }
                }
            });
            getMyDetails(myDetails);
            console.log("Added " + myUserName + " to MongoDB");
        }, function errorCallback(response) {
            console.log(response.error);
        });
    }

    $scope.getLOLData = function() {
        var oppRegion = $scope.oppRegion;
        console.log("Initial num: " + num);
        $http({
            method: 'GET',
            url: "/data/LOLUsers_KR.json",
            type: 'json'
        }).then(function successCallback(response) {
                var tempmyDetails = response.data;
                var myUserName = tempmyDetails[num].username;
                $http({
                    method: 'GET',
                    url: "https://" + oppRegion + ".api.riotgames.com/lol/summoner/v3/summoners/by-name/" + myUserName + "?" + LOL_API_KEY,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                        myDetails = response.data;
                        userID = myDetails.id;
                        $http({
                            method: 'GET',
                            url: "https://" + oppRegion + ".api.riotgames.com/api/lol/" + oppRegion + "/v1.3/stats/by-summoner/" + userID + "/summary?season=SEASON2017&" + LOL_API_KEY,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function successCallback(response) {
                                var gameDetails = response.data;
                                if (gameDetails.playerStatSummaries != null) {
                                    gameDetails.playerStatSummaries.forEach(function(res) {
                                        if (res.playerStatSummaryType == "RankedSolo5x5") {
                                            rankedMatch = res;
                                        }
                                        if (res.playerStatSummaryType == "Unranked") {
                                            unrankedMatch = res;
                                        }
                                    });

                                    $http({
                                        method: 'GET',
                                        url: "https://" + oppRegion + ".api.riotgames.com/api/lol/" + oppRegion + "/v1.3/stats/by-summoner/" + userID + "/ranked?season=SEASON2017&" + LOL_API_KEY,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(function successCallback(response) {
                                            var statsDetails = response.data;
                                            statsDetails.champions.forEach(function(res) {
                                                if (res.id == "0") {
                                                    leagueStats = res;
                                                }
                                            });
                                            $http({
                                                method: 'GET',
                                                url: "https://" + oppRegion + ".api.riotgames.com/api/lol/" + oppRegion + "/v2.5/league/by-summoner/" + userID + "/entry?" + LOL_API_KEY,
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                }
                                            }).then(function successCallback(response) {
                                                var profileDetails = response.data;
                                                $http.post('/api/leagues', {
                                                    name: myDetails.name,
                                                    tier: profileDetails[userID]["0"].tier,
                                                    division: profileDetails[userID]["0"].entries["0"].division,
                                                    leaguePoints: profileDetails[userID]["0"].entries["0"].leaguePoints,
                                                    profileIconId: myDetails.profileIconId,
                                                    ranked5x5: {
                                                        wins: rankedMatch.wins,
                                                        losses: rankedMatch.losses,
                                                        aggregatedStats: {
                                                            totalKills: rankedMatch.aggregatedStats.totalChampionKills,
                                                            totalCS: rankedMatch.aggregatedStats.totalMinionKills,
                                                            totalTurretKills: rankedMatch.aggregatedStats.totalTurretsKilled,
                                                            totalNeutralMinionKills: rankedMatch.aggregatedStats.totalNeutralMinionsKilled,
                                                            totalAssists: rankedMatch.totalAssists
                                                        }
                                                    },
                                                    unranked5x5: {
                                                        wins: unrankedMatch.winston,
                                                        aggregatedStats: {
                                                            totalKills: unrankedMatch.aggregatedStats.totalChampionKills,
                                                            totalCS: unrankedMatch.aggregatedStats.totalMinionKills,
                                                            totalTurretKills: unrankedMatch.aggregatedStats.totalTurretsKilled,
                                                            totalNeutralMinionKills: unrankedMatch.aggregatedStats.totalNeutralMinionsKilled,
                                                            totalAssists: unrankedMatch.totalAssists
                                                        }
                                                    },
                                                    stats: {
                                                        loss: leagueStats.stats.totalSessionsLost,
                                                        wins: leagueStats.stats.totalSessionsWon,
                                                        kills: leagueStats.stats.totalChampionKills,
                                                        killingSpree: leagueStats.stats.killingSpree,
                                                        totalDamageDealt: leagueStats.stats.totalDamageDealt,
                                                        totalDamageTaken: leagueStats.stats.totalDamageTaken,
                                                        mostKillsPerGame: leagueStats.stats.mostChampionKillsPerSession,
                                                        totalCS: leagueStats.stats.totalMinionKills,
                                                        totalDoubleKills: leagueStats.stats.totalDoubleKills,
                                                        totalTripleKills: leagueStats.stats.totalTripleKills,
                                                        totalQuadraKills: leagueStats.stats.totalQuadraKills,
                                                        totalPentaKills: leagueStats.stats.totalPentaKills,
                                                        totalUnrealKills: leagueStats.stats.totalUnrealKills,
                                                        totalDeaths: leagueStats.stats.totalDeathsPerSession,
                                                        totalGoldEarned: leagueStats.stats.totalGoldEarned,
                                                        totalTurretsKilled: leagueStats.stats.totalTurretsKilled,
                                                        totalPhysicalDamageDealt: leagueStats.stats.totalPhysicalDamageDealt,
                                                        totalMagicDamageDealt: leagueStats.stats.totalMagicDamageDealt,
                                                        totalNeutralMinionsKilled: leagueStats.stats.totalNeutralMinionsKilled,
                                                        totalFirstBlood: leagueStats.stats.totalFirstBlood,
                                                        totalAssists: leagueStats.stats.totalAssists,
                                                        totalHeal: leagueStats.stats.totalHeal,
                                                        maxLargestKillingSpree: leagueStats.stats.maxLargestKillingSpree,
                                                        maxChampionsKilled: leagueStats.stats.maxChampionsKilled,
                                                        maxNumDeaths: leagueStats.stats.maxNumDeaths,
                                                        maxTimePlayed: leagueStats.stats.maxTimePlayed,
                                                        maxTimeSpentLiving: leagueStats.stats.maxTimeSpentLiving
                                                    }
                                                });
                                            });
                                            console.log("Added " + myUserName + " to MongoDB");
                                            num++;
                                            if (num < 3000) {
                                                setTimeout(function() { $scope.getLOLData(); }, 5000);
                                            }
                                        },
                                        function errorCallback(response) {
                                            console.log(response.error);
                                            num++;
                                            if (num < 3000) {
                                                setTimeout(function() { $scope.getLOLData(); }, 5000);
                                            }
                                        });
                                } else {
                                    num++;
                                    setTimeout(function() { $scope.getLOLData(); }, 5000);
                                }
                            },
                            function errorCallback(response) {
                                console.log(response.error);
                                num++;
                                if (num < 3000) {
                                    setTimeout(function() { $scope.getLOLData(); }, 5000);
                                }
                            });
                    },
                    function errorCallback(response) {
                        console.log(response.error);
                        num++;
                        if (num < 3000) {
                            setTimeout(function() { $scope.getLOLData(); }, 5000);
                        }
                    });
            },
            function errorCallback(response) {
                console.log(response.error);
                num++;
                if (num < 3000) {
                    setTimeout(function() { $scope.getLOLData(); }, 5000);
                }
            });
    }

    $scope.getMyLOLData = function() {
        var myLOLRegion = $scope.myLOLRegion.toLowerCase();
        var myUserName = $scope.myLOLUserInput;
        $http({
            method: 'GET',
            url: "https://" + myLOLRegion + "1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + myUserName + "?" + LOL_API_KEY,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
                myDetails = response.data;
                userID = myDetails.id;
                $http({
                    method: 'GET',
                    url: "https://" + myLOLRegion + ".api.riotgames.com/api/lol/" + myLOLRegion + "/v1.3/stats/by-summoner/" + userID + "/summary?season=SEASON2017&" + LOL_API_KEY,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                        var gameDetails = response.data;
                        gameDetails.playerStatSummaries.forEach(function(res) {
                            if (res.playerStatSummaryType == "RankedSolo5x5") {
                                rankedMatch = res;
                            }
                            if (res.playerStatSummaryType == "Unranked") {
                                unrankedMatch = res;
                            }
                        });
                        $http({
                            method: 'GET',
                            url: "https://" + myLOLRegion + ".api.riotgames.com/api/lol/" + myLOLRegion + "/v1.3/stats/by-summoner/" + userID + "/ranked?season=SEASON2017&" + LOL_API_KEY,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function successCallback(response) {
                                var statsDetails = response.data;
                                statsDetails.champions.forEach(function(res) {
                                    if (res.id == "0") {
                                        leagueStats = res;
                                    }
                                });
                                $http({
                                    method: 'GET',
                                    url: "https://" + myLOLRegion + ".api.riotgames.com/api/lol/" + myLOLRegion + "/v2.5/league/by-summoner/" + userID + "/entry?" + LOL_API_KEY,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(function successCallback(response) {
                                    profileDetails = response.data;
                                    $http.post('/api/leagues', {
                                        name: myDetails.name,
                                        tier: profileDetails[userID]["0"].tier,
                                        division: profileDetails[userID]["0"].entries["0"].division,
                                        leaguePoints: profileDetails[userID]["0"].entries["0"].leaguePoints,
                                        profileIconId: myDetails.profileIconId,
                                        ranked5x5: {
                                            wins: rankedMatch.wins,
                                            losses: rankedMatch.losses,
                                            aggregatedStats: {
                                                totalKills: rankedMatch.aggregatedStats.totalChampionKills,
                                                totalCS: rankedMatch.aggregatedStats.totalMinionKills,
                                                totalTurretKills: rankedMatch.aggregatedStats.totalTurretsKilled,
                                                totalNeutralMinionKills: rankedMatch.aggregatedStats.totalNeutralMinionsKilled,
                                                totalAssists: rankedMatch.totalAssists
                                            }
                                        },
                                        unranked5x5: {
                                            wins: unrankedMatch.wins,
                                            aggregatedStats: {
                                                totalKills: unrankedMatch.aggregatedStats.totalChampionKills,
                                                totalCS: unrankedMatch.aggregatedStats.totalMinionKills,
                                                totalTurretKills: unrankedMatch.aggregatedStats.totalTurretsKilled,
                                                totalNeutralMinionKills: unrankedMatch.aggregatedStats.totalNeutralMinionsKilled,
                                                totalAssists: unrankedMatch.totalAssists
                                            }
                                        },
                                        stats: {
                                            loss: leagueStats.stats.totalSessionsLost,
                                            wins: leagueStats.stats.totalSessionsWon,
                                            kills: leagueStats.stats.totalChampionKills,
                                            killingSpree: leagueStats.stats.killingSpree,
                                            totalDamageDealt: leagueStats.stats.totalDamageDealt,
                                            totalDamageTaken: leagueStats.stats.totalDamageTaken,
                                            mostKillsPerGame: leagueStats.stats.mostChampionKillsPerSession,
                                            totalCS: leagueStats.stats.totalMinionKills,
                                            totalDoubleKills: leagueStats.stats.totalDoubleKills,
                                            totalTripleKills: leagueStats.stats.totalTripleKills,
                                            totalQuadraKills: leagueStats.stats.totalQuadraKills,
                                            totalPentaKills: leagueStats.stats.totalPentaKills,
                                            totalUnrealKills: leagueStats.stats.totalUnrealKills,
                                            totalDeaths: leagueStats.stats.totalDeathsPerSession,
                                            totalGoldEarned: leagueStats.stats.totalGoldEarned,
                                            totalTurretsKilled: leagueStats.stats.totalTurretsKilled,
                                            totalPhysicalDamageDealt: leagueStats.stats.totalPhysicalDamageDealt,
                                            totalMagicDamageDealt: leagueStats.stats.totalMagicDamageDealt,
                                            totalNeutralMinionsKilled: leagueStats.stats.totalNeutralMinionsKilled,
                                            totalFirstBlood: leagueStats.stats.totalFirstBlood,
                                            totalAssists: leagueStats.stats.totalAssists,
                                            totalHeal: leagueStats.stats.totalHeal,
                                            maxLargestKillingSpree: leagueStats.stats.maxLargestKillingSpree,
                                            maxChampionsKilled: leagueStats.stats.maxChampionsKilled,
                                            maxNumDeaths: leagueStats.stats.maxNumDeaths,
                                            maxTimePlayed: leagueStats.stats.maxTimePlayed,
                                            maxTimeSpentLiving: leagueStats.stats.maxTimeSpentLiving
                                        }
                                    });
                                    $scope.getMyLOLDetails(myDetails, rankedMatch, unrankedMatch, leagueStats, profileDetails);
                                    console.log("Added " + myUserName + " to MongoDB");
                                });

                            },
                            function errorCallback(response) {
                                console.log(response.error);
                            });

                    },
                    function errorCallback(response) {
                        console.log(response.error);
                    });
            },
            function errorCallback(response) {
                console.log(response.error);
            });
    }

    $scope.getMyLOLDetails = function(myDetails, rankedMatch, unrankedMatch, leagueStats, profileDetails) {
        $scope.myLOLUserName = $scope.myLOLUserInput;
        $scope.mySummonerID = myDetails.id;
        var userID = $scope.mySummonerID;
        $scope.myLOLRank = profileDetails[userID]["0"].tier + " " + profileDetails[userID]["0"].entries["0"].division + " " + profileDetails[userID]["0"].entries["0"].leaguePoints;
        $scope.myLOLRankedWins = rankedMatch.wins;
        $scope.myLOLRankedLosses = rankedMatch.losses;
        $scope.myLOLWinRate = (rankedMatch.wins / (rankedMatch.wins + rankedMatch.losses)) * 100 +"%";

        $scope.myUnrankedKills = unrankedMatch.aggregatedStats.totalChampionKills;
        $scope.myUnrankedCS = unrankedMatch.aggregatedStats.totalMinionKills;
        $scope.myUnrankedTurretKills = unrankedMatch.aggregatedStats.totalTurretsKilled;
        $scope.myUnrankedNeutralMinions = unrankedMatch.aggregatedStats.totalNeutralMinionsKilled;
        $scope.myUnrankedAssists = unrankedMatch.aggregatedStats.totalAssists;
        

        $scope.myRankedKills = rankedMatch.aggregatedStats.totalChampionKills;
        $scope.myRankedCS = rankedMatch.aggregatedStats.totalMinionKills;
        $scope.myRankedTurretKills = rankedMatch.aggregatedStats.totalTurretsKilled;
        $scope.myRankedNeutralMinions = rankedMatch.aggregatedStats.totalNeutralMinionsKilled;
        $scope.myRankedAssists = rankedMatch.aggregatedStats.totalAssists;
    }

    function getMyDetails(myDetails) {
        var myRegion = $scope.myRegion.toLowerCase();
        var myPlatform = $scope.myPlatform.toLowerCase();
        var myUserName = $scope.myUserInput.replace("#", "-");
        //GENERAL STATS
        $scope.myAvatar = myDetails[myRegion].stats.competitive.overall_stats.avatar;
        if (myPlatform == "pc") {
            $scope.myUsername = myUserName.substring(0, myUserName.indexOf('-'));
        } else {
            $scope.myUsername = myUserName;
        }
        $scope.myLevel = myDetails[myRegion].stats.quickplay.overall_stats.level;
        $scope.myRank = myDetails[myRegion].stats.competitive.overall_stats.comprank;
        $scope.myWinRate = myDetails[myRegion].stats.competitive.overall_stats.win_rate;
        $scope.myCompWins = myDetails[myRegion].stats.competitive.overall_stats.wins;
        $scope.myCompPlaytime = myDetails[myRegion].stats.competitive.game_stats.time_played
        $scope.myPrestige = myDetails[myRegion].stats.competitive.overall_stats.prestige;
        $scope.myTier = myDetails[myRegion].stats.competitive.overall_stats.tier;
        $scope.ties = myDetails[myRegion].stats.competitive.overall_stats.ties;

        //COMPETITIVE

        //OVERALL GAME STATS
        $scope.gamesComp = myDetails[myRegion].stats.competitive.overall_stats.games;
        $scope.lossesComp = myDetails[myRegion].stats.competitive.overall_stats.losses;
        $scope.totalObjKillsComp = myDetails[myRegion].stats.competitive.game_stats.objective_kills;
        $scope.totalHealingComp = myDetails[myRegion].stats.competitive.game_stats.healing_done;
        $scope.totalOffAssistsComp = myDetails[myRegion].stats.competitive.game_stats.offensive_assists;
        $scope.totalDefAssistsComp = myDetails[myRegion].stats.competitive.game_stats.defensive_assists;
        $scope.totalRecAssistsComp = myDetails[myRegion].stats.competitive.game_stats.recon_assists;
        $scope.totalTeleDestroyedComp = myDetails[myRegion].stats.competitive.game_stats.teleporter_pads_destroyed;
        $scope.totalObjTimeComp = myDetails[myRegion].stats.competitive.game_stats.objective_time.toFixed(2);
        $scope.totalMeleeComp = myDetails[myRegion].stats.competitive.game_stats.melee_final_blows;
        $scope.totalMedalsComp = myDetails[myRegion].stats.competitive.game_stats.medals;
        $scope.totalCardsComp = myDetails[myRegion].stats.competitive.game_stats.cards;
        $scope.totalElimsComp = myDetails[myRegion].stats.competitive.game_stats.eliminations;
        $scope.totalDeathsComp = myDetails[myRegion].stats.competitive.game_stats.deaths;
        $scope.totalMultikillsComp = myDetails[myRegion].stats.competitive.game_stats.multikills;
        $scope.totalDamageDoneComp = myDetails[myRegion].stats.competitive.game_stats.damage_done;
        $scope.totalBronzeComp = myDetails[myRegion].stats.competitive.game_stats.medals_bronze;
        $scope.totalSilverComp = myDetails[myRegion].stats.competitive.game_stats.medals_silver;
        $scope.totalGoldComp = myDetails[myRegion].stats.competitive.game_stats.medals_gold;
        $scope.totalEnvKillsComp = myDetails[myRegion].stats.competitive.game_stats.environmental_kills;
        $scope.totalSoloKillsComp = myDetails[myRegion].stats.competitive.game_stats.solo_kills;
        $scope.totalOnFireComp = myDetails[myRegion].stats.competitive.game_stats.time_spent_on_fire.toFixed(2);
        $scope.totalFinalBlowsComp = myDetails[myRegion].stats.competitive.game_stats.final_blows;
        $scope.totalTimePlayedComp = myDetails[myRegion].stats.competitive.game_stats.time_played;
        $scope.totalEnvDeathsComp = myDetails[myRegion].stats.competitive.game_stats.environmental_deaths;
        $scope.kpdComp = myDetails[myRegion].stats.competitive.game_stats.kpd;
        $scope.shieldGensDestroyedComp = myDetails[myRegion].stats.competitive.game_stats.shield_generators_destroyed;
        $scope.turretsDestroyedComp = myDetails[myRegion].stats.competitive.game_stats.turrets_destroyed;

        //BEST/MOST IN GAME
        $scope.multikillBestComp = myDetails[myRegion].stats.competitive.game_stats.multikill_best;
        $scope.objKillsBestComp = myDetails[myRegion].stats.competitive.game_stats.objective_kills_most_in_game;
        $scope.meleeBestComp = myDetails[myRegion].stats.competitive.game_stats.melee_final_blows_most_in_game;
        $scope.onFireBestComp = (myDetails[myRegion].stats.competitive.game_stats.time_spent_on_fire_most_in_game * 3600).toFixed(2);
        $scope.finalBlowsBestComp = myDetails[myRegion].stats.competitive.game_stats.final_blows_most_in_game;
        $scope.defAssistsBestComp = myDetails[myRegion].stats.competitive.game_stats.defensive_assists_most_in_game;
        $scope.offAssistsBestComp = myDetails[myRegion].stats.competitive.game_stats.offensive_assists_most_in_game;
        $scope.healingBestComp = myDetails[myRegion].stats.competitive.game_stats.healing_done_most_in_game;
        $scope.elimsBestComp = myDetails[myRegion].stats.competitive.game_stats.eliminations_most_in_game;
        $scope.soloKillsBestComp = myDetails[myRegion].stats.competitive.game_stats.solo_kills_most_in_game;
        $scope.damageDoneBestComp = myDetails[myRegion].stats.competitive.game_stats.damage_done_most_in_game;
        $scope.objTimeBestComp = (myDetails[myRegion].stats.competitive.game_stats.objective_time_most_in_game * 3600).toFixed(2);
        $scope.bestKillStreakComp = myDetails[myRegion].stats.competitive.game_stats.kill_streak_best;
        $scope.recAssistsBestComp = myDetails[myRegion].stats.competitive.game_stats.recon_assists_most_in_game;
        $scope.shieldGensDestroyedBestComp = myDetails[myRegion].stats.competitive.game_stats.shield_generator_destroyed_most_in_game;
        $scope.turretsDestroyedBestComp = myDetails[myRegion].stats.competitive.game_stats.turrets_destroyed_most_in_game;
        $scope.envKillsBestComp = myDetails[myRegion].stats.competitive.game_stats.environmental_kills_most_in_game;
        $scope.teleDestroyedBestComp = myDetails[myRegion].stats.competitive.game_stats.teleporter_pad_destroyed_most_in_game;

        //AVERAGE STATS
        $scope.healingAvgComp = myDetails[myRegion].stats.competitive.average_stats.healing_done_avg;
        $scope.elimsAvgComp = myDetails[myRegion].stats.competitive.average_stats.eliminations_avg;
        $scope.meleeAvgComp = myDetails[myRegion].stats.competitive.average_stats.melee_final_blows_avg;
        $scope.finalBlowsAvgComp = myDetails[myRegion].stats.competitive.average_stats.final_blows_avg;
        $scope.offAssistsAvgComp = myDetails[myRegion].stats.competitive.average_stats.offensive_assists_avg;
        $scope.defAssistsAvgComp = myDetails[myRegion].stats.competitive.average_stats.defensive_assists_avg;
        $scope.damageDoneAvgComp = myDetails[myRegion].stats.competitive.average_stats.damage_done_avg;
        $scope.deathsAvgComp = myDetails[myRegion].stats.competitive.average_stats.deaths_avg;
        $scope.objTimeAvgComp = (myDetails[myRegion].stats.competitive.average_stats.objective_time_avg * 3600).toFixed(2);
        $scope.soloKillsAvgComp = myDetails[myRegion].stats.competitive.average_stats.solo_kills_avg;
        $scope.onFireAvgComp = (myDetails[myRegion].stats.competitive.average_stats.time_spent_on_fire_avg * 3600).toFixed(2);
        $scope.objKillsAvgComp = myDetails[myRegion].stats.competitive.average_stats.objective_kills_avg;


        //QUICKPLAY
        $scope.gamesQP = myDetails[myRegion].stats.quickplay.overall_stats.games;
        $scope.winsQP = myDetails[myRegion].stats.quickplay.overall_stats.wins;
        $scope.tiesQP = myDetails[myRegion].stats.quickplay.overall_stats.ties;
        $scope.lossesQP = myDetails[myRegion].stats.quickplay.overall_stats.losses;
        $scope.totalObjKillsQP = myDetails[myRegion].stats.quickplay.game_stats.objective_kills;
        $scope.totalHealingQP = myDetails[myRegion].stats.quickplay.game_stats.healing_done;
        $scope.totalOffAssistsQP = myDetails[myRegion].stats.quickplay.game_stats.offensive_assists;
        $scope.totalDefAssistsQP = myDetails[myRegion].stats.quickplay.game_stats.defensive_assists;
        $scope.totalRecAssistsQP = myDetails[myRegion].stats.quickplay.game_stats.recon_assists;
        $scope.totalTeleDestroyedQP = myDetails[myRegion].stats.quickplay.game_stats.teleporter_pads_destroyed;
        $scope.totalObjTimeQP = (myDetails[myRegion].stats.quickplay.game_stats.objective_time).toFixed(2);
        $scope.totalMeleeQP = myDetails[myRegion].stats.quickplay.game_stats.melee_final_blows;
        $scope.totalMedalsQP = myDetails[myRegion].stats.quickplay.game_stats.medals;
        $scope.totalCardsQP = myDetails[myRegion].stats.quickplay.game_stats.cards;
        $scope.totalElimsQP = myDetails[myRegion].stats.quickplay.game_stats.eliminations;
        $scope.totalDeathsQP = myDetails[myRegion].stats.quickplay.game_stats.deaths;
        $scope.totalMultikillsQP = myDetails[myRegion].stats.quickplay.game_stats.multikills;
        $scope.totalDamageDoneQP = myDetails[myRegion].stats.quickplay.game_stats.damage_done;
        $scope.totalBronzeQP = myDetails[myRegion].stats.quickplay.game_stats.medals_bronze;
        $scope.totalSilverQP = myDetails[myRegion].stats.quickplay.game_stats.medals_silver;
        $scope.totalGoldQP = myDetails[myRegion].stats.quickplay.game_stats.medals_gold;
        $scope.totalEnvKillsQP = myDetails[myRegion].stats.quickplay.game_stats.environmental_kills;
        $scope.totalSoloKillsQP = myDetails[myRegion].stats.quickplay.game_stats.solo_kills;
        $scope.totalOnFireQP = (myDetails[myRegion].stats.quickplay.game_stats.time_spent_on_fire).toFixed(2);
        $scope.totalFinalBlowsQP = myDetails[myRegion].stats.quickplay.game_stats.final_blows;
        $scope.totalTimePlayedQP = myDetails[myRegion].stats.quickplay.game_stats.time_played;
        $scope.totalEnvDeathsQP = myDetails[myRegion].stats.quickplay.game_stats.environmental_deaths;
        $scope.kpdQP = myDetails[myRegion].stats.quickplay.game_stats.kpd;
        $scope.shieldGensDestroyedQP = myDetails[myRegion].stats.quickplay.game_stats.shield_generators_destroyed;
        $scope.turretsDestroyedQP = myDetails[myRegion].stats.quickplay.game_stats.turrets_destroyed;
        $scope.playtimeQP = myDetails[myRegion].stats.quickplay.game_stats.time_played;

        //BEST/MOST IN GAME
        $scope.multikillBestQP = myDetails[myRegion].stats.quickplay.game_stats.multikill_best;
        $scope.objKillsBestQP = myDetails[myRegion].stats.quickplay.game_stats.objective_kills_most_in_game;
        $scope.meleeBestQP = myDetails[myRegion].stats.quickplay.game_stats.melee_final_blows_most_in_game;
        $scope.onFireBestQP = (myDetails[myRegion].stats.quickplay.game_stats.time_spent_on_fire_most_in_game * 3600).toFixed(2);
        $scope.finalBlowsBestQP = myDetails[myRegion].stats.quickplay.game_stats.final_blows_most_in_game;
        $scope.defAssistsBestQP = myDetails[myRegion].stats.quickplay.game_stats.defensive_assists_most_in_game;
        $scope.offAssistsBestQP = myDetails[myRegion].stats.quickplay.game_stats.offensive_assists_most_in_game;
        $scope.healingBestQP = myDetails[myRegion].stats.quickplay.game_stats.healing_done_most_in_game;
        $scope.elimsBestQP = myDetails[myRegion].stats.quickplay.game_stats.eliminations_most_in_game;
        $scope.soloKillsBestQP = myDetails[myRegion].stats.quickplay.game_stats.solo_kills_most_in_game;
        $scope.damageDoneBestQP = myDetails[myRegion].stats.quickplay.game_stats.damage_done_most_in_game;
        $scope.objTimeBestQP = (myDetails[myRegion].stats.quickplay.game_stats.objective_time_most_in_game * 3600).toFixed(2);
        $scope.bestKillStreakQP = myDetails[myRegion].stats.quickplay.game_stats.kill_streak_best;
        $scope.recAssistsBestQP = myDetails[myRegion].stats.quickplay.game_stats.recon_assists_most_in_game;
        $scope.shieldGensDestroyedBestQP = myDetails[myRegion].stats.quickplay.game_stats.shield_generator_destroyed_most_in_game;
        $scope.turretsDestroyedBestQP = myDetails[myRegion].stats.quickplay.game_stats.turrets_destroyed_most_in_game;
        $scope.envKillsBestQP = myDetails[myRegion].stats.quickplay.game_stats.environmental_kills_most_in_game;
        $scope.teleDestroyedBestQP = myDetails[myRegion].stats.quickplay.game_stats.teleporter_pad_destroyed_most_in_game;

        //AVERAGE STATS
        $scope.healingAvgQP = myDetails[myRegion].stats.quickplay.average_stats.healing_done_avg;
        $scope.elimsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.eliminations_avg;
        $scope.meleeAvgQP = myDetails[myRegion].stats.quickplay.average_stats.melee_final_blows_avg;
        $scope.finalBlowsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.final_blows_avg;
        $scope.offAssistsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.offensive_assists_avg;
        $scope.defAssistsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.defensive_assists_avg;
        $scope.damageDoneAvgQP = myDetails[myRegion].stats.quickplay.average_stats.damage_done_avg;
        $scope.deathsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.deaths_avg;
        $scope.objTimeAvgQP = (myDetails[myRegion].stats.quickplay.average_stats.objective_time_avg * 3600).toFixed(2);
        $scope.soloKillsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.solo_kills_avg;
        $scope.onFireAvgQP = (myDetails[myRegion].stats.quickplay.average_stats.time_spent_on_fire_avg * 3600).toFixed(2);
        $scope.objKillsAvgQP = myDetails[myRegion].stats.quickplay.average_stats.objective_kills_avg;

        myCall = true;
        if (oppCall == true && myCall == true) {
            compareDetails();
            $scope.hideCompare = false;
            $scope.comparison = true;
            $scope.hideLoaderCompare = false;
        }

        var myTier = $scope.myTier;
        getRankImage(myTier);
        $scope.myUserInput = '';
        $scope.hideStats = false;
    }

    $scope.getOppData = function() {
        $scope.hideLoader = false;
        var oppUserName = $scope.oppUserInput.replace("#", "-");
        var oppRegion = $scope.oppRegion.toLowerCase();
        var oppPlatform = $scope.oppPlatform.toLowerCase();
        $http({
            method: 'GET',
            url: apiURL + "/api/v3/u/" + oppUserName + "/blob" + "?platform=" + oppPlatform,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            oppDetails = response.data;
            $http.post('/api/overwatchs', {
                name: oppUserName,
                level: oppDetails[oppRegion].stats.quickplay.overall_stats.level,
                prestige: oppDetails[oppRegion].stats.competitive.overall_stats.prestige,
                rank: oppDetails[oppRegion].stats.competitive.overall_stats.comprank,
                avatar: oppDetails[oppRegion].stats.competitive.overall_stats.avatar,
                qp: {
                    total: {
                        objKills: oppDetails[oppRegion].stats.quickplay.game_stats.objective_kills,
                        rate: oppDetails[oppRegion].stats.quickplay.overall_stats.win_rate,
                        games: oppDetails[oppRegion].stats.quickplay.overall_stats.games,
                        wins: oppDetails[oppRegion].stats.quickplay.overall_stats.wins,
                        loss: oppDetails[oppRegion].stats.quickplay.overall_stats.losses,
                        healing: oppDetails[oppRegion].stats.quickplay.game_stats.healing_done,
                        offAssists: oppDetails[oppRegion].stats.quickplay.game_stats.offensive_assists,
                        defAssists: oppDetails[oppRegion].stats.quickplay.game_stats.defensive_assists,
                        recAssists: oppDetails[oppRegion].stats.quickplay.game_stats.recon_assists,
                        teleDestroyed: oppDetails[oppRegion].stats.quickplay.game_stats.teleporter_pads_destroyed,
                        objTime: oppDetails[oppRegion].stats.quickplay.game_stats.objective_time,
                        melee: oppDetails[oppRegion].stats.quickplay.game_stats.melee_final_blows,
                        medals: oppDetails[oppRegion].stats.quickplay.game_stats.medals,
                        cards: oppDetails[oppRegion].stats.quickplay.game_stats.cards,
                        multikillBest: oppDetails[oppRegion].stats.quickplay.game_stats.multikill_best,
                        multikills: oppDetails[oppRegion].stats.quickplay.game_stats.multikills,
                        damageDone: oppDetails[oppRegion].stats.quickplay.game_stats.damage_done,
                        bronze: oppDetails[oppRegion].stats.quickplay.game_stats.medals_bronze,
                        silver: oppDetails[oppRegion].stats.quickplay.game_stats.medals_silver,
                        gold: oppDetails[oppRegion].stats.quickplay.game_stats.medals_gold,
                        envKills: oppDetails[oppRegion].stats.quickplay.game_stats.environmental_kills,
                        soloKills: oppDetails[oppRegion].stats.quickplay.game_stats.solo_kills,
                        onFire: oppDetails[oppRegion].stats.quickplay.game_stats.time_spent_on_fire,
                        finalBlows: oppDetails[oppRegion].stats.quickplay.game_stats.final_blows,
                        timePlayed: oppDetails[oppRegion].stats.quickplay.game_stats.time_played,
                        envDeaths: oppDetails[oppRegion].stats.quickplay.game_stats.environmental_deaths,
                        kpd: oppDetails[oppRegion].stats.quickplay.game_stats.kpd,
                        elims: oppDetails[oppRegion].stats.quickplay.game_stats.eliminations,
                        deaths: oppDetails[oppRegion].stats.quickplay.game_stats.deaths
                    },
                    most: {
                        objKills: oppDetails[oppRegion].stats.quickplay.game_stats.objective_kills_most_in_game,
                        melee: oppDetails[oppRegion].stats.quickplay.game_stats.melee_final_blows_most_in_game,
                        onFire: oppDetails[oppRegion].stats.quickplay.game_stats.time_spent_on_fire_most_in_game,
                        finalBlows: oppDetails[oppRegion].stats.quickplay.game_stats.final_blows_most_in_game,
                        defAssists: oppDetails[oppRegion].stats.quickplay.game_stats.defensive_assists_most_in_game,
                        offAssists: oppDetails[oppRegion].stats.quickplay.game_stats.offensive_assists_most_in_game,
                        healing: oppDetails[oppRegion].stats.quickplay.game_stats.healing_done_most_in_game,
                        elims: oppDetails[oppRegion].stats.quickplay.game_stats.eliminations_most_in_game,
                        soloKills: oppDetails[oppRegion].stats.quickplay.game_stats.solo_kills_most_in_game,
                        damageDone: oppDetails[oppRegion].stats.quickplay.game_stats.damage_done_most_in_game,
                        objTime: oppDetails[oppRegion].stats.quickplay.game_stats.objective_time_most_in_game
                    },
                    average: {
                        healing: oppDetails[oppRegion].stats.quickplay.average_stats.healing_done_avg,
                        elims: oppDetails[oppRegion].stats.quickplay.average_stats.eliminations_avg,
                        melee: oppDetails[oppRegion].stats.quickplay.average_stats.melee_final_blows_avg,
                        finalBlows: oppDetails[oppRegion].stats.quickplay.average_stats.final_blows_avg,
                        offAssists: oppDetails[oppRegion].stats.quickplay.average_stats.offensive_assists_avg,
                        defAssists: oppDetails[oppRegion].stats.quickplay.average_stats.defensive_assists_avg,
                        damageDone: oppDetails[oppRegion].stats.quickplay.average_stats.damage_done_avg,
                        deaths: oppDetails[oppRegion].stats.quickplay.average_stats.deaths_avg,
                        objTime: oppDetails[oppRegion].stats.quickplay.average_stats.objective_time_avg,
                        soloKills: oppDetails[oppRegion].stats.quickplay.average_stats.solo_kills_avg,
                        onFire: oppDetails[oppRegion].stats.quickplay.average_stats.time_spent_on_fire_avg,
                        objKills: oppDetails[oppRegion].stats.quickplay.average_stats.objective_kills_avg
                    }
                },
                comp: {
                    total: {
                        rate: oppDetails[oppRegion].stats.competitive.overall_stats.win_rate,
                        games: oppDetails[oppRegion].stats.competitive.overall_stats.games,
                        wins: oppDetails[oppRegion].stats.competitive.overall_stats.wins,
                        loss: oppDetails[oppRegion].stats.competitive.overall_stats.losses,
                        objKills: oppDetails[oppRegion].stats.competitive.game_stats.objective_kills,
                        healing: oppDetails[oppRegion].stats.competitive.game_stats.healing_done,
                        offAssists: oppDetails[oppRegion].stats.competitive.game_stats.offensive_assists,
                        defAssists: oppDetails[oppRegion].stats.competitive.game_stats.defensive_assists,
                        recAssists: oppDetails[oppRegion].stats.competitive.game_stats.recon_assists,
                        teleDestroyed: oppDetails[oppRegion].stats.competitive.game_stats.teleporter_pads_destroyed,
                        objTime: oppDetails[oppRegion].stats.competitive.game_stats.objective_time,
                        melee: oppDetails[oppRegion].stats.competitive.game_stats.melee_final_blows,
                        medals: oppDetails[oppRegion].stats.competitive.game_stats.medals,
                        cards: oppDetails[oppRegion].stats.competitive.game_stats.cards,
                        multikillBest: oppDetails[oppRegion].stats.competitive.game_stats.multikill_best,
                        multikills: oppDetails[oppRegion].stats.competitive.game_stats.multikills,
                        damageDone: oppDetails[oppRegion].stats.competitive.game_stats.damage_done,
                        bronze: oppDetails[oppRegion].stats.competitive.game_stats.medals_bronze,
                        silver: oppDetails[oppRegion].stats.competitive.game_stats.medals_silver,
                        gold: oppDetails[oppRegion].stats.competitive.game_stats.medals_gold,
                        envKills: oppDetails[oppRegion].stats.competitive.game_stats.environmental_kills,
                        soloKills: oppDetails[oppRegion].stats.competitive.game_stats.solo_kills,
                        onFire: oppDetails[oppRegion].stats.competitive.game_stats.time_spent_on_fire,
                        finalBlows: oppDetails[oppRegion].stats.competitive.game_stats.final_blows,
                        timePlayed: oppDetails[oppRegion].stats.competitive.game_stats.time_played,
                        envDeaths: oppDetails[oppRegion].stats.competitive.game_stats.environmental_deaths,
                        kpd: oppDetails[oppRegion].stats.competitive.game_stats.kpd,
                        elims: oppDetails[oppRegion].stats.competitive.game_stats.eliminations,
                        deaths: oppDetails[oppRegion].stats.competitive.game_stats.deaths
                    },
                    most: {
                        objKills: oppDetails[oppRegion].stats.competitive.game_stats.objective_kills_most_in_game,
                        melee: oppDetails[oppRegion].stats.competitive.game_stats.melee_final_blows_most_in_game,
                        onFire: oppDetails[oppRegion].stats.competitive.game_stats.time_spent_on_fire_most_in_game,
                        finalBlows: oppDetails[oppRegion].stats.competitive.game_stats.final_blows_most_in_game,
                        defAssists: oppDetails[oppRegion].stats.competitive.game_stats.defensive_assists_most_in_game,
                        offAssists: oppDetails[oppRegion].stats.competitive.game_stats.offensive_assists_most_in_game,
                        healing: oppDetails[oppRegion].stats.competitive.game_stats.healing_done_most_in_game,
                        elims: oppDetails[oppRegion].stats.competitive.game_stats.eliminations_most_in_game,
                        soloKills: oppDetails[oppRegion].stats.competitive.game_stats.solo_kills_most_in_game,
                        damageDone: oppDetails[oppRegion].stats.competitive.game_stats.damage_done_most_in_game,
                        objTime: oppDetails[oppRegion].stats.competitive.game_stats.objective_time_most_in_game
                    },
                    average: {
                        healing: oppDetails[oppRegion].stats.competitive.average_stats.healing_done_avg,
                        elims: oppDetails[oppRegion].stats.competitive.average_stats.eliminations_avg,
                        melee: oppDetails[oppRegion].stats.competitive.average_stats.melee_final_blows_avg,
                        finalBlows: oppDetails[oppRegion].stats.competitive.average_stats.final_blows_avg,
                        offAssists: oppDetails[oppRegion].stats.competitive.average_stats.offensive_assists_avg,
                        defAssists: oppDetails[oppRegion].stats.competitive.average_stats.defensive_assists_avg,
                        damageDone: oppDetails[oppRegion].stats.competitive.average_stats.damage_done_avg,
                        deaths: oppDetails[oppRegion].stats.competitive.average_stats.deaths_avg,
                        objTime: oppDetails[oppRegion].stats.competitive.average_stats.objective_time_avg,
                        soloKills: oppDetails[oppRegion].stats.competitive.average_stats.solo_kills_avg,
                        onFire: oppDetails[oppRegion].stats.competitive.average_stats.time_spent_on_fire_avg,
                        objKills: oppDetails[oppRegion].stats.competitive.average_stats.objective_kills_avg
                    }
                },
                heroes: {
                    playtime: {
                        ana: oppDetails[oppRegion].heroes.playtime.competitive.ana + oppDetails[oppRegion].heroes.playtime.quickplay.ana,
                        bastion: oppDetails[oppRegion].heroes.playtime.competitive.bastion + oppDetails[oppRegion].heroes.playtime.quickplay.bastion,
                        dva: oppDetails[oppRegion].heroes.playtime.competitive.dva + oppDetails[oppRegion].heroes.playtime.quickplay.dva,
                        genji: oppDetails[oppRegion].heroes.playtime.competitive.genji + oppDetails[oppRegion].heroes.playtime.quickplay.genji,
                        hanzo: oppDetails[oppRegion].heroes.playtime.competitive.hanzo + oppDetails[oppRegion].heroes.playtime.quickplay.hanzo,
                        junkrat: oppDetails[oppRegion].heroes.playtime.competitive.junkrat + oppDetails[oppRegion].heroes.playtime.quickplay.junkrat,
                        lucio: oppDetails[oppRegion].heroes.playtime.competitive.lucio + oppDetails[oppRegion].heroes.playtime.quickplay.lucio,
                        mccree: oppDetails[oppRegion].heroes.playtime.competitive.mccree + oppDetails[oppRegion].heroes.playtime.quickplay.mccree,
                        mei: oppDetails[oppRegion].heroes.playtime.competitive.mei + oppDetails[oppRegion].heroes.playtime.quickplay.mei,
                        mercy: oppDetails[oppRegion].heroes.playtime.competitive.mercy + oppDetails[oppRegion].heroes.playtime.quickplay.mercy,
                        orisa: oppDetails[oppRegion].heroes.playtime.competitive.orisa + oppDetails[oppRegion].heroes.playtime.quickplay.orisa,
                        pharah: oppDetails[oppRegion].heroes.playtime.competitive.pharah + oppDetails[oppRegion].heroes.playtime.quickplay.pharah,
                        reaper: oppDetails[oppRegion].heroes.playtime.competitive.reaper + oppDetails[oppRegion].heroes.playtime.quickplay.reaper,
                        reinhardt: oppDetails[oppRegion].heroes.playtime.competitive.reinhardt + oppDetails[oppRegion].heroes.playtime.quickplay.reinhardt,
                        roadhog: oppDetails[oppRegion].heroes.playtime.competitive.roadhog + oppDetails[oppRegion].heroes.playtime.quickplay.roadhog,
                        soldier76: oppDetails[oppRegion].heroes.playtime.competitive.soldier76 + oppDetails[oppRegion].heroes.playtime.quickplay.soldier76,
                        sombra: oppDetails[oppRegion].heroes.playtime.competitive.sombra + oppDetails[oppRegion].heroes.playtime.quickplay.sombra,
                        symmetra: oppDetails[oppRegion].heroes.playtime.competitive.symmetra + oppDetails[oppRegion].heroes.playtime.quickplay.symmetra,
                        torbjorn: oppDetails[oppRegion].heroes.playtime.competitive.torbjorn + oppDetails[oppRegion].heroes.playtime.quickplay.torbjorn,
                        tracer: oppDetails[oppRegion].heroes.playtime.competitive.tracer + oppDetails[oppRegion].heroes.playtime.quickplay.tracer,
                        widowmaker: oppDetails[oppRegion].heroes.playtime.competitive.widowmaker + oppDetails[oppRegion].heroes.playtime.quickplay.widowmaker,
                        winston: oppDetails[oppRegion].heroes.playtime.competitive.winston + oppDetails[oppRegion].heroes.playtime.quickplay.winston,
                        zarya: oppDetails[oppRegion].heroes.playtime.competitive.zarya + oppDetails[oppRegion].heroes.playtime.quickplay.zarya,
                        zenyatta: oppDetails[oppRegion].heroes.playtime.competitive.zenyatta + oppDetails[oppRegion].heroes.playtime.quickplay.zenyatta
                    }
                }
            });
            getOppDetails(oppDetails);
            console.log("Added " + oppUserName + " to MongoDB");
        }, function errorCallback(response) {
            console.log(response.error);
        });
    }


    function getOppDetails(oppDetails) {
        var oppRegion = $scope.oppRegion.toLowerCase();
        var oppPlatform = $scope.oppPlatform.toLowerCase();
        var oppUserName = $scope.oppUserInput.replace("#", "-");
        //GENERAL STATS
        $scope.oppAvatar = oppDetails[oppRegion].stats.competitive.overall_stats.avatar;
        if (oppPlatform == "pc") {
            $scope.oppUsername = oppUserName.substring(0, oppUserName.indexOf('-'));
        } else {
            $scope.oppUsername = oppUserName;
        }
        $scope.oppLevel = oppDetails[oppRegion].stats.quickplay.overall_stats.level;
        $scope.oppRank = oppDetails[oppRegion].stats.competitive.overall_stats.comprank;
        $scope.oppWinRate = oppDetails[oppRegion].stats.competitive.overall_stats.win_rate;
        $scope.oppCompWins = oppDetails[oppRegion].stats.competitive.overall_stats.wins;
        $scope.oppCompPlaytime = oppDetails[oppRegion].stats.competitive.game_stats.time_played
        $scope.oppPrestige = oppDetails[oppRegion].stats.competitive.overall_stats.prestige;
        $scope.oppTier = oppDetails[oppRegion].stats.competitive.overall_stats.tier;
        $scope.tiesOpp = oppDetails[oppRegion].stats.competitive.overall_stats.ties;

        //COMPETITIVE

        //OVERALL GAME STATS
        $scope.gamesCompOpp = oppDetails[oppRegion].stats.competitive.overall_stats.games;
        $scope.lossesCompOpp = oppDetails[oppRegion].stats.competitive.overall_stats.losses;
        $scope.totalObjKillsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.objective_kills;
        $scope.totalHealingCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.healing_done;
        $scope.totalOffAssistsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.offensive_assists;
        $scope.totalDefAssistsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.defensive_assists;
        $scope.totalRecAssistsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.recon_assists;
        $scope.totalTeleDestroyedCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.teleporter_pads_destroyed;
        $scope.totalObjTimeCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.objective_time * 3600;
        $scope.totalMeleeCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.melee_final_blows;
        $scope.totalMedalsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.medals;
        $scope.totalCardsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.cards;
        $scope.totalElimsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.eliminations;
        $scope.totalDeathsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.deaths;
        $scope.totalMultikillsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.multikills;
        $scope.totalDamageDoneCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.damage_done;
        $scope.totalBronzeCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.medals_bronze;
        $scope.totalSilverCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.medals_silver;
        $scope.totalGoldCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.medals_gold;
        $scope.totalEnvKillsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.environmental_kills;
        $scope.totalSoloKillsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.solo_kills;
        $scope.totalOnFireCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.time_spent_on_fire * 3600;
        $scope.totalFinalBlowsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.final_blows;
        $scope.totalTimePlayedCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.time_played;
        $scope.totalEnvDeathsCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.environmental_deaths;
        $scope.kpdCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.kpd;
        $scope.shieldGensDestroyedCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.shield_generators_destroyed;
        $scope.shieldGensDestroyedCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.turrets_destroyed;

        //BEST/MOST IN GAME
        $scope.multikillBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.multikill_best;
        $scope.objKillsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.objective_kills_most_in_game;
        $scope.meleeBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.melee_final_blows_most_in_game;
        $scope.onFireBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.time_spent_on_fire_most_in_game * 3600;
        $scope.finalBlowsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.final_blows_most_in_game;
        $scope.defAssistsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.defensive_assists_most_in_game;
        $scope.offAssistsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.offensive_assists_most_in_game;
        $scope.healingBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.healing_done_most_in_game;
        $scope.elimsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.eliminations_most_in_game;
        $scope.soloKillsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.solo_kills_most_in_game;
        $scope.damageDoneBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.damage_done_most_in_game;
        $scope.objTimeBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.objective_time_most_in_game * 3600;
        $scope.bestKillStreakCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.kill_streak_best;
        $scope.recAssistsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.recon_assists_most_in_game;
        $scope.shieldGensDestroyedBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.shield_generator_destroyed_most_in_game;
        $scope.turretsDestroyedBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.turrets_destroyed_most_in_game;
        $scope.envKillsBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.environmental_kills_most_in_game;
        $scope.teleDestroyedBestCompOpp = oppDetails[oppRegion].stats.competitive.game_stats.teleporter_pad_destroyed_most_in_game;

        //AVERAGE STATS
        $scope.healingAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.healing_done_avg;
        $scope.elimsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.eliminations_avg;
        $scope.meleeAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.melee_final_blows_avg;
        $scope.finalBlowsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.final_blows_avg;
        $scope.offAssistsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.offensive_assists_avg;
        $scope.defAssistsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.defensive_assists_avg;
        $scope.damageDoneAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.damage_done_avg;
        $scope.deathsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.deaths_avg;
        $scope.objTimeAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.objective_time_avg * 3600;
        $scope.soloKillsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.solo_kills_avg;
        $scope.onFireAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.time_spent_on_fire_avg * 3600;
        $scope.objKillsAvgCompOpp = oppDetails[oppRegion].stats.competitive.average_stats.objective_kills_avg;


        //QUICKPLAY
        $scope.gamesQPOpp = oppDetails[oppRegion].stats.quickplay.overall_stats.games;
        $scope.lossesQPOpp = oppDetails[oppRegion].stats.quickplay.overall_stats.losses;
        $scope.totalObjKillsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.objective_kills;
        $scope.totalHealingQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.healing_done;
        $scope.totalOffAssistsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.offensive_assists;
        $scope.totalDefAssistsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.defensive_assists;
        $scope.totalRecAssistsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.recon_assists;
        $scope.totalTeleDestroyedQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.teleporter_pads_destroyed;
        $scope.totalObjTimeQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.objective_time * 3600;
        $scope.totalMeleeQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.melee_final_blows;
        $scope.totalMedalsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.medals;
        $scope.totalCardsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.cards;
        $scope.totalElimsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.eliminations;
        $scope.totalDeathsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.deaths;
        $scope.totalMultikillsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.multikills;
        $scope.totalDamageDoneQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.damage_done;
        $scope.totalBronzeQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.medals_bronze;
        $scope.totalSilverQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.medals_silver;
        $scope.totalGoldQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.medals_gold;
        $scope.totalEnvKillsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.environmental_kills;
        $scope.totalSoloKillsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.solo_kills;
        $scope.totalOnFireQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.time_spent_on_fire * 3600;
        $scope.totalFinalBlowsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.final_blows;
        $scope.totalTimePlayedQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.time_played;
        $scope.totalEnvDeathsQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.environmental_deaths;
        $scope.kpdQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.kpd;
        $scope.shieldGensDestroyedQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.shield_generators_destroyed;
        $scope.shieldGensDestroyedQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.turrets_destroyed;
        $scope.playtimeQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.time_played;

        //BEST/MOST IN GAME
        $scope.multikillBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.multikill_best;
        $scope.objKillsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.objective_kills_most_in_game;
        $scope.meleeBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.melee_final_blows_most_in_game;
        $scope.onFireBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.time_spent_on_fire_most_in_game * 3600;
        $scope.finalBlowsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.final_blows_most_in_game;
        $scope.defAssistsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.defensive_assists_most_in_game;
        $scope.offAssistsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.offensive_assists_most_in_game;
        $scope.healingBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.healing_done_most_in_game;
        $scope.elimsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.eliminations_most_in_game;
        $scope.soloKillsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.solo_kills_most_in_game;
        $scope.damageDoneBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.damage_done_most_in_game;
        $scope.objTimeBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.objective_time_most_in_game * 3600;
        $scope.bestKillStreakQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.kill_streak_best;
        $scope.recAssistsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.recon_assists_most_in_game;
        $scope.shieldGensDestroyedBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.shield_generator_destroyed_most_in_game;
        $scope.turretsDestroyedBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.turrets_destroyed_most_in_game;
        $scope.envKillsBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.environmental_kills_most_in_game;
        $scope.teleDestroyedBestQPOpp = oppDetails[oppRegion].stats.quickplay.game_stats.teleporter_pad_destroyed_most_in_game;

        //AVERAGE STATS
        $scope.healingAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.healing_done_avg;
        $scope.elimsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.eliminations_avg;
        $scope.meleeAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.melee_final_blows_avg;
        $scope.finalBlowsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.final_blows_avg;
        $scope.offAssistsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.offensive_assists_avg;
        $scope.defAssistsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.defensive_assists_avg;
        $scope.damageDoneAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.damage_done_avg;
        $scope.deathsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.deaths_avg;
        $scope.objTimeAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.objective_time_avg * 3600;
        $scope.soloKillsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.solo_kills_avg;
        $scope.onFireAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.time_spent_on_fire_avg * 3600;
        $scope.objKillsAvgQPOpp = oppDetails[oppRegion].stats.quickplay.average_stats.objective_kills_avg;

        oppCall = true;
        if (oppCall == true && myCall == true) {
            compareDetails();
            $scope.hideCompare = false;
            $scope.hideLoaderCompare = false;
            $scope.comparison = true;
        }
        // var oppTier = $scope.oppTier;
        // getRankImage(oppTier);
        $scope.oppUserInput = '';
        $scope.hideStats = false;
    }

    function getRankImage(myTier) {
        if (myTier == "bronze") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-1.png";
        } else if (myTier == "silver") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-2.png";
        } else if (myTier == "gold") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png";
        } else if (myTier == "platinum") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-4.png";
        } else if (myTier == "diamond") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-5.png";
        } else if (myTier == "master") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-6.png";
        } else if (myTier == "grandmaster") {
            $scope.tierImage = "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-7.png";
        }
        $scope.hideLoader = true;
    }

    function compareDetails() {

        //GENERAL
        $scope.compareRank = calculateStatsInt($scope.myRank, $scope.oppRank);
        $scope.compareWinRate = calculateStatsFloat($scope.myWinRate, $scope.oppWinRate);
        $scope.compareGames = calculateStatsInt($scope.gamesComp, $scope.gamesCompOpp);
        $scope.compareWins = calculateStatsInt($scope.myCompWins, $scope.oppCompWins);
        $scope.compareTies = calculateStatsInt($scope.ties, $scope.tiesOpp);
        $scope.compareLosses = calculateStatsInt($scope.lossesComp, $scope.lossesCompOpp);
        $scope.compareElims = calculateStatsInt($scope.totalElimsComp, $scope.totalElimsCompOpp);
        $scope.compareKPD = calculateStatsFloat($scope.kpdComp, $scope.kpdCompOpp);
        $scope.comparePlaytime = calculateStatsFloat($scope.myCompPlaytime, $scope.oppCompPlaytime);
        $scope.compareFinalBlows = calculateStatsInt($scope.totalFinalBlowsComp, $scope.totalFinalBlowsCompOpp);
        $scope.compareDamageDone = calculateStatsInt($scope.totalDamageDoneComp, $scope.totalDamageDoneCompOpp);
        $scope.compareMultikills = calculateStatsInt($scope.totalMultikillsComp, $scope.totalMultikillsCompOpp);
        $scope.compareMedals = calculateStatsInt($scope.totalMedalsComp, $scope.totalMedalsCompOpp);
        $scope.compareCards = calculateStatsInt($scope.totalCardsComp, $scope.totalCardsCompOpp);
        $scope.compareHealing = calculateStatsInt($scope.totalHealingComp, $scope.totalHealingCompOpp);

        //AVERAGE
        $scope.compareElimsAvg = calculateStatsInt($scope.elimsAvgComp, $scope.elimsAvgCompOpp);
        $scope.compareDeathsAvg = calculateStatsInt($scope.deathsAvgComp, $scope.deathsAvgCompOpp);
        $scope.compareDamageAvg = calculateStatsInt($scope.damageDoneAvgComp, $scope.damageDoneAvgCompOpp);
        $scope.compareHealingAvg = calculateStatsInt($scope.healingAvgComp, $scope.healingAvgCompOpp);
        $scope.compareFinalBlowsAvg = calculateStatsInt($scope.finalBlowsAvgComp, $scope.finalBlowsAvgCompOpp);
        $scope.compareObjKillsAvg = calculateStatsInt($scope.objKillsAvgComp, $scope.objKillsAvgCompOpp);
        $scope.compareObjTimeAvg = calculateStatsFloat($scope.objTimeAvgComp, $scope.objTimeAvgCompOpp);

        //BEST
        $scope.compareElimsBest = calculateStatsInt($scope.elimsBestComp, $scope.elimsBestCompOpp);
        $scope.compareMultikillBest = calculateStatsInt($scope.multikillBestComp, $scope.multikillBestCompOpp);
        $scope.compareDamageBest = calculateStatsInt($scope.damageDoneBestComp, $scope.damageDoneBestCompOpp);
        $scope.compareHealingBest = calculateStatsInt($scope.healingBestComp, $scope.healingBestCompOpp);
        $scope.compareFinalBlowsBest = calculateStatsInt($scope.finalBlowsBestComp, $scope.finalBlowsBestCompOpp);
        $scope.compareObjKillsBest = calculateStatsInt($scope.objKillsBestComp, $scope.objKillsBestCompOpp);
        $scope.compareObjTimeBest = calculateStatsFloat($scope.objTimeBestComp, $scope.objTimeBestCompOpp);
        $scope.hideLoaderCompare = true;
    }

    function calculateStatsInt(myStat, oppStat) {
        var int = parseInt(myStat) - parseInt(oppStat);
        return int;
    }

    function calculateStatsFloat(myStat, oppStat) {
        var float = parseFloat(myStat) - parseFloat(oppStat);
        return float;
    }


}).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('compareTheme')
        .primaryPalette('cyan')
        .accentPalette('amber')
        .warnPalette('green');
});;
