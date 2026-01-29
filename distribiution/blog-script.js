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
        this.getBlogId() ;
        await this.loadBlogInformation() ;
        await this.loadTableOfContents() ;
        await this.loadBlog() ;
        this.setUpEventListeners() ;
    }  

    getBlogId()
    {
        const urlParams = new URLSearchParams(window.location.search) ;
        const idParam = urlParams.get("id") ;
        this.blogId = Number.parseInt(idParam,10) || 0 ;
    }

    async getBlogInformation()
    {
        const response = await fetch("blogInformation.json") ;

        const blogInformationList = await response.json() ;
        if(blogInformationList.length <= this.blogId) throw new Error("Incorrect blog Id.") ;
        const blogInformation = blogInformationList[this.blogId] ;

        this.blogName = blogInformation.name ;
        this.blogRepoLink = blogInformation.repoLink ;
        this.authors = blogInformation.authors ;
    }

    loadBlogTitle()
    {
        const titleElement = document.getElementById("blog-name") ;
        const temp = this.blogName.replace(/_/g," ") ;
        titleElement.textContent = `${temp}` ;
    }

    loadRepoLink()
    {
        const repoLinkElement = document.getElementById("repo-link") ;
        repoLinkElement.href = this.blogRepoLink ;
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
        const response = await fetch(`blogsHTML/${this.blogName}.html`) ;
        if (!response.ok) throw new Error(`Blog ${this.blogName} not found`) ;
        const text = await response.text() ;
        blogContent.innerHTML = text ;
    }

    async loadTableOfContents()
    {
        const response = await fetch(`blogs/${this.blogName}.md`) ;
        if (!response.ok) throw new Error(`Blog ${this.blogName} not found`) ;
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
