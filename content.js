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
      console.log("Style implemented");
      document.body.style.backgroundColor = "#ff0000";
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
