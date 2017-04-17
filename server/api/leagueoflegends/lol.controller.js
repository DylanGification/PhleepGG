'use strict';

var _ = require('lodash');
var League = require('./lol.model');

// Get list of things
exports.index = function(req, res) {
  League.find(function (err, leagues) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(leagues);
  });
};

// Get a single thing
exports.show = function(req, res) {
  League.findById(req.params.id, function (err, league) {
    if(err) { return handleError(res, err); }
    if(!league) { return res.status(404).send('Not Found'); }
    return res.json(league);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  League.create(req.body, function(err, league) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(league);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  League.findById(req.params.id, function (err, league) {
    if (err) { return handleError(res, err); }
    if(!league) { return res.status(404).send('Not Found'); }
    var updated = _.merge(league, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(league);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  League.findById(req.params.id, function (err, league) {
    if(err) { return handleError(res, err); }
    if(!league) { return res.status(404).send('Not Found'); }
    league.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
