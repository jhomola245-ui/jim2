GYM INVITATION — CLOUDFLARE PAGES + RESEND

This package is prepared for Cloudflare Pages. It uses a Cloudflare Pages Function at /api/send-dates to send the selected dates through Resend. The Resend API key is kept server-side as a Cloudflare environment variable; do not put it in index.html.

BEGINNER SETUP

1. Create a Resend account at https://resend.com/.
2. In Resend, add and verify a domain you own. Follow the DNS instructions Resend shows you. Then create an API key and copy it somewhere private. Never upload the API key to GitHub or paste it into index.html.
3. Create a GitHub account at https://github.com/ if you do not have one.
4. Create a new repository named gym-invitation.
5. Upload the CONTENTS of this folder into the root of the repository. The repository root must contain index.html and the functions folder. Do not upload this entire folder as a nested subfolder.
6. Open https://dash.cloudflare.com/ and sign in or create an account.
7. In Cloudflare, go to Workers & Pages, choose Create, then Pages, and connect to your GitHub repository. Follow the prompts to set up the Pages project. For a static site with Pages Functions, use the repository root as the project root and no build command; use the default output directory / (or leave it blank if the interface permits). If the setup screen requires a build configuration, consult current Cloudflare Pages Git integration instructions.
8. In your Cloudflare Pages project, open Settings > Variables and Secrets (or Environment variables). Add these variables for the Production environment:
   RESEND_API_KEY = paste your private Resend API key
   RESEND_FROM_EMAIL = Gym Invitation <invites@YOUR-VERIFIED-DOMAIN>
   Replace invites@YOUR-VERIFIED-DOMAIN with a sender address at the domain you verified in Resend.
9. Save the variables and trigger a new deployment. Variables are not exposed to website visitors; the API key must remain here, not in the HTML.
10. Open your published pages.dev URL. Select exactly three dates and tap Send dates to James. Check the inbox at jhomola245@gmail.com and Resend's email logs. The email request being accepted does not guarantee it reaches the inbox.

IF IT FAILS
- “Email is not configured yet”: check the exact variable names and ensure they are set for Production; redeploy after changing them.
- Resend rejects the email: confirm the domain is verified and RESEND_FROM_EMAIL uses that domain; check the API key.
- The website has no /api/send-dates endpoint: confirm the functions/api/send-dates.js file is in the repository at exactly that path and that the project is deployed as Cloudflare Pages (not just a file preview).
- If email fails, the invitation still offers a copy-dates fallback.

IMPORTANT
- This package is not automatically deployed by downloading it. You must connect it to Cloudflare Pages and configure the secrets.
- This function sends to jhomola245@gmail.com. Change the recipient only if you want another inbox to receive the dates.
