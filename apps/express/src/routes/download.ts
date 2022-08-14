import { Router } from 'express';

const router = Router();

router.post('/download-item', async (req, res) => {
  const { data, filename } = req.body;
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
