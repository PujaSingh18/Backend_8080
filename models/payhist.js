const pool = require('../db');
const Payhist = {
  createRecord: (recordData, callback) => {
    const { Name, Amount , received_from , Paid_to , t_date } = recordData;
    const sql = `
    INSERT INTO pay_hist ( Name, Amount , received_from , Paid_to , t_date)
      VALUES (?, ?, ?, ?, ?)`;
    const values = [Name, Amount , received_from , Paid_to , t_date];
    pool.query(sql, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.insertId);
    });
  },
  getRecordById: (recordId, callback) => {
    const sql = `SELECT * FROM pay_hist WHERE id = ?`;
    const values = [recordId];
    pool.query(sql, values, (err, rows) => {
      if (err) {
        return callback(err);
      }
      if (rows.length === 0) {
        return callback(null, null); // Record not found
      }
      return callback(null, rows[0]);
    });
  },
  getAllRecords: (callback) => {
    const sql = `SELECT * FROM pay_hist`;
    pool.query(sql, (err, rows) => {
      if (err) {
        return callback(err);
      }
      return callback(null, rows);
    });
  },
  updateRecordById: (recordId, newData, callback) => {
    const { Name, Amount , received_from , Paid_to , t_date } = newData;
    const sql = `
    UPDATE pay_hist SET Name = ?, Amount = ?, received_from = ?, Paid_to = ? , t_date = ? WHERE id = ?
    `;
    const values = [Name, Amount , received_from , Paid_to , t_date, recordId];
    pool.query(sql, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.affectedRows > 0); // Return true if updated successfully
    });
  },
  deleteRecordById: (recordId, callback) => {
    const sql = `DELETE FROM pay_hist WHERE id = ?`;
    const values = [recordId];
    pool.query(sql, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.affectedRows > 0); // Return true if deleted successfully
    });
  }
};
module.exports = Payhist;