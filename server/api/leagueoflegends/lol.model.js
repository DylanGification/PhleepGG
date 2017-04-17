'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LeagueSchema = new Schema({
    name: String,
    tier: String,
    division: String,
    leaguePoints: Number,
    profileIconId: Number,
    ranked5x5: {
        wins: Number,
        losses: Number,
        aggregatedStats: {
            totalKills: Number,
            totalCS: Number,
            totalTurretKills: Number,
            totalNeutralMinionKills: Number,
            totalAssists: Number
        }
    },
    unranked5x5: {
        wins: Number,
        aggregatedStats: {
            totalKills: Number,
            totalCS: Number,
            totalTurretKills: Number,
            totalNeutralMinionKills: Number,
            totalAssists: Number
        }
    },
    stats: {
        loss: Number,
        wins: Number,
        kills: Number,
        killingSpree: Number,
        totalDamageDealt: Number,
        totalDamageTaken: Number,
        mostKillsPerGame: Number,
        totalCS: Number,
        totalDoubleKills: Number,
        totalTripleKills: Number,
        totalQuadraKills: Number,
        totalPentaKills: Number,
        totalUnrealKills: Number,
        totalDeaths: Number,
        totalGoldEarned: Number,
        totalTurretsKilled: Number,
        totalPhysicalDamageDealt: Number,
        totalMagicDamageDealt: Number,
        totalNeutralMinionsKilled: Number,
        totalFirstBlood: Number,
        totalAssists: Number,
        totalHeal: Number,
        maxLargestKillingSpree: Number,
        maxChampionsKilled: Number,
        maxNumDeaths: Number,
        maxTimePlayed: Number,
        maxTimeSpentLiving: Number
    }
});

module.exports = mongoose.model('League', LeagueSchema);
