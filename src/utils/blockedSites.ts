const sites = [
  "imgur",
  "youtube",
  "reddit",
  "linkedin",
  "news.google",
  "facebook",
];

const blockedSites = sites.map((site) => {
  return new RegExp(
    `https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}${site}.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?`
  );
});

const siteExceptions: string[] = [];
const youtubePlaylistExceptions: string[] = [];

export { blockedSites, siteExceptions, youtubePlaylistExceptions };
