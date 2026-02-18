document.addEventListener('DOMContentLoaded', () => {
    console.log("Jeu du Juste Prix chargé !");

    let randomNumber = Math.floor(Math.random() * 20) + 1;
    let guesses = [];
    let history = [];
    let gameCount = 0;

    const input = document.getElementById('guess');
    const button = document.getElementById('submitGuess');
    const list = document.getElementById('guessList');
    const historyTable = document.getElementById('historyTable');
    const container = document.querySelector('.jeu-container');

    function resetGame() {
        guesses = [];
        list.innerHTML = "";
        randomNumber = Math.floor(Math.random() * 20) + 1;
        input.value = "";
    }

    button.addEventListener('click', () => {
        const guess = parseInt(input.value);
        if (isNaN(guess) || guess < 1 || guess > 20) {
            alert("Entre un nombre valide entre 1 et 20 !");
            return;
        }

        guesses.push(guess);
        const li = document.createElement('li');
        li.textContent = guess;
        list.appendChild(li);

        if (guess < randomNumber) {
            alert("C’est plus !");
        } else if (guess > randomNumber) {
            alert("C’est moins !");
        } else {
            alert(`Bravo ! Le nombre était ${randomNumber}.`);
            container.classList.add('win');

            setTimeout(() => container.classList.remove('win'), 800);

            gameCount++;
            history.push(guesses.length);

            const row = document.createElement('tr');
            row.innerHTML = `<td>${gameCount}</td><td>${guesses.length}</td>`;
            historyTable.appendChild(row);

            resetGame();
        }

        input.value = "";
    });
});