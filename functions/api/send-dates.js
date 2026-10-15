export async function onRequestPost({ request, env }) {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

  const apiKey = env.RESEND_API_KEY;
  const from = env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return json({ error: 'Email is not configured yet. The site owner needs to add RESEND_API_KEY and RESEND_FROM_EMAIL in Cloudflare Pages settings.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'The date data was not readable. Please try again.' }, 400);
  }

  const dates = body?.dates;
  const validDate = value => {
    if (typeof value !== 'string' || !/^2026-(10|11)-(0[1-9]|[12]\d|3[01])$/.test(value)) return false;
    const parsed = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  if (!Array.isArray(dates) || dates.length !== 3 || !dates.every(validDate) || new Set(dates).size !== 3) {
    return json({ error: 'Please select exactly three different dates in October or November 2026.' }, 400);
  }

  const prettyDates = dates.slice().sort().map((date, i) => {
    const d = new Date(`${date}T12:00:00Z`);
    return `${i + 1}. ${new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    }).format(d)}`;
  });

  let result;
  try {
    result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: ['jhomola245@gmail.com'],
        subject: 'Gym invitation — selected dates',
        text: `Someone accepted the gym invitation and selected these three dates:\n\n${prettyDates.join('\n')}\n\nThis email was sent by the gym invitation website.`
      })
    });
  } catch (error) {
    console.error('Could not reach Resend:', error);
    return json({ error: 'Could not connect to the email service. Please try again or copy the dates manually.' }, 502);
  }

  if (!result.ok) {
    const details = await result.text();
    console.error('Resend API error:', result.status, details);
    return json({ error: 'Resend rejected the email. Check the API key and verified sender domain in your Cloudflare Pages settings.' }, 502);
  }

  return json({ ok: true });
}
