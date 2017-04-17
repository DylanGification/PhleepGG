'use strict';

var _ = require('lodash');
var Overwatch = require('./overwatch.model');

// Get list of things
exports.index = function(req, res) {
  Overwatch.find(function (err, overwatchs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(overwatchs);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Overwatch.findById(req.params.id, function (err, overwatch) {
    if(err) { return handleError(res, err); }
    if(!overwatch) { return res.status(404).send('Not Found'); }
    return res.json(overwatch);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Overwatch.create(req.body, function(err, overwatch) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(overwatch);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Overwatch.findById(req.params.id, function (err, overwatch) {
    if (err) { return handleError(res, err); }
    if(!overwatch) { return res.status(404).send('Not Found'); }
    var updated = _.merge(overwatch, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(overwatch);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Overwatch.findById(req.params.id, function (err, overwatch) {
    if(err) { return handleError(res, err); }
    if(!overwatch) { return res.status(404).send('Not Found'); }
    overwatch.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
