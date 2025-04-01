import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xixrouxvfqnmbdpdkytg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpeHJvdXh2ZnFubWJkcGRreXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0Njk3MDMsImV4cCI6MjA1OTA0NTcwM30.7v4HUcXqi7WRLYZ588xpKkwqQw05l8H0ixSpt8y6DuQ';

export const supabase = createClient(supabaseUrl, supabaseKey);