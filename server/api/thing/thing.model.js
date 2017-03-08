'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
    name: String,
    level: Number,
    rank: String,
    avatar: String,
    prestige: Number,
    qp: {
        total: {
            objKills: Number,
            rate: Number,
            games: Number,
            wins: Number,
            loss: Number,
            healing: Number,
            offAssists: Number,
            defAssists: Number,
            recAssists: Number,
            objTime: Number,
            melee: Number,
            medals: Number,
            cards: Number,
            multikillBest: Number,
            multikills: Number,
            damageDone: Number,
            bronze: Number,
            silver: Number,
            gold: Number,
            envKills: Number,
            soloKills: Number,
            onFire: Number,
            finalBlows: Number,
            timePlayed: Number,
            envDeaths: Number,
            kpd: Number,
            elims: Number,
            deaths: Number
        },
        most: {
            objKills: Number,
            melee: Number,
            onFire: Number,
            finalBlows: Number,
            defAssists: Number,
            offAssists: Number,
            healing: Number,
            elims: Number,
            soloKills: Number,
            damageDone: Number,
            objTime: Number
        },
        average: {
            healing: Number,
            elims: Number,
            melee: Number,
            finalBlows: Number,
            offAssists: Number,
            defAssists: Number,
            damageDone: Number,
            deaths: Number,
            objTime: Number,
            soloKills: Number,
            onFire: Number,
            objKills: Number
        }
    },
    comp: {
        total: {
        	rate: Number,
        	games: Number,
            wins: Number,
            loss: Number,
            objKills: Number,
            healing: Number,
            offAssists: Number,
            defAssists: Number,
            recAssists: Number,
            objTime: Number,
            melee: Number,
            medals: Number,
            cards: Number,
            multikillBest: Number,
            multikills: Number,
            damageDone: Number,
            bronze: Number,
            silver: Number,
            gold: Number,
            envKills: Number,
            soloKills: Number,
            onFire: Number,
            finalBlows: Number,
            timePlayed: Number,
            envDeaths: Number,
            kpd: Number,
            elims: Number,
            deaths: Number
        },
        most: {
            objKills: Number,
            melee: Number,
            onFire: Number,
            finalBlows: Number,
            defAssists: Number,
            offAssists: Number,
            healing: Number,
            elims: Number,
            soloKills: Number,
            damageDone: Number,
            objTime: Number
        },
        average: {
            healing: Number,
            elims: Number,
            melee: Number,
            finalBlows: Number,
            offAssists: Number,
            defAssists: Number,
            damageDone: Number,
            deaths: Number,
            objTime: Number,
            soloKills: Number,
            onFire: Number,
            objKills: Number
        }
    }
    // info: String,
    // active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);
