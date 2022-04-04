import { Router } from 'express';

const router = Router();

router.post('/download-item', async (req, res) => {
  console.log('hits download-item', req.body);
  const { data, filename } = req.body;
  console.log('data, filename: ', data, filename);
  try {
    res.set({
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Type': 'text/plain'
    });
    res.send(data);
  } catch (e) {
    console.log(`Failed to download ${filename}`);
  }
});

export default router;
