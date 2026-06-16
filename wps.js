// Vercel Serverless Function — MES 代理中继
// 部署后访问 https://xxx.vercel.app/api/wps

const MES_URL = 'http://120.253.69.51:8091/wjlweb/wap/jlrw/wr001/query.do';
const AUTH_TOKEN = '1234567890';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body;

  if (!body || body.token !== AUTH_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const mesResp = await fetch(MES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ param: body.params }),
    });

    const data = await mesResp.text();
    res.status(200).setHeader('Content-Type', 'application/json').send(data);
  } catch (e) {
    res.status(502).json({ error: 'MES 请求失败: ' + e.message });
  }
}
