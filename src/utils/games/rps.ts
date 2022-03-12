export class RPSGame {
  _p1: string;
  _p2: string;
  _p1Choice: string | undefined;
  _p2Choice: string | undefined;
  _channel: string;

  constructor(p1: string, p2: string, channel: string) {
    this._p1 = p1;
    this._p2 = p2;
    this._p1Choice = undefined;
    this._p2Choice = undefined;
    this._channel = channel;
  }

  get p1(): string {
    return this.p1;
  }

  get p2(): string {
    return this.p2;
  }

  set p1(player: string) {
    this._p1 = player;
  }

  set p2(player: string) {
    this._p2 = player;
  }

  get p1Choice(): string | undefined {
    return this._p1Choice;
  }

  get p2Choice(): string | undefined {
    return this._p2Choice;
  }

  set p1Choice(choice: string | undefined) {
    this._p1Choice = choice;
  }

  set p2Choice(choice: string | undefined) {
    this._p2Choice = choice;
  }

  get channel(): string {
    return this._channel;
  }

  set channel(channel: string) {
    this._channel = channel;
  }
}