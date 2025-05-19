import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hpgarvinpormpljtowig.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ2FydmlucG9ybXBsanRvd2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTE0MjMsImV4cCI6MjA2MjcyNzQyM30.aBE8cJbZmp9bcpndayrlIyJMknKqTDkVCaeQpgnE1Eg'

export const supabase = createClient(supabaseUrl, supabaseKey)