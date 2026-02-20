document.addEventListener('DOMContentLoaded', () => {
    console.log("Jeu du Juste Prix chargé !");

    let randomNumber = Math.floor(Math.random() * 20) + 1;
    let guesses = [];
    let history = [];
    let gameCount = 0;

    const input = document.getElementById('guess');
    const button = document.getElementById('submitGuess');
    const guessList = document.getElementById('guessList');
    const guessStatus = document.getElementById('guessStatus');
    const historyTable = document.getElementById('historyTable');
    const container = document.querySelector('.jeu-container');

    function resetGame() {
        guesses = [];
        if (guessList) {
            guessList.innerHTML = "";
        }
        if (guessStatus) {
            guessStatus.textContent = "Nouvelle partie commencée.";
        }
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
        if (guessList) {
            const li = document.createElement('li');
            li.textContent = String(guess);
            li.setAttribute('aria-label', `Coup ${guesses.length}: ${guess}`);
            guessList.appendChild(li);
        }
        if (guessStatus) {
            guessStatus.textContent = `Coup ${guesses.length} enregistré : ${guess}.`;
        }

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

            if (guessStatus) {
                guessStatus.textContent = `Partie gagnée en ${guesses.length} coups.`;
            }
            resetGame();
        }

        input.value = "";
    });
});
