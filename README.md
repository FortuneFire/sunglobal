# Sun Global Advisory Services Website

A responsive, multi-page website prototype for Sun Global Advisory Services. It is built with plain HTML, CSS, and JavaScript and requires no package installation or build step.

Repository: <https://github.com/FortuneFire/sunglobal>

## Pages

- `index.html` — Home
- `about.html` — About Sun Global
- `solutions.html` — Solutions overview
- `solutions/protection.html` — Protection solutions
- `solutions/investments.html` — Investment solutions
- `solutions/retirement.html` — Retirement planning
- `solutions/structured-investments.html` — Structured investments
- `how-it-works.html` — Advice and client process
- `claims.html` — Claims and existing-client support
- `contact.html` — Contact and consultation enquiry form

## Project Structure

```text
.
|-- index.html
|-- about.html
|-- solutions.html
|-- how-it-works.html
|-- claims.html
|-- contact.html
|-- solutions/
|   |-- protection.html
|   |-- investments.html
|   |-- retirement.html
|   `-- structured-investments.html
|-- styles.css
|-- script.js
`-- README.md
```

All pages share `styles.css` and `script.js`. The site includes responsive navigation, a Solutions dropdown, page-specific hero imagery, and a muted video hero on the About page.

## SEO Deployment Note

The production domain is `https://www.sunglobal.africa/`. Canonical URLs, Open Graph URLs, structured data, `sitemap.xml`, and `robots.txt` use this domain.

## Run Locally

You can open `index.html` directly, or run a local server from the project directory. A server is recommended so local navigation behaves like a deployed site.

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000> in a browser. Stop the server with `Ctrl+C`.

There is no build command, package manager, or automated test suite configured.

## Deploy with GitHub Pages

1. Open the repository's **Settings** on GitHub.
2. Go to **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. After GitHub Pages finishes deploying, use the published URL shown in the Pages settings.

The site is static, so no server-side runtime is required. Changes pushed to `main` will be published by GitHub Pages after deployment is enabled.

## Before Production

- Connect the consultation form to an approved email, CRM, or API endpoint. The current JavaScript only displays a local success message and does not submit or store enquiries.
- Replace or approve the externally hosted Unsplash photos and Pexels video. Google Fonts and the media assets require an internet connection.
- Replace placeholder social links and add working privacy-policy and terms links.
- Verify company details, FSP information, and all required financial-services disclosures with the appropriate reviewers.
- Test every page and form on desktop and mobile before launch.
