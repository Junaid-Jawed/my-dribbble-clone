


import fs from 'fs';

// CONFIGURATION
const API_KEY = "FPSX33d1623863393255744b5a10101ede84"; // <--- KEY GOES HERE
const SEARCH_TERM = "website landing page ui mockup"; // <--- NEW TARGET

// HELPER POOLS
const authors = ["PixelGod", "Design_Alice", "UI_Ninja", "Creative_Bob", "Studio_Z", "Vector_Vicky"];
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// TRASH FILTER (Banning generic vectors)
const BANNED_WORDS = ["icon", "vector", "set", "logo", "glyph", "simple", "flat", "isolated", "collection", "template"];

async function runHeist() {
  console.log(`\n🕵️  STARTING THE HEIST: TARGET = "${SEARCH_TERM}"...`);
  console.log("-----------------------------------");

  try {
    // 1. FETCH MAX ALLOWED (100)
    const url = `https://api.freepik.com/v1/resources?locale=en-US&page=1&limit=100&order=latest&term=${encodeURIComponent(SEARCH_TERM)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept-Language': 'en-US',
        'X-Freepik-API-Key': API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SERVER SAID: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const rawItems = data.data;

    console.log(`✅  DOWNLOADED ${rawItems.length} ITEMS.`);

    // 2. FILTER GARBAGE
    let validPosts = [];
    let idCounter = 1;

    for (const item of rawItems) {
      const titleLower = (item.title || "").toLowerCase();
      const isTrash = BANNED_WORDS.some(word => titleLower.includes(word));

      // Must have an image source to be valid
      if (!isTrash && item.image && item.image.source) {
        validPosts.push({
          id: idCounter++,
          image: item.image.source.url, // High quality URL
          post_title: item.title ? item.title.substring(0, 40) : "Web UI Concept",
          post_author: item.author?.name || getRandom(authors),
          post_date: `2025-0${getRandomInt(1, 9)}-${getRandomInt(10, 28)}`,
          post_viewcount: getRandomInt(1200, 90000),
          post_body: `Professional Web Design resource ID: ${item.id}. Filtered for quality.`,
          recommended_posts: [] 
        });
      }
    }

    console.log(`🗑️  TRASHED ${rawItems.length - validPosts.length} GENERIC TEMPLATES.`);
    console.log(`💎  KEPT ${validPosts.length} HIGH QUALITY WEB SHOTS.`);

    // 3. GENERATE RECOMMENDATIONS
    validPosts.forEach(post => {
      const recs = [];
      if (validPosts.length > 3) {
        while (recs.length < 3) {
          const random = validPosts[Math.floor(Math.random() * validPosts.length)];
          if (random.id !== post.id && !recs.find(r => r.id === random.id)) {
            recs.push({ id: random.id, title: random.post_title, image: random.image });
          }
        }
      }
      post.recommended_posts = recs;
    });

    // 4. WRITE TO FILE
    const outputPath = './fake_db.json'; 
    fs.writeFileSync(outputPath, JSON.stringify(validPosts, null, 2));

    console.log(`💾  SAVED TO: ${outputPath}`);
    console.log("-----------------------------------");
    console.log("✨  REFRESH YOUR BROWSER NOW.");

  } catch (error) {
    console.error("\n❌  HEIST FAILED:", error.message);
  }
}

runHeist();