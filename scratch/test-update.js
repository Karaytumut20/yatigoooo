const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://edhllpcgzbccdlwslcza.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaGxscGNnemJjY2Rsd3NsY3phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyNjczMywiZXhwIjoyMDk2NDAyNzMzfQ.8po-ArXTTkQceqIbYesZUcmBz5PBdJ_14tvEtp9XkG0";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUpdate() {
  console.log("Updating a yacht...");
  // Let's get one yacht slug
  const { data: yachts } = await supabase.from("yachts").select("slug").limit(1);
  if (!yachts || yachts.length === 0) {
    console.log("No yachts found.");
    return;
  }
  const slug = yachts[0].slug;
  console.log("Found yacht slug:", slug);

  const { data, error } = await supabase
    .from("yachts")
    .update({
      yacht_type: "motor-yacht",
      cabin_count: 3,
      has_pool: true,
      has_flybridge: true
    })
    .eq("slug", slug)
    .select();

  if (error) {
    console.error("Error updating yacht:", error.message);
  } else {
    console.log("Yacht updated successfully! Response:", data);
  }
}

testUpdate();
