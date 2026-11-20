module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({
      success: false,
      message: 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Vercel Environment Variables.'
    });
  }

  return res.status(200).json({
    success: true,
    supabaseUrl,
    supabaseKey
  });
};
