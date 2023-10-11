export type AsyncState = 'pending' | 'fulfilled' | 'reject';

export type AsyncType = 'vertical' | 'parallel';

export function sleep(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export class AsyncFunction {
  label;
  color;
  periods;
  wait_milliseconds;

  reset() {
    this.periods = [];
  }

  state(): AsyncState {
    return this.periods.length % 2 === 0 ? 'fulfilled' : 'pending';
  }

  invoke(): Promise<void> {
    console.info(`${this.label} start`);

    return new Promise(resolve =>
      setTimeout(() => {
        console.log(`${this.label} end`);
        resolve();
      },
      this.wait_milliseconds
    ));
  }

  constructor(
    _label: string = '', 
    _color: string = '#aaaaaa',
    _periods: number[] = [], 
    _wait_milliseconds: number = 500
  ) {
    this.label = _label;
    this.color = _color;
    this.periods = _periods;
    this.wait_milliseconds = _wait_milliseconds;
  }
}
