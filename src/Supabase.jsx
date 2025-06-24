import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vupsiwfyjiosjstrsvlg.supabase.co/'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1cHNpd2Z5amlvc2pzdHJzdmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzc4NjEsImV4cCI6MjA2NTk1Mzg2MX0.0uN9auNGLPtCU2s7w1BzrTCP2inyOXoqWuOlxV95A38'
export const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase