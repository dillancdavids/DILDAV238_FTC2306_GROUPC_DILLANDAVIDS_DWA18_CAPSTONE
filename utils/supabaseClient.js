/* eslint-disable */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL ="https://yitliolscvqdehcsxkqz.supabase.co"
const SUPABASE_ANNON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGxpb2xzY3ZxZGVoY3N4a3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNzEwNjYsImV4cCI6MjAwNjg0NzA2Nn0.dD85xBerc96yv2rOxk9wdXBzZmjei6LU026la0xKI7Q"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANNON_KEY)