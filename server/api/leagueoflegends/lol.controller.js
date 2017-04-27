'use strict';

var _ = require('lodash');
var League = require('./lol.model');
var http = require('http');
 var LOL_API_KEY = "api_key=690b6aa5-4f70-4eac-8d8c-808bd08ead0c";

// Get list of things
exports.index = function(req, res) {
    League.find(function(err, leagues) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(leagues);
    });
};

// Get a single thing
exports.show = function(req, res) {
    League.findById(req.params.id, function(err, league) {
        if (err) {
            return handleError(res, err);
        }
        if (!league) {
            return res.status(404).send('Not Found');
        }
        return res.json(league);
    });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    League.create(req.body, function(err, league) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(league);
    });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
    if (req.body._id) { delete req.body._id; }
    League.findById(req.params.id, function(err, league) {
        if (err) {
            return handleError(res, err);
        }
        if (!league) {
            return res.status(404).send('Not Found');
        }
        var updated = _.merge(league, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(league);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    League.findById(req.params.id, function(err, league) {
        if (err) {
            return handleError(res, err);
        }
        if (!league) {
            return res.status(404).send('Not Found');
        }
        league.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};


exports.getLOLDetails = function(req, lolRes) {
    console.log(req.body);
    var myLOLRegion = req.body.region;
    var myUserName = req.body.username;
    http({
        method: 'GET',
        url: "https://" + myLOLRegion + "1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + myUserName + "?" + LOL_API_KEY,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function successCallback(response) {
            myDetails = response.data;
            userID = myDetails.id;
            http({
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
                    http({
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
                            http({
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
                                // $scope.getMyLOLDetails(myDetails, rankedMatch, unrankedMatch, leagueStats, profileDetails);
                                lolRes.status(200).json({
                                    myDetails: myDetails,
                                    rankedMatch: rankedMatch,
                                    unrankedMatch: unrankedMatch,
                                    leagueStats: leagueStats,
                                    profileDetails: profileDetails
                                });
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

function handleError(res, err) {
    return res.status(500).send(err);
}
