// api/cron/remedy-reminders.js
// Thin Vercel serverless function triggered by Vercel Cron.
// Invokes the Supabase Edge Function that sends reminder emails.

export default async function handler(req, res) {
  // Verify this is a Vercel cron request (optional security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials' });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-remedy-reminders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error invoking Edge Function:', error);
    return res.status(500).json({ error: 'Failed to invoke reminder function' });
  }
}
