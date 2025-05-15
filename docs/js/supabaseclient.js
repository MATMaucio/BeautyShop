// js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://lcaofedrtztrgqccvvxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYW9mZWRydHp0cmdxY2N2dnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDIwOTQsImV4cCI6MjA2MjkxODA5NH0._WxTHC7G-94GPTLYRtb1urGfbcVL_OjaU6eSXUBAAKM';
export const supabase = createClient(supabaseUrl, supabaseKey);


