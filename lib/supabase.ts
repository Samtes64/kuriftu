// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ujprsivpzetlejitztzk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcHJzaXZwemV0bGVqaXR6dHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDExNTgsImV4cCI6MjA1NjkxNzE1OH0.27bvPm8yDZdKQKekVjf3QN_jAKVj2FwkJbmlyYUAIpM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
