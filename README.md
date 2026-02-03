# Cangjie UK Team website

This website was create to represent open source Cangjie projects of Huawei research center.

## Run the site locally (Python)

You need a local HTTP server; do not open `index.html` directly in the browser (blog and news content will not load).

**Python 3** (no extra install if you have Python):

```bash
# From the project root directory
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser. Use another port if 8000 is in use (e.g. `8080`).

## Install npm dependencies (for building blogs/news)

The build that turns markdown (in `blogs/` and `news/`) into HTML uses Node.js and the following packages. Install once from the project root:

```bash
npm install
```

Or, for a clean install matching the lockfile:

```bash
npm ci
```

**Build dependencies and versions** (used by `npm run build-blogs`):

| Package | Version | Purpose |
|---------|---------|---------|
| remark | ^14.0.2 | Markdown parser |
| remark-gfm | ^3.0.1 | GitHub Flavored Markdown (tables, strikethrough, etc.) |
| remark-rehype | ^10.1.0 | Convert markdown AST to HTML AST |
| rehype-raw | ^6.1.1 | Allow raw HTML in markdown |
| rehype-stringify | ^9.0.3 | Serialise HTML AST to string |
| rehype-slug | ^5.0.0 | Add `id` to headings (for table of contents) |
| shiki | ^0.12.0 | Code syntax highlighting (including Cangjie) |
| unist-util-visit | ^4.1.0 | Walk the AST for code blocks |

Exact resolved versions are in **package-lock.json**. After installing, run `npm run build-blogs` to generate `blogsHTML/` and `newsHTML/` from the markdown files.

## How to add a new blog to the website?

You need to add another entry in **data/blogInformation.json**, and add a *.md* file with your blog content in the **blogs/** folder. The name in the *.json* file has to match the name of the *.md* file.

In the JSON file you should include:
- authors of the blog
- gitcode repo link
- name of the blog
- date of creation

## How to add or update news?

- **Add a new news item**
  1. Create a *.md* file in the **news/** folder (e.g. `My News Title.md`).
  2. Add an entry in **data/newsInformation.json** with:
     - **name**: exactly the filename without `.md` (e.g. `My News Title` — must match the file).
     - **title**: the title shown in the list and on the news page.
     - **date**: in `DD/MM/YYYY` format.
  3. Run `npm run build-blogs` to generate the HTML.

- **Update existing news content**
  1. Edit the *.md* file in **news/**.
  2. Run `npm run build-blogs` so the corresponding HTML in **newsHTML/** is regenerated.

- **Rename a news file**
  1. Rename the *.md* file in **news/**.
  2. Update the **name** field of that item in **data/newsInformation.json** so it matches the new filename (without `.md`).
  3. Run `npm run build-blogs`.

The list and links on the homepage are driven by **data/newsInformation.json**; the **name** in each entry must always match the *.md* filename (without extension).

## Build

When you push changes to **blogs/** or **news/** (or the data JSON files), the GitHub Actions workflow generates HTML in **blogsHTML/** and **newsHTML/** and commits them.

To build locally (e.g. before pushing), from the project root run:

```bash
npm run build-blogs
```

## GitHub Pages deployment

The repo includes a custom workflow **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`) that builds blogs/news and deploys the site. To avoid "Canceling since a higher priority waiting request..." errors:

1. In the repo go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions** (not "Deploy from a branch").
3. The workflow **Deploy to GitHub Pages** will run on push to `main` or `dev`; it uses `concurrency: cancel-in-progress: false` so a new push does not cancel an in-progress deployment. 