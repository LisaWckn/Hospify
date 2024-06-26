const oracledb = require('oracledb');
const express = require('express');
const app = express();
const port = 3000;

const dbConfig = {
  user: 'ndreier',
  password: 'kekseBackvereinEV',
  connectString: '(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=rs03-db-inf-min.ad.fh-bielefeld.de)(PORT=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))'
};

oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_4' });

app.get('/data', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT name FROM MITARBEITER');
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
