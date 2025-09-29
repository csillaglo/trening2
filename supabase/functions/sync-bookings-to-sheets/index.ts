import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { GoogleSpreadsheet } from 'npm:google-spreadsheet@4.1.1';
import { JWT } from 'npm:google-auth-library@9.6.3';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];
const SHEET_TITLE = 'Jelentkezések';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const normalizePrivateKey = (keyInput: string): string => {
  if (!keyInput) {
    console.warn("GOOGLE_PRIVATE_KEY input to normalizePrivateKey is empty.");
    return "";
  }
  console.log('normalizePrivateKey: Original GOOGLE_PRIVATE_KEY input (first 60 chars):', keyInput.substring(0, 60));
  console.log('normalizePrivateKey: Original GOOGLE_PRIVATE_KEY input (last 60 chars):', keyInput.substring(Math.max(0, keyInput.length - 60)));
  console.log('normalizePrivateKey: Original GOOGLE_PRIVATE_KEY input length:', keyInput.length);
  
  let key = keyInput.trim(); 

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.substring(1, key.length - 1);
    console.log('normalizePrivateKey: Removed surrounding quotes from private key.');
  }
  
  const keyWithNormalizedNewlines = key.replace(/\\n/g, '\n');
  
  if (key.includes('\\n') && key !== keyWithNormalizedNewlines) {
    console.log('normalizePrivateKey: Normalized \\n to actual newlines in private key.');
  } else if (!key.includes('\\n')) {
    console.log('normalizePrivateKey: Private key did not contain literal \\n sequences (assumed actual newlines or no newlines needed).');
  } else {
    console.log('normalizePrivateKey: Private key contained \\n but normalization did not change the string (unexpected).');
  }
  
  console.log('normalizePrivateKey: Processed GOOGLE_PRIVATE_KEY (first 60 chars):', keyWithNormalizedNewlines.substring(0, 60));
  console.log('normalizePrivateKey: Processed GOOGLE_PRIVATE_KEY (last 60 chars):', keyWithNormalizedNewlines.substring(Math.max(0, keyWithNormalizedNewlines.length - 60)));
  console.log('normalizePrivateKey: Processed GOOGLE_PRIVATE_KEY length:', keyWithNormalizedNewlines.length);

  if (!keyWithNormalizedNewlines.startsWith('-----BEGIN PRIVATE KEY-----')) {
      console.warn('normalizePrivateKey: Processed key does NOT start with "-----BEGIN PRIVATE KEY-----".');
  } else {
      console.log('normalizePrivateKey: Processed key starts with "-----BEGIN PRIVATE KEY-----".');
  }
  if (!keyWithNormalizedNewlines.includes('-----END PRIVATE KEY-----')) { // Check for includes because trim might affect endsWith
      console.warn('normalizePrivateKey: Processed key does NOT contain "-----END PRIVATE KEY-----".');
  } else {
      console.log('normalizePrivateKey: Processed key contains "-----END PRIVATE KEY-----".');
  }
  
  return keyWithNormalizedNewlines;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  console.log('sync-bookings-to-sheets function invoked.');

  try {
    const googleServiceAccountEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const googlePrivateKeyInput = Deno.env.get('GOOGLE_PRIVATE_KEY');
    const googleSheetsId = Deno.env.get('GOOGLE_SHEETS_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    // Use SUPABASE_SERVICE_ROLE_KEY instead of SUPABASE_ANON_KEY for backend operations
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!googleServiceAccountEmail) throw new Error('Environment variable GOOGLE_SERVICE_ACCOUNT_EMAIL is not set.');
    if (!googlePrivateKeyInput) throw new Error('Environment variable GOOGLE_PRIVATE_KEY is not set.');
    if (!googleSheetsId) throw new Error('Environment variable GOOGLE_SHEETS_ID is not set.');
    if (!supabaseUrl) throw new Error('Environment variable SUPABASE_URL is not set.');
    if (!supabaseServiceRoleKey) throw new Error('Environment variable SUPABASE_SERVICE_ROLE_KEY is not set.'); // Check for the new key

    console.log('All required environment variables seem to be present.');
    console.log('Attempting to normalize GOOGLE_PRIVATE_KEY...');
    const privateKey = normalizePrivateKey(googlePrivateKeyInput);
    
    if (!privateKey) {
      throw new Error('Processed Google private key is empty. Check normalization or the original key in environment variables.');
    }

    console.log('Initializing Google Sheets client with service account email:', googleServiceAccountEmail);
    const serviceAccountAuth = new JWT({
      email: googleServiceAccountEmail,
      key: privateKey, 
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(googleSheetsId, serviceAccountAuth);

    console.log(`Loading Google Sheet info for ID: ${googleSheetsId}...`);
    await doc.loadInfo(); 
    console.log(`Google Sheet document loaded successfully: "${doc.title}"`);

    let sheet = doc.sheetsByTitle[SHEET_TITLE];
    if (!sheet) {
      console.log(`Sheet "${SHEET_TITLE}" not found, attempting to create it...`);
      sheet = await doc.addSheet({ title: SHEET_TITLE });
      console.log(`Sheet "${SHEET_TITLE}" created.`);
    } else {
      console.log(`Sheet "${SHEET_TITLE}" found.`);
    }
    
  await sheet.resize({ rowCount: 1000, columnCount: 11 }); 
  console.log(`Sheet resized to 1000 rows and 11 columns.`);


    console.log('Initializing Supabase client with service role key...');
    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        // It's good practice to specify autoRefreshToken and persistSession for service roles,
        // though for simple backend scripts, it might not be strictly necessary.
        // Setting persistSession to false is common for server-side operations.
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    console.log('Fetching bookings from Supabase...');
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        session:training_sessions (
          *,
          topic:training_topics(*),
          content:training_contents(*),
          trainer:trainers(*),
          date:training_dates(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Supabase bookings fetch error:', bookingsError);
      throw bookingsError;
    }
    if (!bookings) {
      console.warn('No bookings data array returned from Supabase, though no explicit error. Assuming empty list.');
    }

    console.log(`Fetched ${bookings?.length || 0} bookings from Supabase.`);


    const headers = [
      'Szinkronizálás ideje',
      'Jelentkezés ideje',
      'Képzés címe',
      'Időpont',
      'Helyszín',
      'Tréner',
      'Jelentkező neve',
      'Email',
      'Telefon',
      'Cég',
      'Létszám'
    ];
    console.log('Setting header row in Google Sheet...');
    await sheet.setHeaderRow(headers);
    console.log('Header row set.');

    if (bookings && bookings.length > 0) {
      console.log('Preparing rows for Google Sheets...');
      const syncTimestamp = new Date().toLocaleString('hu-HU');
      const rows = bookings.map(booking => {
        const sessionContentTitle = booking.session?.content?.title ?? 'N/A';
        const sessionDateObject = booking.session?.date; // This is training_dates record
        const sessionDateDate = sessionDateObject?.date; // This is the actual date string from training_dates
        const sessionDateLocation = sessionDateObject?.location ?? 'N/A';
        const sessionTrainerName = booking.session?.trainer?.name ?? 'N/A';

        return {
          'Szinkronizálás ideje': syncTimestamp,
          'Jelentkezés ideje': booking.created_at ? new Date(booking.created_at).toLocaleString('hu-HU') : 'N/A',
          'Képzés címe': sessionContentTitle,
          'Időpont': sessionDateDate ? new Date(sessionDateDate).toLocaleString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A',
          'Helyszín': sessionDateLocation,
          'Tréner': sessionTrainerName,
          'Jelentkező neve': booking.name ?? 'N/A',
          'Email': booking.email ?? 'N/A',
          'Telefon': booking.phone ?? 'N/A',
          'Cég': booking.company || '-',
          'Létszám': booking.participants ?? 0
        };
      });
      console.log(`Prepared ${rows.length} rows. Adding to sheet...`);
      await sheet.addRows(rows);
      console.log('Rows added to Google Sheet.');
    } else {
      console.log('No bookings to add to the sheet.');
    }

    console.log('Formatting header cells in Google Sheet...');
    await sheet.loadCells(`A1:${String.fromCharCode(64 + headers.length)}1`); 
    for (let i = 0; i < headers.length; i++) {
      const cell = sheet.getCell(0, i);
      cell.textFormat = { bold: true };
      cell.backgroundColor = { red: 0.9, green: 0.9, blue: 0.9 };
    }
    await sheet.saveUpdatedCells();
    console.log('Header cells formatted.');
    
    console.log('Google Sheets sync successful.');
    return new Response(
      JSON.stringify({ success: true, rowCount: bookings?.length || 0 }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('--- ERROR in sync-bookings-to-sheets function ---');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during sync.';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available.';
    
    console.error('Error Name:', error.name);
    console.error('Error Message:', errorMessage);
    console.error('Error Stack:', errorStack);
    
    if (error.response && error.response.data) {
      console.error('Google API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.errors) { 
        console.error('Auth Library Errors:', JSON.stringify(error.errors, null, 2));
    }

    return new Response(
      JSON.stringify({ 
        error: `Failed to sync with Google Sheets: ${errorMessage}`,
        details: Deno.env.get('ENVIRONMENT') === 'dev' ? errorStack : undefined 
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
