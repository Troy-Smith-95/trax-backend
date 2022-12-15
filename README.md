
# Trax 🎵🎤

Trax leverages the Spotify API to obtain the audio anaylsis of thousands of popular tracks within different genres and averages them by genre on a weekly basis. This anaylsis can then be viewed on the front end in a clean and consise manner. 

Trax was developed for musicians that are in the process of making new music. They can gain valuable insights into how their genre may be changing and adapt their music accordingly. This could mean making their song duration more closely match the average, make their music more energetic etc. Trax in a future update will also be able to generate playlists based on a specific audio profile so artists can find new musical influces or explore new sounds.

## 📸 Screenshots

Landing Page

![Landing Page](https://user-images.githubusercontent.com/114879201/207756585-93c3acb3-5e5b-4a07-9c9b-c39d5265f219.png)

Dashboard

![Dasboard](https://user-images.githubusercontent.com/114879201/207756636-3e6f2b51-5677-4d7d-aa6a-1f8ef14cb733.png)


## 👾 Tech Stack

**Client:** React, Axios, Sass, Chart.js, framer

**Server:** Node, Express, Knex, MySQL2, Axios, Spotify API


## 🎯 Features

- Pulls data for thousands of songs via spotify API while handling any errors to make sure data collection completes without crashing
- Averages out the data for thousands of songs to generate weekly insights and trends
- Uses progress bars and charts to cleanly display data
- How to feature explains the platform to the user
- Infomation icons in dashboard provide the user more context on specific features
- Reponsive design from mobile to desktop
- Animations on navigation menu and other elements to elevate user experience

## 🔑 Environment Variables 

To run this project, you will need to add the following environment variables to your .env file

In frontent:
`REACT_APP_URL`

In backend:
`PORT`
`DB_NAME`
`DB_USER`
`DB_PASSWORD`
`URL_TOKEN`
`CLIENT_ID`
`CLIENT_SECRET`

## 🗺 API Reference

#### Get all genres

```http
  GET /genres
```

Return:

[
    {
        id: 1, 
        genre_name: 'Hip-Hop', 
        slug: 'hip-hop'
    },
    ...
]

#### Get genre audio features

```http
  GET /genres/${id}/audio-features
```

| Parameter | Type      | Description                             |
| :-------- | :-------  | :-------------------------------------  |
| `id`      | `integer` | **Required**. Id of genre to fetch audio feature data |

Return:

[
    {
        acousticness: 0.200109,
        created_at: 1670962563106,
        danceability: 0.64718539,
        duration_ms: 193080,
        energy: 0.66188049,
        genre_id: 2,
        id: "a66b79cd-f1bd-4cfb-96a8-1fcf16505cc5",
        instrumentalness: 0.01155671,
        key: 2,
        liveness: 0.1698139,
        loudness: -5.94695616,
        mode: 1,
        speechiness: 0.07239707,
        tempo: 125.5643158,
        time_signature: 4,
        valence: 0.50271881
    },
    ...
]



## ⚙️ Installation

For local Installation

Frontend

Clone the project front end

```bash
  git clone git@github.com:Troy-Smith-95/trax-frontend.git
```

Go to project directory

```bash
  cd trax-frontend
```

Install dependencies 

```bash
  npm i
```

Run project

```bash
  npm start
```

*Note: It may be beneficial for demo purposes to use mock data for chart. To do this, go to the LineChart.jsx file where there are the variables called labels and data. There are currently two sets of each variable, one active and one commented out. Switch the active and commented out variables to view the mock data. 

Backend 

Clone the project backend

```bash
  git clone git@github.com:Troy-Smith-95/trax-backend.git
```

Go to project directory

```bash
  cd trax-backend
```
Install dependencies 

```bash
  npm i
```

Create database with same name that you specify in .env  (I recommend using trax)

Migrate tables

```bash
  npm run migrate
```

Seed tables 

```bash
  npm run seed
```

To collect data uncomment the following line of code in index.jsx. Re-comment that line of code to have the server run without collecting data

```bash
  populateData();
```

To run server

```bash
  npm run dev
```

*Note: An older verison of Axios (1.1.3) is used to work properly with the Spotify API. Additionally, it can take 15+ minutes to collect data due to the API calls being slowed to avoid hitting the rate limit


## 🧑‍🎓 Lessons Learned

I learned how to used async await to make my code run in a synchronous fashion as lots of operations in my backend require data from previous operations. I learned how to code robust error handling to make sure I could run thousands of API calls in a short period of time to collect data without crashing (this also involved accounting for rate limits). For exmaple, I wrapped a lot of my API calls in async funcitons and called them recursively if an error was thrown to try again (tries were tracked and recurisve calls terminated after a certain amount of times to avoid inifinte loops). I utilized chart.js for the first time and a progress bar library to display my data on the front end. The framer library to simplify certain animations. I gained further experince with keyframe animations and conditional rendering of components and classes. 

## 🧭 Roadmap

- Add user login and third part sign-in/OAuth with Spotify

- Add funcitonilty to search for other music (songs, albums, playlists) to analyze and compare against genres

- Ability to save this music to your account to reference in the future

- Add inspiration generator - ability to find new songs and generate playlists based around certain audio profiles to help artists find new influences
