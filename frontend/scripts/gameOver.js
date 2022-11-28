
const gameOver = () => {
    fetch('statistic.json')
        .then(res => res.json())
        .then((res) => {

            console.log("next");
            res.sort((a, b) => Number(a.score) - Number(b.score));
            
            
            var secondbar = (res[3].score/res[4].score)*100;
            var thirdbar = (res[2].score/res[4].score)*100;
            var fourthbar = (res[1].score/res[4].score)*100;
            var fifthbar = (res[0].score/res[4].score)*100;
            console.log(secondbar);
            console.log(thirdbar);
            console.log(fourthbar);
            console.log(fifthbar);

            document.getElementById('firstleader-name').innerHTML = res[4].username;
            document.getElementById('firstleader-score').innerHTML = res[4].score;
            document.getElementById('firstleader-bar').style.width = "100%";

            document.getElementById('secondleader-name').innerHTML = res[3].username;
            document.getElementById('secondleader-score').innerHTML = res[3].score;
            document.getElementById('secondleader-bar').style.width = `${secondbar}%`;

            document.getElementById('thirdleader-name').innerHTML = res[2].username;
            document.getElementById('thirdleader-score').innerHTML = res[2].score;
            document.getElementById('thirdleader-bar').style.width = `${thirdbar}%`;

            document.getElementById('fourthleader-name').innerHTML = res[1].username;
            document.getElementById('fourthleader-score').innerHTML = res[1].score;
            document.getElementById('fourthleader-bar').style.width = `${fourthbar}%`;

            document.getElementById('fifthleader-name').innerHTML = res[0].username;
            document.getElementById('fifthleader-score').innerHTML = res[0].score;
            document.getElementById('fifthleader-bar').style.width = `${fifthbar}%`;
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });
}