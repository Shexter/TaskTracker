import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in your .env file.")
    exit(1)

supabase: Client = create_client(url, key)

def test_connection():
    print(f"--- Testing Connection to {url} ---")
    try:
        # Try to fetch profiles (should be empty but shouldn't error)
        # Note: Without a login session, RLS will block selection unless 
        # we are using a service role key. Since we use anon key, 
        # this should return an empty list or 401 if RLS is tight.
        response = supabase.table("profiles").select("*").execute()
        print("✅ Successfully connected to Supabase API.")
        print(f"Found {len(response.data)} profiles visible to 'anon' role.")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

def list_tables():
    print("\n--- Verifying Tables (direct SQL check) ---")
    # This requires the service role key or a specific RLS policy to allow anon to see schema info
    # Usually we do this via the Dashboard, but let's try to query a core table
    tables = ["profiles", "tasks", "task_instances", "holidays", "seasonality_configs", "user_gamification", "import_jobs"]
    for table in tables:
        try:
            supabase.table(table).select("count", count="exact").limit(0).execute()
            print(f"✅ Table '{table}' exists and is reachable.")
        except Exception as e:
            print(f"⚠️ Table '{table}' check returned: {e}")

if __name__ == "__main__":
    test_connection()
    list_tables()
    print("\n💡 Tip: To test Row Level Security (RLS), you will need to:")
    print("1. Create a user in Supabase Auth (via Dashboard or App)")
    print("2. Log in to get a JWT")
    print("3. Use that JWT in your requests to see your own data!")
