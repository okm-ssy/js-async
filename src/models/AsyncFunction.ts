export type AsyncState = 'pending' | 'fulfilled' | 'reject';

export type AsyncType = 'vertical' | 'parallel';

export function sleep(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export class AsyncFunction {
  label;
  color;
  wait_milliseconds;

  periods: Array<number> = [];

  reset() {
    this.periods = [];
  }

  state(): AsyncState {
    return this.periods.length % 2 === 0 ? 'fulfilled' : 'pending';
  }

  fulfilled(): boolean {
    return this.state() === 'fulfilled';
  }

  pending(): boolean {
    return this.state() === 'pending';
  }

  reject(): boolean {
    return this.state() === 'reject';
  }

  invoke(time: number): Promise<void> {
    this.periods.push(time);
    console.info(`${this.label} start`);

    return new Promise(resolve =>
      setTimeout(() => {
        console.log(`${this.label} end`);
        this.periods.push(time + this.wait_milliseconds / 1000);
        resolve();
      },
      this.wait_milliseconds
    ));
  }

  constructor(
    _label: string = '', 
    _color: string = '#aaaaaa',
    _wait_milliseconds: number = 500
  ) {
    this.label = _label;
    this.color = _color;
    this.wait_milliseconds = Math.floor(_wait_milliseconds / 100) * 100;
  }
}
