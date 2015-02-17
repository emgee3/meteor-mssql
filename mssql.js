var sql = Npm.require('mssql');

Sql = {};

Sql.driver = sql;

if (! Meteor.settings.database ||
    ! Meteor.settings.database.user ||
    ! Meteor.settings.database.password ||
    ! Meteor.settings.database.database) {
  console.error('mssql: Database unconfigured');
} else {
  Sql.connection = new Sql.driver.Connection(Meteor.settings.database, function (err) {
    if (err) console.log("Can't connect to database");
  });
}



Sql.q = function (query, opts) {
  var request = new sql.Request(Sql.connection);
  var myRequest = Meteor.wrapAsync(request.query, request);
  return myRequest(query);
}



Sql.ps = Meteor.wrapAsync(prepareStatement);

function prepareStatement (opts, cb) {

  var request = new sql.PreparedStatement(Sql.connection);

  _.each(opts.inputs, function (v, k) {
    request.input(k, v);
  });

  request.prepare(opts.query, function (err, res) {
    if (err) return cb(err);

    var preparedStatement = Meteor.wrapAsync(request.execute, request);
    preparedStatement.unprepare = request.unprepare;

    return cb(null, preparedStatement);
  });
}



Sql.sp = Meteor.wrapAsync(storedProcedure);

function storedProcedure (opts, cb) {
  var request = new sql.Request(Sql.connection);

  _.each(opts.inputs, function (i) {
    request.input(i.name, i.type, i.value);
  });

  _.each(opts.outputs, function (name, type) {
    request.output(name, type);
  });

  request.execute(opts.sp, function(err, recordsets, returnValue) {
    return cb(err, recordsets)
  });
}
