Package.describe({
  name: "emgee:mssql",
  summary: "mssql wrapper: non-reactive SQL Server package",
  version: "3.3.0",
  git: "https://github.com/emgee3/meteor-mssql.git",
  documentation: "README.md"
});

Npm.depends({ "mssql" : "3.3.0" });

Package.onUse(function(api) {
  api.versionsFrom("1.4.0.1");
  api.use('underscore', 'server');
  api.addFiles("mssql.js", "server");
  api.export("Sql", "server");
});
