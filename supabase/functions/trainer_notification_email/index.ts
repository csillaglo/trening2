import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Utility function to introduce a delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const sendEmail = async (to: string, subject: string, body: string) => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  // In development/test mode, override recipient email to a verified one
  const isTestMode = resendApiKey.startsWith('re_test_');
  const recipient = isTestMode ? 'delivered@resend.dev' : to;

  console.log(`[trainer_notification_email] RESEND_API_KEY prefix: ${resendApiKey.substring(0, 7)} (isTestMode: ${isTestMode})`);
  console.log(`[trainer_notification_email] Attempting to send email to: ${recipient} (Original: ${to}) with subject: ${subject}`);

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const { booking, session } = await req.json();

    if (!booking || !session) {
      throw new Error('Missing required booking or session data');
    }

    // Extract session details with checks
    const trainingTitle = session.content?.title;
    const trainingDateString = session.date_object?.date;
    const trainingLocation = session.date_object?.location;

    if (!trainingTitle || !trainingDateString || !trainingLocation) {
      const missingFields = [];
      if (!trainingTitle) missingFields.push("session.content.title");
      if (!trainingDateString) missingFields.push("session.date_object.date");
      if (!trainingLocation) missingFields.push("session.date_object.location");
      console.error(`[trainer_notification_email] Missing critical session data for email. Session: ${JSON.stringify(session)}, Missing: ${missingFields.join(', ')}`);
      throw new Error(`Critical session data missing for email: ${missingFields.join(', ')}`);
    }

    // Get trainer email
    const { data: trainer, error: trainerError } = await supabase
      .from('trainers')
      .select('notification_email')
      .eq('id', session.trainer_id)
      .single();

    if (trainerError) {
      // Log the session.trainer_id for better debugging if trainer not found
      console.error(`[trainer_notification_email] Failed to fetch trainer with ID ${session.trainer_id}: ${trainerError.message}. Session: ${JSON.stringify(session)}`);
      throw new Error(`Failed to fetch trainer: ${trainerError.message}`);
    }

    // Format date in Hungarian locale
    const formattedDate = new Date(trainingDateString).toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (formattedDate === 'Invalid Date') {
      console.error(`[trainer_notification_email] Invalid date string encountered: "${trainingDateString}". Session: ${JSON.stringify(session)}`);
      throw new Error(`Invalid date string for session.date_object.date: "${trainingDateString}"`);
    }

    // Create email content for admin/trainer
    const adminTrainerEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Új jelentkezés érkezett a következő képzésre:</h2>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Képzés:</strong> ${trainingTitle}</p>
          <p style="margin: 10px 0;"><strong>Időpont:</strong> ${formattedDate}</p>
          <p style="margin: 10px 0;"><strong>Helyszín:</strong> ${trainingLocation}</p>
        </div>

        <h3 style="color: #374151; margin-top: 30px;">Jelentkező adatai:</h3>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p style="margin: 10px 0;"><strong>Név:</strong> ${booking.name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${booking.email}</p>
          <p style="margin: 10px 0;"><strong>Telefon:</strong> ${booking.phone}</p>
          ${booking.company ? `<p style="margin: 10px 0;"><strong>Vállalat:</strong> ${booking.company}</p>` : ''}
          <p style="margin: 10px 0;"><strong>Létszám:</strong> ${booking.participants} fő</p>
        </div>
      </div>
    `;

    // Create email content for applicant
    const applicantEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Sikeres jelentkezés!</h2>
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
          ${booking.company ? `<p style="margin: 10px 0;"><strong>Vállalat:</strong> ${booking.company}</p>` : ''}
          <p style="margin: 10px 0;"><strong>Létszám:</strong> ${booking.participants} fő</p>
        </div>
        
        <p>Amennyiben bármilyen kérdése merülne fel, kérjük, vegye fel velünk a kapcsolatot.</p>
        <p>Üdvözlettel,<br>A Larskol Képzések Csapata</p>
      </div>
    `;

    // Send email to admin
    console.log('[trainer_notification_email] Sending email to admin...');
    await sendEmail(
      'tamas.kolbe@gmail.com', // Consider making this an environment variable
      'Új képzés jelentkezés érkezett',
      adminTrainerEmailBody
    );
    console.log('[trainer_notification_email] Admin email sent.');

    // Introduce a delay before sending the next email
    await delay(500); // 500ms delay

    // Send email to trainer if email exists
    if (trainer?.notification_email) {
      console.log('[trainer_notification_email] Sending email to trainer:', trainer.notification_email);
      await sendEmail(
        trainer.notification_email,
        'Új jelentkezés az Ön tréningjére',
        adminTrainerEmailBody
      );
      console.log('[trainer_notification_email] Trainer email sent.');
    } else {
      console.log('[trainer_notification_email] No trainer notification email found.');
    }

    // Introduce a delay before sending the next email
    await delay(500); // 500ms delay

    // Send confirmation email to applicant
    if (booking.email && booking.email.trim().length > 0) {
      console.log('[trainer_notification_email] Sending confirmation email to applicant:', booking.email);
      await sendEmail(
        booking.email,
        'Jelentkezés megerősítése - Larskol Képzések',
        applicantEmailBody
      );
      console.log('[trainer_notification_email] Applicant confirmation email sent.');
    } else {
      console.error('[trainer_notification_email] No applicant email provided or it is empty:', booking.email);
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
    console.error('[trainer_notification_email] Error processing request:', error);

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
