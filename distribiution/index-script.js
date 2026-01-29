import { Utils } from "./tableOfContents.js"


let allProjectsRaw = []
let allProjects = []
let showingAll = false
let activeTag = null
const INITIAL_DISPLAY_COUNT = 6

function formatDateForDisplay(dmy)
{
    // Expecting DD/MM/YYYY
    const [d, m, y] = dmy.split("/")
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    return fmt.format(date)
}

async function loadNews()
{
    const container = document.getElementById("news-container")
    if (!container) return
    try
    {
        const response = await fetch("newsInformation.json")
        const list = await response.json()
        container.innerHTML = list.map((item, index) => {
            const dateStr = formatDateForDisplay(item.date)
            return `<a href="newsTemplate.html?id=${index}" class="news-item"><span class="news-item-title">${item.title}</span><span class="news-item-date">${dateStr}</span></a>`
        }).join("")
    }
    catch (e)
    {
        container.innerHTML = "<p class=\"news-empty\">No news yet.</p>"
    }
}

async function loadProjects() 
{
    const response = await fetch("blogInformation.json")
    allProjectsRaw = await response.json()
    allProjects = Utils.copyAndSort(allProjectsRaw)
    displayProjects()
}

function displaySingleProject(project, projectsContainer)
{
    const projectCard = document.createElement("div")
    projectCard.className = "project-card"

    const tags = Array.isArray(project.tags) ? project.tags : []
    const description = project.description || ""
    // authors/date intentionally omitted per design

    projectCard.innerHTML = `
    <h3>${project.name}</h3>
    ${description ? `<p class="project-summary">${description}</p>` : ""}
    ${tags.length ? `<div class="project-tags">${tags.map(t => `<span class="tag">${t}</span>`).join(" ")}</div>` : ""}
    <a href="blogTemplate.html?id=${allProjectsRaw.indexOf(project)}" class="project-link">View Blog →</a>
    `
    projectsContainer.appendChild(projectCard)
}

function displayProjects() 
{
    const projectsContainer = document.getElementById("projects-container")
    const showMoreContainer = document.getElementById("show-more-container")

    projectsContainer.innerHTML = ""

    const source = activeTag
        ? allProjects.filter(p => Array.isArray(p.tags) && p.tags.includes(activeTag))
        : allProjects
    const projectsToShow = showingAll ? source : source.slice(0, INITIAL_DISPLAY_COUNT)

    for(const project of projectsToShow) displaySingleProject(project, projectsContainer)

    if (source.length > INITIAL_DISPLAY_COUNT) 
    {
        showMoreContainer.style.display = "block"
        const showMoreBtn = document.getElementById("show-more-btn")
        showMoreBtn.textContent = showingAll
        ? "Show Less"
        : `Show More (${source.length - INITIAL_DISPLAY_COUNT} more)`
    } 
    else 
    {
        showMoreContainer.style.display = "none"
    }
}

function buildTagChips()
{
    const tagContainer = document.getElementById("tag-chips")
    if (!tagContainer) return
    const tagSet = new Set()
    for (const p of allProjects) {
        if (Array.isArray(p.tags))
            for (const t of p.tags) tagSet.add(t)
    }
    tagContainer.innerHTML = ""
    const tags = Array.from(tagSet).sort()
    for (const tag of tags) {
        const chip = document.createElement("button")
        chip.type = "button"
        chip.className = "tag"
        chip.textContent = tag
        chip.addEventListener("click", () => {
            activeTag = activeTag === tag ? null : tag
            for (const el of tagContainer.querySelectorAll(".tag"))
                el.classList.toggle("active", el.textContent === activeTag)
            showingAll = false
            displayProjects()
        })
        tagContainer.appendChild(chip)
    }
}

function toggleShowMore() 
{
    showingAll = !showingAll
    displayProjects()
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadProjects().then(() => buildTagChips())
  loadNews()
})

window.toggleShowMore = toggleShowMore
