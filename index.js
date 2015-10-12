/**
 * Executes a keep-alive query to keep the connection alive. The interval can
 * be set via DB_PING environment variable in seconds.
 *
 * @param connection defines the database connection to use
 * @param interval   defines the ping interval in seconds
 * @param sql        custom SQL query to execute, defaults to `SELECT 1`
 */

function create_pinger(connection, interval, sql) {
  interval = (interval || 60) * 1000;
  sql = 'SELECT 1';
  var interval_id;
  var log_enabled;

  function ping() {
    if (log_enabled) {
      console.log(new Date(), 'execute keep-alive query...');
    }
    connection.query(sql)
      .on('error', function(err) {
        if (log_enabled) {
          console.error(new Date(), 'keep-alive error', err.code);
        }
      })
      .on('end', function() {
        if (log_enabled) {
          console.log(new Date(), 'keep-alive ok');
        }
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

  function enable_log() {
    log_enabled = true;
    return this;
  }
  function disable_log() {
    log_enabled = false;
    return this;
  }

  return {
    set_connection: set_connection,
    start: start,
    stop: stop,
    enable_log: enable_log,
    disable_log: disable_log
  };
}

module.exports.create_pinger = create_pinger;
