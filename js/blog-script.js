import { Utils } from "./tableOfContents.js";


class BlogWebsite
{
    constructor()
    {
        this.blogId = 0 ;
        this.blogName = "Example" ;
        this.blogRepoLink = "https://www.example.com/" ;
        this.authors = [] ;
        this.init() ;
    }

    async init()
    {
        const blogContent = document.getElementById("blog-content") ;
        const showError = (msg) => { if (blogContent) blogContent.innerHTML = `<p class="loading" style="color:#c00">${msg}</p>` ; } ;
        try {
            this.getBlogId() ;
            await this.loadBlogInformation() ;
            await this.loadBlog() ;
            await this.loadTableOfContents() ;
            this.setUpEventListeners() ;
        } catch (e) {
            showError(`Failed to load blog: ${e && e.message ? e.message : e}`) ;
        }
    }

    getSiteBase()
    {
        const pathname = window.location.pathname || "" ;
        const i = pathname.indexOf("/pages/") ;
        if (i !== -1) return pathname.substring(0, i) + "/" ;
        return "/" ;
    }

    baseUrl(path)
    {
        const base = this.getSiteBase() ;
        return new URL(path.replace(/^\//, ""), window.location.origin + base).href ;
    }

    getBlogId()
    {
        const urlParams = new URLSearchParams(window.location.search) ;
        const idParam = urlParams.get("id") ;
        this.blogId = Number.parseInt(idParam,10) || 0 ;
    }

    async getBlogInformation()
    {
        const response = await fetch(this.baseUrl("data/blogInformation.json")) ;
        if (!response.ok) throw new Error(`blogInformation.json: ${response.status}`) ;

        const blogInformationList = await response.json() ;
        if(blogInformationList.length <= this.blogId) throw new Error("Incorrect blog Id.") ;
        const blogInformation = blogInformationList[this.blogId] ;

        this.blogName = blogInformation.name ;
        this.blogRepoLink = (blogInformation.repoLink && String(blogInformation.repoLink).trim()) || "" ;
        this.authors = blogInformation.authors || [] ;
    }

    loadBlogTitle()
    {
        const titleElement = document.getElementById("blog-name") ;
        const temp = this.blogName.replace(/_/g," ") ;
        titleElement.textContent = `${temp}` ;
    }

    loadRepoLink()
    {
        const container = document.getElementById("repo-link-container") ;
        if (!container) return ;
        if (!this.blogRepoLink) {
            container.style.display = "none" ;
            container.setAttribute("hidden", "hidden") ;
            return ;
        }
        container.style.display = "" ;
        container.removeAttribute("hidden") ;
        const repoLinkElement = document.getElementById("repo-link") ;
        if (repoLinkElement) repoLinkElement.href = this.blogRepoLink ;
    }

    loadAuthorsList()
    {
        const authorsListElement = document.getElementById("authors-list") ;
        authorsListElement.innerHTML = this.authors
        .map((author) => `<span class="author-tag">${author}</span>`)
        .join("") ;
    }

    async loadBlogInformation()
    {
        await this.getBlogInformation() ;
        this.loadBlogTitle() ;
        this.loadRepoLink() ;
        this.loadAuthorsList() ;
    }

    setUpEventListeners()
    {
        /* Nav bar matches homepage (Learn, Blogs, About); no Back button */
    }

    async loadBlog()
    {
        const blogContent = document.getElementById("blog-content") ;
        const url = this.baseUrl(`blogsHTML/${this.blogName}.html`) ;
        const response = await fetch(url) ;
        if (!response.ok) throw new Error(`Blog ${this.blogName}.html: ${response.status}`) ;
        const text = await response.text() ;
        blogContent.innerHTML = text ;
    }

    async loadTableOfContents()
    {
        const response = await fetch(this.baseUrl(`blogs/${this.blogName}.md`)) ;
        if (!response.ok) return ;
        const markdownContent = await response.text() ;

        const tocElement = document.getElementById("table-of-contents") ;
        const headers = Utils.generateHeaders(markdownContent) ;
        if (headers.length === 0)
        {
            tocElement.innerHTML = '<p class="no-toc">No sections found</p>';
            return;
        }
        const tocHTML = Utils.buildNestedListTOC(headers) ;
        tocElement.innerHTML = `<nav class="toc">${tocHTML}</nav>`;

        this.enableScrollSpy(headers)
    }

    enableScrollSpy(headers)
    {
        const linkById = new Map()
        for (const h of headers) {
            const link = document.querySelector(`.toc a[href="#${h.id}"]`)
            if (link) linkById.set(h.id, link)
        }
        const observer = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    const id = e.target.getAttribute('id')
                    const link = linkById.get(id)
                    if (!link) continue
                    document.querySelectorAll('.toc-link.active').forEach(el => el.classList.remove('active'))
                    link.classList.add('active')
                }
            }
        }, { root: document.querySelector('#blog-content'), rootMargin: '0px 0px -60% 0px', threshold: 0.1 })

        const container = document.getElementById('blog-content')
        const headings = container.querySelectorAll('h1[id], h2[id], h3[id]')
        headings.forEach(h => observer.observe(h))
    }
}

document.addEventListener("DOMContentLoaded", () => {
  new BlogWebsite()
})
