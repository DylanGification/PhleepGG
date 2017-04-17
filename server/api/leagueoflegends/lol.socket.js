'use strict';

var lol = require('./lol.model');

exports.register = function(socket) {
  lol.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  lol.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('lol:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('lol:remove', doc);
}