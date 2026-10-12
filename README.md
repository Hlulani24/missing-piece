# Missing Piece Clothing Brand

A full-stack catalog/lookfbook site for the Missing Piece streetwear brand — built on
the same React + Node + MongoDB architecture as your CHUKS and AMARA projects, but
stripped down for a clothing catalog instead of bookings:

- **No booking/fitting system, no customer accounts, no payment gateway.** This brand
  isn't a team, so there's no appointment flow — people browse the catalog, build up
  an order in a simple cart, and send it straight to WhatsApp or email ("DM to order",
  matching your price list). Nothing is ever charged on the site.
- **One kind of login: admin.** There's no customer dashboard because there are no
  customer accounts — only the person managing the catalog logs in, to add/edit
  products, upload photos, and mark things sold out.
- Same Cloudinary-with-local-fallback image upload pattern as CHUKS/AMARA, same
  JWT auth pattern, same self-service "account settings" (edit your own
  name/email/phone + change password) instead of editing MongoDB Atlas by hand.

## What's in the catalog

Seeded from your real price list and photos:

- **Headwear** — Panel Cap, Floppy Beanie, Balaclava, Striped Hat, Aesthetic Cap, Half Cap (R150–R170)
- **Bodywear** — Crop Top, T-Shirts, Cargo Vest, Hoodies, Mafia Jersey (R200–R450)
- **Bottomwear** — Short Pants, Sweater Pants, Mafia Trouser (R250–R400)
- **Other items** — Gloves, School Bag (R150–R300)

A few items (Balaclava, Half Cap, Crop Top, Cargo Vest, Mafia Trouser) don't have a
matching photo among what you sent, so they're seeded with no image — add a real
photo for each from the admin dashboard whenever you have one; the storefront shows a
"Photo coming soon" placeholder until then.

## Project structure

```
missing-piece/
  backend/     Node + Express + MongoDB API (same layout as CHUKS: config/ models/
               middleware/ controllers/ routes/ utils/)
  frontend/    React (Vite) + Tailwind storefront + admin dashboard
```

## Running it locally

```bash
# Backend
cd backend
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET at minimum
npm install
npm run seed            # creates the admin account + the catalog above, once
npm run dev              # http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Log in to the admin dashboard at `/admin/login` with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `backend/.env` before seeding — change the password
immediately from Account settings once you're in.

## Deploying to Render

Follow the same two-service pattern (and the same Cloudinary setup) as your CHUKS
and AMARA deploys — a Web Service for `backend/` and a Static Site for `frontend/`.
The one thing to double check here: set `VITE_API_URL` on the frontend to your
backend's live URL + `/api` before the first build, same as you did for AMARA.

## What's intentionally NOT here

- No booking/appointment/fitting flow — removed per your request, since this isn't a
  team.
- No payment gateway — matches your price list's "DM for orders" model exactly.
- No customer login/dashboard — there's nothing for a customer to log in and see,
  since orders aren't tracked on the site itself.
