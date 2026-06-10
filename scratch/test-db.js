const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://edhllpcgzbccdlwslcza.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaGxscGNnemJjY2Rsd3NsY3phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyNjczMywiZXhwIjoyMDk2NDAyNzMzfQ.8po-ArXTTkQceqIbYesZUcmBz5PBdJ_14tvEtp9XkG0";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log("Checking columns on yachts...");
  const { data, error } = await supabase.from("yachts").select("yacht_type, cabin_count, has_pool, has_flybridge").limit(1);
  if (error) {
    console.error("Columns do not exist or error:", error.message);
  } else {
    console.log("Columns exist successfully! Data:", data);
  }
}

check();
