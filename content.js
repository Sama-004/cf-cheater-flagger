const username = window.location.pathname.split("/").pop();
const url = `https://codeforces.com/api/user.status?handle=${username}`;

let count = 0;
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "OK") {
      data.result.forEach((entry) => {
        if (entry.verdict === "SKIPPED") {
          count++;
        }
      });
    } else {
      console.error("Error fetching data:", data.comment);
    }
    if (count > 0) {
      //console.log("Style implemented");
      document.body.style.backgroundColor = "#ff0000";
      //var elements = document.getElementsByClassName("userbox");
      let elements = document.getElementsByClassName("roundbox"); //this looks much better(take others opinion before using or maybe add options to the user itself to select what he wants)
      //also give user the freedom to select/change color from extension options
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#ff0000";
        //#d4312c
      }
      let title = document.getElementsByClassName("user-rank");
      for (let i = 0; i < title.length; i++) {
        title[i].innerHTML = "Cheater";
      }
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
