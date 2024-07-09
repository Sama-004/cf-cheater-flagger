// intensity is how the profile should be treated.
// It should be calculated based on the time of submission of skipped submissions.
function FuckTheProfile() {
  const infoDiv = document.querySelector(".info");

  // This is for adding the clown badge.
  const badgeDiv = document.createElement("div");
  badgeDiv.className = "badge";

  const badgeImg = document.createElement("img");
  badgeImg.src = "https://github.com/Sama-004/cf-cheater-flagger/assets/70210929/05943035-384b-4a39-b37e-0f7c3e6d1faa";

  badgeImg.title = "Badge of disgrace for cheating on Codeforces";
  badgeDiv.appendChild(badgeImg);

  const firstChild = infoDiv.firstElementChild;
  if (firstChild) {
    firstChild.classList.add("main-info-has-badge"); // add predefined styles for the badge
  }

  // Change the user avatar
  const imgElement = document.querySelector(
    ".title-photo > div > div > div > img",
  );

  if (imgElement) {
    imgElement.src = "https://pbs.twimg.com/media/GFLLhcCWIAAvuLp.jpg";
    imgElement.width = 200;
    imgElement.height = 200;
  }

  infoDiv.insertBefore(badgeDiv, firstChild);

  // This changes user rank to cheater
  let rank = document.getElementsByClassName("user-rank");
  for (let i = 0; i < rank.length; i++) {
    rank[i].innerHTML = "Cheater";
    rank[i].style.color = "gray";
    rank[i].style.fontWeight = "bold";
  }

  // This changes username color
  const name = document.querySelector(".main-info > h1> a.rated-user");
  if (name) {
    // console.log(name);
    name.style.backgroundColor = "black";
    name.title = `Cheater ${username}`;
    name.style.setProperty("color", "white", "important");
  }
}

function isObscureLanguage(language) {
  const popularLanguages = ['pypy', 'python', 'c++', 'java'];
  language = language.toLowerCase();
  return !popularLanguages.some(l => language.includes(l))
}

function isCheatedContest(submissions) {
  // const totalCount = submissions.length;
  const verdictCount = {};

  submissions.forEach((entry) => {
    if (!verdictCount[entry.verdict]) {
      verdictCount[entry.verdict] = 0;
    }
    verdictCount[entry.verdict] += 1;
  });

  // console.log(submissions[0].contestId, verdictCount);
  return verdictCount['SKIPPED'] && !verdictCount['OK'];
}

function groupRelevantSubmissionsByContestId(submissions) {
  // Count submissions only in a contest and not out of contest.
  const contestSubmissions = submissions.filter((entry) => {
    const participantType = entry.author.participantType;
    return participantType === 'CONTESTANT' || participantType === 'OUT_OF_COMPETITION';
  });

  const submissionsByContestId = Object.entries(Object.groupBy(contestSubmissions, (entry) => entry.contestId))
    .sort((a, b) => a[1][0].id < b[1][0].id ? 1 : -1).map((s) => s[1]);
  return submissionsByContestId;
}

function indexOfLatestCheatedContest(submissionsByContestId) {
  return submissionsByContestId.findIndex(isCheatedContest);
}

async function getUserRating(username) {
  const url = `https://codeforces.com/api/user.rating?handle=${username}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(data.comment);
  }

  return (data.result.length === 0) ? 0 : data.result[data.result.length - 1].newRating;
}

const CONTEST_THRESHOLD = 8;
const RATING_THRESHOLD = 2100;

const username = window.location.pathname.replace(/\/+$/, '').split("/").pop();

async function main() {
  const userRating = await getUserRating(username);
  // console.log(`${username} is ${userRating} rated`);
  if (userRating >= RATING_THRESHOLD) {
    return;
  }

  let submissionsByContestId = [];
  let submissionsFetched = 0;

  // Fetch one extra contest to make sure the last contest was fully fetched.
  for (let from = 1, count = 100; submissionsByContestId.length <= CONTEST_THRESHOLD; from += count) {
    const url = `https://codeforces.com/api/user.status?handle=${username}&from=${from}&count=${count}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(data.comment);
    }

    if (data.result.length === 0) {
      break;
    }

    submissionsFetched += data.result.length;
    const newSubmissionsByContestId = groupRelevantSubmissionsByContestId(data.result);

    // If the first of the new fetched contest is a continuation of an old contest then merge them.
    if (submissionsByContestId.length !== 0
      && newSubmissionsByContestId.length !== 0
      && submissionsByContestId[submissionsByContestId.length - 1][0].contestId === newSubmissionsByContestId[0][0].contestId) {
      submissionsByContestId[submissionsByContestId.length - 1].push(...newSubmissionsByContestId.shift());
    }

    submissionsByContestId.push(...newSubmissionsByContestId);
  }

  // console.log(`Fetched ${submissionsFetched} submissions`);
  const index = indexOfLatestCheatedContest(submissionsByContestId);
  if (index !== -1 && index < CONTEST_THRESHOLD) {
    FuckTheProfile();
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();
