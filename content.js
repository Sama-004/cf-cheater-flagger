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

      console.log("Contests data:", contests);

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
      console.log("Is cheater?", cheater);
      if (cheater) {
        document.body.style.backgroundColor = "#ff0000";
        //var elements = document.getElementsByClassName("userbox");
        let elements = document.getElementsByClassName("roundbox"); //this looks much better(take others opinion before using or maybe add options to the user itself to select what he wants)
        //also give user the freedom to select/change color from extension options
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.backgroundColor = "#ff0000";
          //#d4312c
        }
        let rank = document.getElementsByClassName("user-rank");
        for (let i = 0; i < rank.length; i++) {
          rank[i].innerHTML = "Cheater";
        }
      }
    } else {
      console.error("Error fetching data", data.comment);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
