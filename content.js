const username = window.location.pathname.split('/').pop();
const url = `https://codeforces.com/api/user.status?handle=${username}`;

let count=0;
fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'OK') {
      data.result.forEach(entry => {
        if (entry.verdict === 'SKIPPED') {
            count++;
          //console.log(entry);
        }
      });
    } else {
      console.error('Error fetching data:', data.comment);
    }
      console.log(count)
  })
  .catch(error => {
    console.error('Error:', error);
  });
