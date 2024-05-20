const Payhist = require('../models/payhist');
const payhistController = {
  createRecord: (req, res) => {
    const recordData = req.body;
    Pay_hist.createRecord(recordData, (err, recordId) => {
      if (err) {
        console.error('Error creating record:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ recordId });
    });
  },
  getRecordById: (req, res) => {
    const { id } = req.params;
    Pay_hist.getRecordById(id, (err, record) => {
      if (err) {
        console.error('Error fetching record:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json(record);
    });
  },
// removed request parameter from getALLRecords , as req was declared but never used in the below code .
  getAllRecords: (req,res) => {
    Payhist.getAllRecords((err, records) => {
      if (err) {
        console.error('Error fetching records:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(records);
    });
  },
  updateRecordById: (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    Payhist.updateRecordById(id, newData, (err, success) => {
      if (err) {
        console.error('Error updating record:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!success) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json({ message: 'Record updated successfully' });
    });
  },
  deleteRecordById: (req, res) => {
    const { id } = req.params;
    Payhist.deleteRecordById(id, (err, success) => {
      if (err) {
        console.error('Error deleting record:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!success) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json({ message: 'Record deleted successfully' });
    });
  }
};
module.exports = payhistController;