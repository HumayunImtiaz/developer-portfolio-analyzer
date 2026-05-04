import GithubProfile from '../models/githubProfile.model';
import Repository from '../models/repository.model';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchGithubProfile = async (username: string) => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  // 1. Check if profile exists and is cached within 24 hours
  const cachedProfile = await GithubProfile.findOne({ username: new RegExp(`^${username}$`, 'i') }).populate('repoList');
  if (cachedProfile) {
    const hoursSinceFetch = (Date.now() - cachedProfile.fetchedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceFetch < 24) {
      return { profile: cachedProfile, repos: cachedProfile.repoList };
    }
  }

  // 2. Fetch from GitHub API
  const userRes = await fetch(`${GITHUB_API_URL}/users/${username}`, { headers });
  
  if (userRes.status === 404) {
    throw new Error('GitHub user not found');
  }
  
  if (!userRes.ok) {
    if (userRes.status === 403 || userRes.status === 429) {
      throw new Error('GitHub API limit reached, try later');
    }
    throw new Error('Failed to fetch user from GitHub');
  }

  const userData = await userRes.json();

  // 3. Fetch Repositories
  let reposData: any[] = [];
  let page = 1;
  while (true) {
    const reposRes = await fetch(`${GITHUB_API_URL}/users/${username}/repos?per_page=100&page=${page}`, { headers });
    if (!reposRes.ok) break;
    const pageRepos = await reposRes.json();
    if (pageRepos.length === 0) break;
    reposData = reposData.concat(pageRepos);
    page++;
  }

  // Calculate stats
  let totalStars = 0;
  let totalForks = 0;
  let reposWithReadme = 0; // Requires an extra API call per repo usually, but we will approximate or leave as 0 and adjust if needed, or check repo properties
  const languageMap: Record<string, number> = {};

  const savedRepos = await Promise.all(
    reposData.map(async (repo: any) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
      
      // Approximation for README: Assume true for now as checking each repo takes too many API calls
      // A more robust approach requires checking trees or contents API
      const hasReadme = repo.has_wiki || repo.description ? true : false;
      if (hasReadme) reposWithReadme++;

      return await Repository.findOneAndUpdate(
        { name: repo.name, owner: username },
        {
          name: repo.name,
          language: repo.language,
          commits: repo.size,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          hasReadme,
          owner: username,
          fork: repo.fork,
          updated_at: repo.updated_at,
          html_url: repo.html_url,
          description: repo.description
        },
        { upsert: true, new: true }
      );
    })
  );

  // 4. Save Profile
  const profileStats = {
    totalStars,
    totalForks,
    reposWithReadme,
    languageMap
  };

  const profile = await GithubProfile.findOneAndUpdate(
    { username: new RegExp(`^${username}$`, 'i') },
    {
      username: userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      repoList: savedRepos.map((r) => r._id),
      stats: profileStats,
      fetchedAt: new Date()
    },
    { upsert: true, new: true }
  );

  return { profile, repos: savedRepos };
};
