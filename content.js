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
      const header = document.createElement("h1");
      //header.textContent = `Skipped Verdicts: ${count}`;
      header.textContent = `Cheater`;
      header.style.color = "#ffffff"; // Example: white text color
      header.style.position = "fixed";
      header.style.top = "0";
      header.style.left = "0";
      header.style.width = "100%";
      header.style.marginBottom = "10px";
      header.style.backgroundColor = "#333"; // Example background color
      document.body.insertBefore(header, document.body.firstChild);
      var elements = document.getElementsByClassName("userbox");
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#ff0000";
      }

      //document.body.appendChild(header);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
