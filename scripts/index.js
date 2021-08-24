// Loader Logic
const loader = document.querySelector(".loader");

const hideLoading = () => {
    loader.classList.add("hide");
}

// DOM Logic
const main_element = document.querySelector('main');

const createDiv = (className) => {
    const div = document.createElement('div');
    div.className = className;

    return div;
}

const createAncor = (href, target, rel) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = target;
    a.rel = rel;

    return a;
}

const createSpan = (text) => {
    const span = document.createElement('span');
    span.innerText = text;

    return span;
}

const renderDom = (story, user) => {
    const article = document.createElement('article');
    const div_story = createDiv('story-image');
    const a_image = createAncor(`${story.url}`, "_blank", "noopener noreferrer");
    const img = document.createElement('img');

    img.src = 'https://facetofaceart.pl/assets/images/placeholder-600x450.jpg';
    img.alt = 'placeholder';
    
    main_element.appendChild(article);
    article.appendChild(div_story);
    div_story.appendChild(a_image);
    a_image.appendChild(img);

    const div_content = createDiv('content');
    const a_link = createAncor(`${story.url}`, "_blank", "noopener noreferrer");
    const head_2 = document.createElement('h2');
    const head_4 = document.createElement('h4');
    const paragraph = document.createElement('p');
    const score = createSpan(`Score: ${story.score}`);
    const karma = createSpan(`Karma: ${user.value.karma}`);
    const date = createSpan(`${story.time * 1000}`);

    head_4.innerText = `Author: ${story.by}`;
    a_link.innerText = `${story.title}`;

    article.appendChild(div_content);
    div_content.appendChild(head_4)
    div_content.appendChild(head_2);
    head_2.appendChild(a_link);
    div_content.appendChild(paragraph);
    paragraph.appendChild(score);
    paragraph.appendChild(karma);
    paragraph.appendChild(date);
}

// Api Logic
const API_URL = "https://hacker-news.firebaseio.com/v0";

const getRandomStories = async (api_url) => {
    try {
        const RANDOM_NUM = 10;
        const URL = `${api_url}/topstories.json`;
        let data = await fetch(URL);
        let stories = await data.json();
        
        return getRandom(stories, RANDOM_NUM);
    } catch(e) {
        console.log(e)
    }
}

const getStory = async (api_url, id) => {
    try {
        const URL = `${api_url}/item/${id}.json`;
        let data = await fetch(URL);
        let story = await data.json();

        return story;
    } catch(e) {
        console.log(e)
    }
}

const getUser = async (api_url, id) => {
    try {
        const URL = `${api_url}/user/${id}.json`;
        let data = await fetch(URL);
        let user = await data.json();

        return user;
    } catch(e) {
        console.log(e)
    }
}

// main function
(async () => {
    try {
        let data = await getRandomStories(API_URL)

        let stories = await Promise.allSettled(data.map(val => {
            return getStory(API_URL, val);
        }))

        stories = await stories.map(val => val.value).sort((a, b) => a.score - b.score);

        let allUser = await Promise.allSettled(stories.map(val => {
            return getUser(API_URL, val.by);
        }))

        stories.forEach((story, i) => {
            renderDom(story, allUser[i]);
        });

        hideLoading();
    } catch(e) {
        console.log(e)
    }
})();

// Customize Random function
const getRandom = (arr, n) => {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

// Dynamic year in copyright
let date = new Date().getFullYear();

document.getElementById("year").innerHTML = date;