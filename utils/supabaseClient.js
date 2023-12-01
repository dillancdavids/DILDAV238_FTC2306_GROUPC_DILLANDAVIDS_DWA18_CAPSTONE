/* eslint-disable */

import { createClient } from '@supabase/supabase-js'

   
    const SUPABASE_URL ="https://hryyfxjhrolummzoeeyf.supabase.co"
        const SUPABASE_ANNON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyeXlmeGpocm9sdW1tem9lZXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE0MTU0MTIsImV4cCI6MjAxNjk5MTQxMn0.zuiYaMCjrWUShkx3GnBEAuvr7KIrYlDOcQpgzOUFtBw"
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANNON_KEY)