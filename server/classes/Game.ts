import { GameState } from "shared/GameState";

export class Game {
  public state: GameState = GameState.WAITING;
  public players: any[] = [];

  constructor(
    public roomId: string,
  ) {
  }

  public get playerCount(): number {
    return this.players.length;
  }

  public addPlayer(username: string, isHost: boolean = false, isReady: boolean = false) {
    this.players.push({ username, isHost, isReady });
  }

  public markPlayerAsReady(username: string): void {
    this.players.find((player) => player.username === username).isReady = true;
  }

}