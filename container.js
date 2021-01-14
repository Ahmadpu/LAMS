// Dependable
var dependable = require('dependable');
// Creating Container 
var container = dependable.container();
var path = require('path');
var mongoose = require('mongoose');

var simpleDependencies = [
  ['_', 'lodash'],
  ['passport', 'passport'],
  ['formidable', 'formidable'],
  ['path', 'path'],
  ['async', 'async'],
  // Users
  ['User', './models/user-model'],
  ['mongoose', 'mongoose'],
  ['CaseRequest', './models/case_request'],
  ['Blog', './models/blog-model'],
  ['Lawyer', './models/lawyer-model']
];

simpleDependencies.forEach(function(dependency){
  container.register(dependency[0], function(){
    return require(dependency[1]);
  });
});

container.load(path.join(__dirname, "/helpers"));
container.load(path.join(__dirname, "/controllers"));

container.register('container', function(){
  return container;
});

module.exports = container;
