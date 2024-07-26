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

app.post('/executePLSQLBlock', async (req, res) => {
  const { bettID } = req.body;

  const plsqlQuery = `
    BEGIN
      DECLARE
        v_bettID NUMBER := :bettID;
        v_einsatzbereit NUMBER;
      BEGIN
        SELECT einsatzbereit INTO v_einsatzbereit FROM bett WHERE bettID = v_bettID;

        IF v_einsatzbereit = 1 THEN
          INSERT INTO bett_log (bettID, status, timestamp)
          VALUES (v_bettID, 'Einsatzbereit', SYSDATE);
        ELSE
          INSERT INTO bett_log (bettID, status, timestamp)
          VALUES (v_bettID, 'Nicht einsatzbereit', SYSDATE);
        END IF;
      END;
    END;
  `;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(plsqlQuery, { bettID: bettID });
    await connection.commit();
    res.send('PL/SQL block executed successfully');
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

// Startet den Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
