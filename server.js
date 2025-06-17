const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة بيانات MongoDB Atlas
mongoose.connect('mongodb+srv://aslem9542:aHmedBk93@cluster0.nfheoen.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// تعريف نموذج الإدخالات
const entrySchema = new mongoose.Schema({
  model: String,
  data: Object
});
const Entry = mongoose.model('Entry', entrySchema);

// إضافة إدخال جديد
app.post('/api/entries', async (req, res) => {
  const { model, data } = req.body;
  const entry = new Entry({ model, data });
  await entry.save();
  res.json({ ok: true });
});

// جلب كل الإدخالات لنموذج معين
app.get('/api/entries', async (req, res) => {
  const { model } = req.query;
  const entries = await Entry.find({ model });
  res.json(entries.map(e => e.data));
});

// حذف إدخال (اختياري)
app.delete('/api/entries/:id', async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));