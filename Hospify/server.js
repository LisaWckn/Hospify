const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

const dbConfig = {
  user: 'ndreier',
  password: 'kekseBackvereinEV',
  connectString: '(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=rs03-db-inf-min.ad.fh-bielefeld.de)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))'
};

oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_4' });

app.post('/query', async (req, res) => {
  let connection;

  try {
    const query = req.body.query;
    if (!query) {
      return res.status(400).send('Query string is required');
    }

    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.post('/insert', async (req, res) => {
  let connection;
  console.log("insert");

  try {
    const query = req.body.query;
    if (!query) {
      return res.status(400).send('INPUT string is required');
    }

    console.log('Executing insert:', query);
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, [], { autoCommit: true });
    console.log('Insert result:', result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
