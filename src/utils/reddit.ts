import { fetchAPI, randomArray } from "."

interface RedditPost {
  subreddit: string;
  title: string;
  hidden: boolean;
  name: string;
  upvote_ratio: number;
  ups: number;
  url_overridden_by_dest: string | null;
  over_18: boolean;
  permalink: string;
  url: string;
}

export default {
  options: {
    timeframe: ["week", "month", "year", "all"],
    listing: ["best", "hot", "random", "rising", "top"]
  },
  carSubreddits: [
    "cars",
    "carporn",
    "classiccars",
    "Autos",
    "spotted",
    "shootingcars",
    "rallyporn",
    "JDM",
    "excoticspotting",
    "BMW",
    "Porsche",
    "Mustang",
    "Subaru",
    "Audi",
    "Honda",
    "Miata",
    "mercedes_benz",
    "thegrandtour",
    "amg",
    "foxmustang",
    "golfgti",
    "lexus",
    "nissan",
    "subaru",
    "volvo",
    "alfaromeo",
    "audis4",
    "audia4b6",
    "e46",
    "e39",
    "e90",
    "chevrolet",
    "chevy",
    "camaro",
    "corvette",
    "datsun",
    "fairladyZ",
    "charger",
    "dodge",
    "challenger",
    "viper",
    "ferrari",
    "458",
    "hyundai",
    "rotaries",
    "lancer",
    "mitsubishievolution",
    "skyline",
    "GTR",
    "opel",
    "peugeot",
    "saab",
    "wrx",
    "volkswagen",
    "golf_r",
    "cardocs",
    "wagons",
    "vintagejapaneseautos",
  ],
  pickPost: async function (type: string, posts: RedditPost[]): Promise<RedditPost> {
    let validPosts: RedditPost[] = [];
    posts.forEach(post => {
      if (post.over_18 === false && post.url_overridden_by_dest !== null) {
        validPosts.push(post);
      }
    });

    if (validPosts.length === 0) {
      this.getRandomPost(type, randomArray(this.carSubreddits));
    }

    return randomArray(validPosts);
  },
  getRandomPost: async function (type: string, subreddit: string): Promise<RedditPost | string> {
    const link = `http://reddit.com/r/${subreddit}/${randomArray(this.options.listing)}.json?limit=100&t=${randomArray(this.options.timeframe)}`;
    let req = await fetchAPI(link);
    if (req.error) return req.defaultMessage;

    let found = (req.data.data === undefined) ? req.data[0].data.children : req.data.data.children;
    let posts: RedditPost[] = [];
    found.forEach((post: any) => {
      let newPost: RedditPost = {
        subreddit: post.data.subreddit,
        title: post.data.title,
        hidden: post.data.hidden,
        name: post.data.name,
        upvote_ratio: post.data.upvote_ratio,
        ups: post.data.ups,
        url_overridden_by_dest: (post.data.url_overridden_by_dest === undefined) ? null : post.data.url_overridden_by_dest,
        over_18: post.data.over_18,
        permalink: post.data.permalink,
        url: post.data.url,
      };

      posts.push(newPost);
    });

    let chosen = await this.pickPost(type, posts);
    return chosen;
  }
}