/**
 * Executes a keep-alive query to keep the connection alive. The interval can
 * be set via DB_PING environment variable in seconds.
 *
 * @param connection defines the database connection to use
 * @param interval   defines the ping interval in seconds
 */

function create_pinger(connection, interval, sql) {
  interval = (interval || 60) * 1000;
  sql = 'SELECT 1';
  var interval_id;

  function ping() {
    console.log(new Date(), 'execute keep-alive query...');
    connection.query(sql)
      .on('error', function(err) {
        console.error(new Date(), 'keep-alive error', err.code);
      })
      .on('end', function() {
        console.log(new Date(), 'keep-alive ok');
      });
  }

  function start() {
    if (connection) {
      interval_id = setInterval(ping, interval);
    }
    return this;
  }

  function stop() {
    if (interval_id) clearInterval(interval_id);
    interval_id = undefined;
    return this;
  }

  /**
   * Sets connection and starts the ping interval
   */
  function set_connection(conn) {
      stop();
      connection = conn;
      return this;
  }

  return {
    set_connection: set_connection,
    start: start,
    stop: stop
  };
}

module.exports.create_pinger = create_pinger;
