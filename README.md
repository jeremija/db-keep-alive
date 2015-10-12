# db-keep-alive

Executes a keep-alive query through a database connection object every `n`
seconds. Tested with `mysql` module.

The default query is set to:

```
SELECT 1
```

# Usage

```javascript
// execute every 60 seconds
var pinger = require('db-keep-alive').create_pinger(connection, 60, 'SELECT 1');

// start the interval timeout
pinger.start();

// stop the interval timeout
pinger.stop();

// change the underlying connection and start
pinger.set_connection(connection2).start();
```
