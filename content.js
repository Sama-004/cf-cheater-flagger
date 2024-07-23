const CONTEST_THRESHOLD = 1000000000;

function FuckTheProfile(username) {
  const infoDiv = document.querySelector('.info');

  // This is for adding the clown badge.
  const badgeDiv = document.createElement('div');
  badgeDiv.className = 'badge';

  const badgeImg = document.createElement('img');
  badgeImg.src = 'https://github.com/Sama-004/cf-cheater-flagger/assets/70210929/05943035-384b-4a39-b37e-0f7c3e6d1faa';

  badgeImg.title = 'Badge of disgrace for cheating on Codeforces';
  badgeDiv.appendChild(badgeImg);

  const firstChild = infoDiv.firstElementChild;
  if (firstChild) {
    firstChild.classList.add('main-info-has-badge'); // add predefined styles for the badge
  }

  // Change the user avatar
  const imgElement = document.querySelector(
    '.title-photo > div > div > div > img',
  );

  if (imgElement) {
    imgElement.src = 'https://pbs.twimg.com/media/GFLLhcCWIAAvuLp.jpg';
    imgElement.width = 200;
    imgElement.height = 200;
  }

  infoDiv.insertBefore(badgeDiv, firstChild);

  // This changes user rank to cheater
  let rank = document.getElementsByClassName('user-rank');
  for (let i = 0; i < rank.length; i++) {
    rank[i].innerHTML = 'Cheater';
    rank[i].style.color = 'gray';
    rank[i].style.fontWeight = 'bold';
  }

  // This changes username color
  const name = document.querySelector('.main-info > h1> a.rated-user');
  if (name) {
    // console.log(name);
    name.style.backgroundColor = 'black';
    name.title = `Cheater ${username}`;
    name.style.setProperty('color', 'white', 'important');
  }
}

function isCheatedContest(contest, username) {
  // const totalCount = submissions.length;
  const verdictCount = {};

  contest.forEach((entry) => {
    if (!verdictCount[entry.verdict]) {
      verdictCount[entry.verdict] = 0;
    }
    verdictCount[entry.verdict] += 1;
    if (entry.verdict === 'SKIPPED') {
      console.log(`https://codeforces.com/submissions/${username}/contest/${entry.contestId}`)
    }
  });

  // console.log(contest[0].contestId, verdictCount);
  return verdictCount['SKIPPED'] && !(verdictCount['OK'] || verdictCount['PARTIAL']);
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

async function getContests(username) {
  let contests = [];
  let submissionsFetched = 0;

  // Fetch one extra contest to make sure the last contest was fully fetched.
  for (let from = 1, count = 100; contests.length <= CONTEST_THRESHOLD; from += count) {
    const url = `https://codeforces.com/api/user.status?handle=${username}&from=${from}&count=${count}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.comment);
    }

    if (data.result.length === 0) {
      break;
    }

    submissionsFetched += data.result.length;
    const newContests = groupRelevantSubmissionsByContestId(data.result);

    // If the first of the new fetched contest is a continuation of an old contest then merge them.
    if (contests.length !== 0
      && newContests.length !== 0
      && contests[contests.length - 1][0].contestId === newContests[0][0].contestId) {
      contests[contests.length - 1].push(...newContests.shift());
    }

    contests.push(...newContests);
  }

  // console.log(`Fetched ${submissionsFetched} submissions`);
  return contests;
}

async function getCheatedContestIndex(username) {
  const contests = await getContests(username);
  // return contests.findIndex(isCheatedContest);
  return contests.findIndex(contest => isCheatedContest(contest, username));
}

function isCheaterByIndex(index) {
  return index !== -1 && index < CONTEST_THRESHOLD;
}

async function main() {
  const username = window.location.pathname.replace(/\/+$/, '').split('/').pop();

  const index = await getCheatedContestIndex(username);
  if (isCheaterByIndex(index)) {
    FuckTheProfile(username);
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();
