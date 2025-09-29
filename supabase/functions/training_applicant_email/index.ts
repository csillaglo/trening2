import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const sendEmail = async (to: string, subject: string, body: string) => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  // In development/test mode, override recipient email to a verified one
  const isTestMode = resendApiKey.startsWith('re_test_');
  const recipient = isTestMode ? 'delivered@resend.dev' : to;

  console.log(`[sendEmail] RESEND_API_KEY prefix: ${resendApiKey.substring(0, 7)} (isTestMode: ${isTestMode})`);
  console.log(`[sendEmail] Attempting to send email to: ${recipient} (Original: ${to}) with subject: ${subject}`);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Larskol Képzések <no-reply@berfelmeres.hu>',
      to: recipient,
      subject,
      html: body,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Failed to send email: ${errorData.message || response.statusText}`);
  }

  return response.json();
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { booking, session } = await req.json();
    if (!booking || !session) {
      throw new Error('Missing required booking or session data');
    }

    const trainingTitle = session.content?.title;
    const trainingDateString = session.date_object?.date;
    const trainingLocation = session.date_object?.location;
    if (!trainingTitle || !trainingDateString || !trainingLocation) {
      const missingFields = [];
      if (!trainingTitle) missingFields.push("session.content.title");
      if (!trainingDateString) missingFields.push("session.date_object.date");
      if (!trainingLocation) missingFields.push("session.date_object.location");
      console.error(`[training_applicant_email] Missing critical session data for email. Session: ${JSON.stringify(session)}, Missing: ${missingFields.join(', ')}`);
      throw new Error(`Critical session data missing for email: ${missingFields.join(', ')}`);
    }

    const formattedDate = new Date(trainingDateString).toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    if (formattedDate === 'Invalid Date') {
      console.error(`[training_applicant_email] Invalid date string encountered: "${trainingDateString}". Session: ${JSON.stringify(session)}`);
      throw new Error(`Invalid date string for session.date_object.date: "${trainingDateString}"`);
    }

    // Email body for applicant
    const applicantEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #003459;">Sikeres jelentkezés!</h2>
        <p>Kedves ${booking.name},</p>
        <p>Köszönjük, hogy jelentkezett a következő képzésünkre. Ezúton is megerősítjük a jelentkezését.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">A képzés adatai:</h3>
          <p style="margin: 10px 0;"><strong>Képzés:</strong> ${trainingTitle}</p>
          <p style="margin: 10px 0;"><strong>Időpont:</strong> ${formattedDate}</p>
          <p style="margin: 10px 0;"><strong>Helyszín:</strong> ${trainingLocation}</p>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Az Ön által megadott adatok:</h3>
          <p style="margin: 10px 0;"><strong>Név:</strong> ${booking.name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${booking.email}</p>
          <p style="margin: 10px 0;"><strong>Telefon:</strong> ${booking.phone}</p>
          ${booking.company ? `<p style=\"margin: 10px 0;\"><strong>Vállalat:</strong> ${booking.company}</p>` : ''}
          <p style="margin: 10px 0;"><strong>Létszám:</strong> ${booking.participants} fő</p>
        </div>
        <p>Amennyiben bármilyen kérdése merülne fel, kérjük, vegye fel velünk a kapcsolatot.</p>
        <p>Üdvözlettel,<br>A Larskol Képzések Csapata</p>
      </div>
    `;

    // Send confirmation email to applicant
    if (booking.email && booking.email.trim().length > 0) {
      console.log('[training_applicant_email] Küldés jelentkezőnek:', booking.email);
      try {
        await sendEmail(
          booking.email,
          'Jelentkezés megerősítése - Larskol Képzések',
          applicantEmailBody
        );
        console.log('[training_applicant_email] Jelentkezői email sikeresen elküldve:', booking.email);
      } catch (err) {
        console.error('[training_applicant_email] Jelentkezői email küldési hiba:', err);
      }
    } else {
      console.error('[training_applicant_email] Nincs jelentkezői email megadva, vagy üres:', booking.email);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('[training_applicant_email] Hiba a kérés feldolgozása során:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
