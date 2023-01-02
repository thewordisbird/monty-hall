(function () {
  const root = document.getElementById('root');

  const gameBanner = document.createElement('h1');
  gameBanner.innerText = 'Select a card...';

  const gameCanvas = document.createElement('div');
  gameCanvas.style.height = '400px';
  gameCanvas.style.width = '800px';
  gameCanvas.style.border = '1px solid black';
  gameCanvas.style.display = 'flex';
  gameCanvas.style.flexDirection = 'column';
  gameCanvas.style.justifyContent = 'space-around';
  gameCanvas.style.alignItems = 'center';

  const gameStatusBar = document.createElement('div');
  gameStatusBar.style.height = '50px';
  gameStatusBar.style.border = '1px solid black';
  gameStatusBar.style.width = '90%';
  gameStatusBar.style.display = 'flex';

  const stayBar = document.createElement('div');
  stayBar.style.height = '50px';
  stayBar.style.backgroundColor = 'red';

  const changeBar = document.createElement('div');
  changeBar.style.height = '50px';
  changeBar.style.backgroundColor = 'green';

  gameStatusBar.appendChild(stayBar);
  gameStatusBar.appendChild(changeBar);

  gameCanvas.appendChild(gameStatusBar);

  const playerStatusBar = document.createElement('div');
  playerStatusBar.style.height = '50px';
  playerStatusBar.style.border = '1px solid black';
  playerStatusBar.style.width = '90%';
  playerStatusBar.style.display = 'flex';

  const winBar = document.createElement('div');
  winBar.style.height = '50px';
  winBar.style.backgroundColor = 'green';

  const loseBar = document.createElement('div');
  loseBar.style.height = '50px';
  loseBar.style.backgroundColor = 'red';

  playerStatusBar.appendChild(winBar);
  playerStatusBar.appendChild(loseBar);

  gameCanvas.appendChild(playerStatusBar);

  const cardContainer = document.createElement('div');
  cardContainer.style.display = 'flex';
  cardContainer.style.justifyContent = 'space-around';
  cardContainer.style.width = '100%';
  gameCanvas.appendChild(cardContainer);

  const playAgainButton = document.createElement('button');
  playAgainButton.innerText = 'Play Again';
  playAgainButton.style.height = '50px';
  playAgainButton.style.width = '200px';

  playAgainButton.style.fontSize = '20px';
  playAgainButton.style.cursor = 'pointer';
  playAgainButton.addEventListener('click', handleButtonClick);
  playAgainButton.disabled = true;

  gameCanvas.appendChild(playAgainButton);

  /* Game State */
  function createInitialState() {
    return {
      winningCard: Math.floor(Math.random() * 3),
      selectedCard: null,
      stage: 'select',
      wasSelectionChanged: false,
    };
  }

  let gameState = createInitialState();

  const gameHistory = {
    stayWins: 0,
    changeWins: 0,
    playerWins: 0,
    totalGames: 0,
  };

  /* End Game State */
  const cards = [cardFactory(0), cardFactory(1), cardFactory(2)];

  cards.forEach((card) => {
    cardContainer.appendChild(card);
    card.addEventListener('click', handleCardClick);
  });

  root.appendChild(gameBanner);
  root.appendChild(gameCanvas);

  /* Helper Functions */
  function displayZonk(selected) {
    let isZonkDisplayed = false;
    cards.forEach((card) => {
      // TODO: This should be randomized since this can hint at the winner
      if (card.key === selected) return;
      if (card.key === gameState.winningCard) return;
      if (isZonkDisplayed) return;
      card.innerText = 'Zonk!';
      card.style.backgroundColor = 'red';
      isZonkDisplayed = true;
    });
  }

  function displayWinner() {
    cards.forEach((card) => {
      if (card.key === gameState.winningCard) {
        card.innerText = 'Winner!';
        card.style.backgroundColor = 'green';
      } else {
        card.innerText = 'Zonk!';
        card.style.backgroundColor = 'red';
      }
    });
  }

  function updateWinBar() {
    const stayPercentage =
      (gameHistory.stayWins / gameHistory.totalGames) * 100;
    const changePercentage = 100 - stayPercentage;

    stayBar.style.width = stayPercentage + '%';
    if (stayPercentage > 0) {
      stayBar.innerText = `Stay wins: ${stayPercentage.toFixed(2)}%`;
    }
    changeBar.style.width = changePercentage + '%';
    if (changePercentage > 0) {
      changeBar.innerText = `Change wins: ${changePercentage.toFixed(2)}%`;
    }

    const winPercentage =
      (gameHistory.playerWins / gameHistory.totalGames) * 100;
    const losePercentage = 100 - winPercentage;
    winBar.style.width = winPercentage + '%';
    if (winPercentage > 0) {
      winBar.innerText = `Player won: ${winPercentage.toFixed(2)}%`;
    }
    loseBar.style.width = losePercentage + '%';
    if (losePercentage > 0) {
      loseBar.innerText = `Player Lost: ${losePercentage.toFixed(2)}%`;
    }
  }

  function handleCardClick(event) {
    const selectedCardKey = event.target.key;
    gameState.wasSelectionChanged = gameState.selectedCard !== selectedCardKey;
    gameState.selectedCard = selectedCardKey;

    if (gameState.stage === 'select') {
      gameBanner.innerText = 'You selected ' + gameState.selectedCard;
      displayZonk(gameState.selectedCard);
      gameState.stage = 'change';
      return;
    }

    if (gameState.stage === 'change') {
      const isWinner = gameState.selectedCard === gameState.winningCard;
      gameBanner.innerText = isWinner ? 'You win!' : 'You lose!';

      displayWinner();

      if (isWinner && gameState.wasSelectionChanged) {
        gameHistory.changeWins++;
        gameHistory.playerWins++;
      }

      if (!isWinner && !gameState.wasSelectionChanged) {
        gameHistory.changeWins++;
      }

      if (isWinner && !gameState.wasSelectionChanged) {
        gameHistory.stayWins++;
        gameHistory.playerWins++;
      }

      if (!isWinner && gameState.wasSelectionChanged) {
        gameHistory.stayWins++;
      }

      gameHistory.totalGames++;

      updateWinBar();
      gameState.stage = 'complete';
      playAgainButton.disabled = false;
      return;
    }
  }

  function handleButtonClick(event) {
    if (gameState.stage === 'complete') {
      gameState = createInitialState();
      gameBanner.innerText = 'Select a card...';
      cards.forEach((card) => {
        card.innerText = 'Card ' + card.key;
        card.style.backgroundColor = 'white';
      });
      playAgainButton.disabled = true;
    }
  }

  function cardFactory(key) {
    const card = document.createElement('div');
    card.style.height = '200px';
    card.style.width = '200px';
    card.style.border = '1px solid black';
    card.innerText = 'Card ' + key;
    card.key = key;

    let isShowing = false;
    let isSelected = false;

    function selectCard() {
      isSelected = true;
    }

    function showCard() {
      isShowwing = true;
      card.style.backgroundColor = 'red';
      card.innerText = value;
    }

    card.showCard = showCard;
    card.selectCard = selectCard;
    return card;
  }
})();
