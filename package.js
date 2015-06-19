Package.describe({
  name: "emgee:mssql",
  summary: "mssql wrapper: non-reactive SQL Server package",
  version: "1.3.0_8",
  git: "https://github.com/emgee3/meteor-mssql.git",
  documentation: "README.md"
});

Npm.depends({ "mssql" : "1.3.0" });

Package.onUse(function(api) {
  api.versionsFrom("1.0.3.1");
  api.versionsFrom("1.1.0.2");
  api.use('underscore', 'server');
  api.addFiles("mssql.js", "server");
  api.export("Sql", "server");
});
