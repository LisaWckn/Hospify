const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Datenbank-Konfigurationsdetails
const dbConfig = {
  user: 'ndreier',
  password: 'froehlichBuntesPasswort',
  connectString: '(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=rs03-db-inf-min.ad.fh-bielefeld.de)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))'
};

// Initialisierung des Oracle-Clients
oracledb.initOracleClient({});

/**
 * Führt eine SQL-Abfrage aus und gibt die Ergebnisse zurück.
 * @route POST /executeQuery
 * @param {Object} req - Die Anforderungsobjekte, die die SQL-Abfrage im Body enthalten.
 * @param {string} req.body.query - Die auszuführende SQL-Abfrage.
 * @param {Object} res - Das Antwortobjekt, das die Ergebnisse der Abfrage oder eine Fehlermeldung zurückgibt.
 * @return {Object} - Die Ergebnisse der SQL-Abfrage als JSON.
 */
app.post('/executeQuery', async (req, res) => {
  const query = req.body.query;
  let connection;
  console.log();
  console.log(query);

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

/**
 * Führt eine SQL-Insert-Abfrage aus und gibt die Anzahl der betroffenen Zeilen zurück.
 * @route POST /executeInsert
 * @param {Object} req - Die Anforderungsobjekte, die die SQL-Insert-Abfrage im Body enthalten.
 * @param {string} req.body.query - Die auszuführende SQL-Insert-Abfrage.
 * @param {Object} res - Das Antwortobjekt, das die Anzahl der betroffenen Zeilen oder eine Fehlermeldung zurückgibt.
 * @return {Object} - Die Anzahl der betroffenen Zeilen als JSON.
 */
app.post('/executeInsert', async (req, res) => {
  const { query } = req.body;
  let connection;
  console.log();
  console.log(query);

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, [], { autoCommit: true });
    res.json({ rowsAffected: result.rowsAffected });
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Function to execute the stored procedure
async function executeStoredProcedure(query) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      query,
      {
        p_cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.p_cursor;
    const rows = [];
    let row;
    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }
    await resultSet.close();

    return rows;
  } catch (error) {
    console.error('Error executing procedure:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// API endpoint to call the stored procedure
app.post('/executeProcedure', async (req, res) => {
  const query = req.body.query;

  try {
    const result = await executeStoredProcedure(query);
    res.json(result);
  } catch (err) {
    res.status(500).send("ERROR executing: " + query +err.message);
  }
});

// Function to execute the insert stored procedure
async function executeInsertStoredProcedure(query) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      query
    );

    return [];
  } catch (error) {
    console.error('Error executing procedure:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// API endpoint to call the insert stored procedure
app.post('/executeInsertProcedure', async (req, res) => {
  const query = req.body.query;

  try {
    const result = await executeInsertStoredProcedure(query);
    res.json(result);
  } catch (err) {
    res.status(500).send("ERROR executing: " + query +err.message);
  }
});


// Startet den Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
