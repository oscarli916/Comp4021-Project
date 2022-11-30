const updateRanking = function (username, score) {
  const json = JSON.stringify({ username, score });

  fetch("/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });
};

const gameFinish = () => {
  const line_left = document.getElementById("line-left").innerHTML;
  const line_right = document.getElementById("line-right").innerHTML;

  const score = line_left * 10;

  const player_username = document.getElementById("name-left").innerHTML;
  const opponent_username = document.getElementById("name-right").innerHTML;

  document.getElementById("user").innerHTML = player_username;
  document.getElementById("opponent").innerHTML = opponent_username;

  updateRanking(player_username, score);

  if (line_left < line_right) {
    document.getElementById("result").innerHTML = "You lost..."; //lose
  }
  if (line_left == line_right) {
    document.getElementById("result").innerHTML = "It's a DRAW!"; //draw
  }
  if (line_left > line_right) {
    document.getElementById("result").innerHTML = "You WIN"; //lose
  }
  //lines and scores
  document.getElementById("score").innerHTML = line_left * 10;
  document.getElementById("lines").innerHTML = line_left;

  fetch("/ranking")
    .then((res) => res.json())
    .then((res) => {
      res = res.data;
      res.sort((a, b) => Number(a.score) - Number(b.score));
      const secondbar = (res[3].score / res[4].score) * 100;
      const thirdbar = (res[2].score / res[4].score) * 100;
      const fourthbar = (res[1].score / res[4].score) * 100;
      const fifthbar = (res[0].score / res[4].score) * 100;

      document.getElementById("firstleader-name").innerHTML = res[4].username;
      document.getElementById("firstleader-score").innerHTML = res[4].score;
      document.getElementById("firstleader-bar").style.width = "100%";

      document.getElementById("secondleader-name").innerHTML = res[3].username;
      document.getElementById("secondleader-score").innerHTML = res[3].score;
      document.getElementById("secondleader-bar").style.width = `${secondbar}%`;

      document.getElementById("thirdleader-name").innerHTML = res[2].username;
      document.getElementById("thirdleader-score").innerHTML = res[2].score;
      document.getElementById("thirdleader-bar").style.width = `${thirdbar}%`;

      document.getElementById("fourthleader-name").innerHTML = res[1].username;
      document.getElementById("fourthleader-score").innerHTML = res[1].score;
      document.getElementById("fourthleader-bar").style.width = `${fourthbar}%`;

      document.getElementById("fifthleader-name").innerHTML = res[0].username;
      document.getElementById("fifthleader-score").innerHTML = res[0].score;
      document.getElementById("fifthleader-bar").style.width = `${fifthbar}%`;
    })
    .catch(function (err) {
      console.log("error: " + err);
    });
};
