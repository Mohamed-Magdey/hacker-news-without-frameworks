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

(async () => {
    let data = await getRandomStories(API_URL)

    let allData = await Promise.allSettled(data.map(val => {
        return getStory(API_URL, val);
    }))

    stories = await allData.map(val => val.value).sort((a, b) => a.score - b.score);

    let allUser = await Promise.allSettled(stories.map(val => {
        return getUser(API_URL, val.by);
    }))
    console.log(stories, allUser)
})()

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