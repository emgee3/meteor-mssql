# `mssql` for Meteor

A wrapper for the [mssql](https://github.com/patriksimek/node-mssql) node
library. Provides non-reactive queries against a Microsoft SQL Server. The
wrapper provides three `Meteor.wrapAsync` functions, although but the `mssql`
library is exported as `Sql.driver` server-side, so any feature in the `mssql`
library can be called.

The API is available as `Sql` and is available server-side only. Wrap in a
method to deliver results to the client.

## Settings

Database connection settings are pulled from `Meteor.settings`, using the
following keys:

```json
    {
      "database": {
        "server"   : "192.168.1.1",
        "database" : "database",
        "user"     : "username",
        "password" : "password",
        "options"  : {
          "useUTC"     : false,
          "appName"    : "MeteorApp"
        }
      }
    }
```

*Note with Azure MSSQL DBAAS*
Azure requires an encrypted connection, so under `options` you will need to add `"encrypt":true` for it to work. 

## API

### `Sql.driver` — `mssql` npm module

### `Sql.connection` — Current database connection

### `Sql.q` — Query

This allows a query to directly be run against the database. For SQL
injection purposes, this should rarely be done and should be specified with
inputs, which offers some protection. Better is a prepared statement, or
stored procedure.

##### Params:
```javascript
(query : String, inputs : [ { name : 'param1', type : Sql.driver.TYPE, value : 'My Value' }, ... ], optionalCallback)
or
(query : String, inputs : { myParam1 : 'My Value', paramNumba2 : 'This val', ... }, optionalCallback)
```

```javascript
    // Sync-style
    try {
      var res = Sql.q(query);
    } catch (e) {
    }

    // Sync-style with inputs
    try {
      var res = Sql.q(query, [
        { name : 'param1', type : Sql.driver.NVarChar, value : 'My Value' },
        { name : 'param2', type : Sql.driver.NVarChar, value : 'My Value' },
        { name : 'param3', type : Sql.driver.NVarChar, value : 'My Value' },
      ]);
    } catch (e) {
    }

    // Async-style
    Sql.q(query, function (err, res) {

    });

    // Async-style with inputs
    Sql.q(query, { name : 'param1', type : Sql.driver.NVarChar, value : 'My Value' }, function (err, res) {

    });
```


### `Sql.ps` - Prepared Statement

##### Params:
```javascript
({ query : String, inputs : { param1 : Sql.driver.TYPE, ..., paramN : Sql.driver.TYPE } }, optionalCallback)
```

> Prepared statements are resilient against SQL injection, because parameter values,
> which are transmitted later using a different protocol, need not be correctly escaped.
> If the original statement template is not derived from external input, SQL injection
> cannot occur. [Wikipedia](http://en.wikipedia.org/wiki/Prepared_statement)

Using a prepared statement will help avoid a [Bobby Tables](http://xkcd.com/327/) situation. It also
caches the query plan, so you can call the query multiple times. It is slower for a single query,
but faster if it is called multiple times.

When using a prepared statement, you must use tokens in your query for parameters, and
assign [types](https://github.com/patriksimek/node-mssql#data-types) to those parameters.

Calling `Sql.ps` prepares a SQL query. Meaning, it will return a function that will execute the
prepared statement. That function has a method that will unprepare the statement, namely
`unprepare()`.

#### Example:

```javascript
    var opts = {
      query : "select * from table where name = @firstname",
      inputs : {
        firstname : Sql.driver.NVarChar
      }
    }

    // Sync-style
    try {
      var query = Sql.ps(opts);
    } catch (e) {
      ...
    }

    var result  = query({ firstname : "Bob" });
    var result2 = query({ firstname : "John" });

    query.unprepare();
```


### `Sql.sp` - Stored Procedure

##### Params:
```javascript
({ sp : String, inputs : [ { name : String, type : Sql.driver.TYPE, value : val }, ... ], outputs : { key : value } }, optionalCallback)
```

```javascript
    var opts = {
      sp : "SP_name",
      inputs : [ {
        name  : "param1",
        type  : Sql.driver.Int,
        value : 42
        }, ...
      ],
      outputs : {
        output1 : Sql.driver.Int,
        ...
      }
    }

    // Sync-style
    try {
      var res = Sql.sp(opts);
    } catch (e) {
    }

    // Async-style
    Sql.sp(opts, function (err, res) {

    });
```
