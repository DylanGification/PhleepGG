'use strict';
angular.module('phleepApp')
    .controller('MainCtrl', function($scope, $http, socket) {

        $http.get('/api/overwatchs').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('overwatch', $scope.awesomeThings);
        });

        $scope.deleteThing = function(overwatch) {
            $http.delete('/api/overwatchs/' + overwatch._id);
        };

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('overwatch');
        });


        // var apiURL = "http://ec2-34-252-173-0.eu-west-1.compute.amazonaws.com:4444";
        var apiURL = "https://owapi.net";
        var LOL_API_KEY = "api_key=690b6aa5-4f70-4eac-8d8c-808bd08ead0c";

        $scope.myPlatforms = ["pc", "xbl", "psn"];
        $scope.myRegions = ["eu", "us", "kr", "any"];
        $scope.oppPlatforms = ["pc", "xbl", "psn"];
        $scope.oppRegions = ["eu", "us", "kr", "any"];

        //League of Legends Regions
        $scope.myLoLRegions = ["euw", "na", "kr", "ru", "eune", "oce", "tr", "jp", "br", "las"];
        $scope.oppLoLRegions = ["euw", "na", "kr", "ru", "eune", "oce", "tr", "jp", "br", "las"];


        //My details
        var myDetails = [];
        var myAchievements = [];
        $scope.myUserInput = "";

        //Opponent details
        var oppDetails = [];
        var rankedMatch = [];
        var unrankedMatch = [];
        var leagueStats = [];
        var profileStats = [];
        $scope.hideStats = false;
        var userID;
        var num = 0;

        $scope.gatherData = function() {
            console.log("initial num " + num);
            $http({
                method: 'GET',
                url: "http://127.0.0.1:8080/pc_t3.json",
                type: 'json'
            }).then(function successCallback(response) {
                var tempmyDetails = response.data;
                // console.log(tempmyDetails);
                var myUserInput = tempmyDetails[num].Username;
                var myUserName = myUserInput.replace("#", "-");
                var myRegion = "eu";
                // var myPlatform = $scope.platform;
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
            var myUserName = $scope.myUserInput.replace("#", "-");
            var myRegion = $scope.myRegion;
            var myPlatform = $scope.myPlatform;
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
                url: "http://127.0.0.1:8080/leagueKR_t1.json",
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


        function getMyDetails(myDetails) {
            var myRegion = $scope.myRegion;
            var myPlatform = $scope.myPlatform;
            var myUserName = $scope.myUserInput.replace("#", "-");
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
            var myTier = $scope.myTier;
            getRankImage(myTier);
            $scope.myUserInput = '';
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
        }
    });
