const username = window.location.pathname.split("/").pop();
const url = `https://codeforces.com/api/user.status?handle=${username}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "OK") {
      const contests = {};

      // Process each submission
      data.result.forEach((entry) => {
        const contestId = entry.contestId;
        //Count submissions only in a contest and not out of contest
        const participantType = entry.author.participantType;
        if (participantType !== "PRACTICE") {
          if (!contests[contestId]) {
            contests[contestId] = {
              totalSubmissions: 0,
              skipped: 0,
            };
          }
          contests[contestId].totalSubmissions++;
          if (entry.verdict === "SKIPPED") {
            contests[contestId].skipped++;
          }
        }
      });

      //console.log("Contests data:", contests);

      //Cheated if all the solutions are skipped in a contest
      let cheater = false;
      for (const contestId in contests) {
        if (
          contests[contestId].totalSubmissions === contests[contestId].skipped
        ) {
          cheater = true;
          break;
        }
      }
      //console.log("Is cheater?", cheater);

      if (cheater) {
        const infoDiv = document.querySelector(".info");

        const badgeDiv = document.createElement("div");
        badgeDiv.className = "badge";

        const badgeImg = document.createElement("img");
        badgeImg.src =
          "https://github.com/Sama-004/cf-cheater-flagger/assets/70210929/05943035-384b-4a39-b37e-0f7c3e6d1faa";

        badgeImg.title = "Badge of disgrace for cheating on Codeforces";
        badgeDiv.appendChild(badgeImg);

        const firstChild = infoDiv.firstElementChild;
        if (firstChild) {
          firstChild.classList.add("main-info-has-badge");
        }
        const imgElement = document.querySelector(
          ".title-photo > div > div > div > img",
        );

        if (imgElement) {
          imgElement.src = "https://pbs.twimg.com/media/GFLLhcCWIAAvuLp.jpg";
          imgElement.width = 200;
          imgElement.height = 200;
        }
        infoDiv.insertBefore(badgeDiv, firstChild);
        let rank = document.getElementsByClassName("user-rank");
        for (let i = 0; i < rank.length; i++) {
          rank[i].innerHTML = "Cheater";
          rank[i].style.color = "gray";
          rank[i].style.fontWeight = "bold";
        }
      }
    } else {
      console.error("Error fetching data", data.comment);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
