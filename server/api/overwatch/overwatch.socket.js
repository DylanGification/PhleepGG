'use strict';

var overwatch = require('./overwatch.model');

exports.register = function(socket) {
  overwatch.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  overwatch.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('overwatch:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('overwatch:remove', doc);
}