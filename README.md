# DevMate — AI Frontend Helper

A polished React project for the Mini AI Frontend Helper assignment.

## Included assignment requirements
- React frontend with reusable components: `Navbar`, `Hero`, `FeatureCard`, and `Workspace`.
- Custom responsive CSS styling.
- Interactive prompt form with experience-level personalization.
- API endpoint for AI-generated frontend guidance.
- Demo response mode works without an API key.
- Optional live OpenAI integration through a backend (API key is never placed in browser code).

## Run locally

1. Open this folder in VS Code.
2. Open the terminal in the project folder.
3. Install packages:

   ```bash
   npm install
   ```

4. Start the backend in one terminal:

   ```bash
   npm run server
   ```

5. Start the React frontend in a second terminal:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Enable live AI (optional bonus)

1. Copy `.env.example` to `.env`.
2. Put your API key in `.env`:

   ```env
   OPENAI_API_KEY=your_real_key_here
   PORT=5000
   ```

3. Restart `npm run server`.

Never commit `.env` or expose your API key in frontend JavaScript.

Without a key, DevMate runs in demo mode and the rest of the app remains functional.

## Production build

```bash
npm run build
```
The `dist` folder is the production frontend build. GitHub Pages hosts the frontend in demo mode, so the prompt form remains usable without an API server. For live AI responses, deploy the Express API to a Node-compatible host and set `VITE_API_URL` to that API's base URL when building the frontend. Never expose the OpenAI API key in frontend code.

## Deploy to GitHub Pages

The GitHub Actions workflow deploys the site automatically whenever changes are pushed to `main`. Enable **Settings → Pages → Build and deployment → Source: GitHub Actions** in the repository. After the workflow succeeds, the site will be available at:

https://joesef387.github.io/Devmate-Ai-Helper/

If a deployment ran before enabling GitHub Pages, open the repository's **Actions** tab, select **Deploy to GitHub Pages**, and re-run the latest workflow.
