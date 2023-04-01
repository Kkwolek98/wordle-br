import { LetterState } from '../../shared/LetterState';
import { Game } from './Game';
export class Round {
  private word: string;
  public playerGuesses: any[] = [];
  public winner: string = '';


  constructor(
    private nextRound: Function,
    players: any[]
  ) {
    const randomIndex = Math.floor(Math.random() * words.length);
    this.word = words[randomIndex];
    console.log(`Word is ${this.word}`);

    players.forEach((player) => {
      this.playerGuesses.push(
        {
          username: player.username,
          guesses: [],
          state: 'inProgress',
        }
      )
    });
  }

  public makeGuess(word: string, username: string) {
    let guess: LetterState[] = [];

    word.toUpperCase().split('').forEach((guessedLetter: string, i: number) => {
      if (guessedLetter === this.word.charAt(i)) {
        guess.push(LetterState.RIGHT_ORDER);
      } else if (this.word.includes(guessedLetter)) {
        guess.push(LetterState.WRONG_ORDER);
      } else {
        guess.push(LetterState.DOESNT_OCCUR);
      }
    });

    this.addGuessToPlayer(username, guess);

    const player = this.getPlayerByUsername(username);
    const guessStatistics = this.getGuessStatistics(guess);

    if (guessStatistics[LetterState.RIGHT_ORDER] === this.word.length) {
      player.state = 'won';
      this.winner = player.username;
      this.nextRound();
    } else if (player.guesses.length === 6) {
      player.state = 'lost';
    }

  }

  private addGuessToPlayer(username: string, guess: LetterState[]): void {
    const player = this.getPlayerByUsername(username);

    player.guesses.push(guess);
  }

  private getPlayerByUsername(username: string): any {
    const player = this.playerGuesses.find((player) => player.username === username);
    return player;
  }

  private getGuessStatistics(guess: LetterState[]): { [key in LetterState]: number } {
    const guessStatistics = {
      [LetterState.DOESNT_OCCUR]: 0,
      [LetterState.WRONG_ORDER]: 0,
      [LetterState.RIGHT_ORDER]: 0,
      [LetterState.NOT_GUESSED]: 0
    };

    guess.forEach((letterState) => guessStatistics[letterState]++);

    return guessStatistics;
  }
}

const words = ['KAMYK', 'SZYLD', 'SZKŁO', 'PALIĆ', 'LUMEN', 'BYDLĘ', 'DOMEK', 'GRACZ', 'SŁOWO'];