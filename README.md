# Cangjie UK Team website

This website was create to represent open source Cangjie projects of Huawei research center. 


## How to add a new blog to the website?

You need to add another entry in the **blogInformation.json** file, and add a *.md* file with your blog content in the **blogs/** folder. The name in the *.json* file has to match the name of the *.md* file.

In the .json file you should include:
- authors of the blog
- gitcode repo link
- name of the blog
- date of creation

## How to add or update news?

- **Add a new news item**
  1. Create a *.md* file in the **news/** folder (e.g. `My News Title.md`).
  2. Add an entry in **newsInformation.json** with:
     - **name**: exactly the filename without `.md` (e.g. `My News Title` — must match the file).
     - **title**: the title shown in the list and on the news page.
     - **date**: in `DD/MM/YYYY` format.
  3. Run `npm run build-blogs` to generate the HTML.

- **Update existing news content**
  1. Edit the *.md* file in **news/**.
  2. Run `npm run build-blogs` so the corresponding HTML in **newsHTML/** is regenerated.

- **Rename a news file**
  1. Rename the *.md* file in **news/**.
  2. Update the **name** field of that item in **newsInformation.json** so it matches the new filename (without `.md`).
  3. Run `npm run build-blogs`.

The list and links on the homepage are driven by **newsInformation.json**; the **name** in each entry must always match the *.md* filename (without extension).

## Build

Run **scripts/preProcessing.js** (or `npm run build-blogs`) to generate HTML from markdown for both blogs and news. Then the website is ready. 