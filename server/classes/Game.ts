import { Subject } from "rxjs";
import { GameState } from "shared/GameState";
import { Round } from "./Round";

export class Game {
  public state: GameState = GameState.WAITING;
  public players: any[] = [];
  public rounds: Round[] = [];

  private roundLimit = 1;
  private readySubject$: Subject<null> = new Subject();

  constructor(
    public roomId: string,
  ) {
    this.readySubject$.subscribe(() => {
      if (
        this.playerCount >= 2
        && this.playersReadyCount >= this.playerCount / 2
        && this.state === GameState.WAITING
      ) {
        this.state = GameState.READY;
      } else if (this.state === GameState.READY) {
        this.state = GameState.WAITING;
      }
    });
  }

  public get playerCount(): number {
    return this.players.length;
  }

  public get playersReadyCount(): number {
    return this.players.filter((player) => player.isReady).length;
  }

  public get currentRound(): Round {
    return this.rounds[this.rounds.length - 1];
  }

  public addPlayer(username: string, isHost: boolean = false, isReady: boolean = false) {
    this.players.push({ username, isHost, isReady });
  }

  public markPlayerAsReady(username: string): void {
    this.players.find((player) => player.username === username).isReady = true;
  }

  public startGame(): void {
    this.state = GameState.ONGOING;
    this.rounds.push(new Round(() => this.nextRound(), this.players));
  }

  public nextRound(): void {
    if (this.rounds.length < this.roundLimit) {
      this.rounds.push(new Round(() => this.nextRound(), this.players));
    } else {
      this.state = GameState.OVER;
    }

  }

}