import { Game } from "./Game";

export class GamePool {
  private static instances: Game[] = [];

  public static add(game: Game): void {
    GamePool.instances.push(game);
  }

  public static getGameByRoomId(roomId: string): Game | undefined {
    return GamePool.instances.find((instance) => instance.roomId === roomId);
  }
}
