<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your SupplyFlow app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and add your Supabase project URL and anon key
3. Run `supabase-schema.sql` in the Supabase SQL Editor to create the tables and `product-images` Storage bucket
4. Run the app:
   `npm run dev`
