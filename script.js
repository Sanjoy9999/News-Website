const apiKey = '6f7f2002a2dc4c399960d58413611ea2'; 
const apiUrl = 'https://newsapi.org/v2/top-headlines';

const featuredContent = document.getElementById('featured-content');
const articlesContainer = document.getElementById('articles-container');
const categoryLinks = document.querySelectorAll('nav a');
const returnHomePage = document.querySelector('footer i');

async function fetchNews(category = 'general') {
    try {
        const response = await fetch(`${apiUrl}?country=us&category=${category}&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles || []; // Ensure to return an empty array if articles are undefined
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

function displayFeaturedArticle(article) {
    featuredContent.innerHTML = `
        <h3>${article.title}</h3>
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
        <p>${article.description}</p>
        <a href="${article.url}" target="_blank">Read More</a>
    `;
}

function displayArticles(articles) {
    articlesContainer.innerHTML = '';
    articles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;
        articlesContainer.appendChild(articleCard);
    });
}

async function loadNews(category = 'general') {
    try {
        const articles = await fetchNews(category);
        if (articles.length > 0) {
            displayFeaturedArticle(articles[0]);
            displayArticles(articles.slice(1));
        } else {
            featuredContent.innerHTML = `<p>No articles found for this category.</p>`;
        }
    } catch (error) {
        console.error('Failed to load news:', error);
        featuredContent.innerHTML = `<p>Error loading articles. Please try again later.</p>`;
    }
}


categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        loadNews(category);
    });
});

returnHomePage.addEventListener('click', () => {
    document.querySelector('header').scrollIntoView({
        behavior: 'smooth'
    });
});


loadNews();
