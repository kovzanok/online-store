export default class Timer {
  element: HTMLElement;

  seconds: number;

  timerID: NodeJS.Timer;

  current: number;

  constructor(element: HTMLElement, seconds: number) {
    this.element = element;
    this.seconds = seconds;
    this.current = seconds;
    this.timerID = setInterval(() => {}, 1000);
  }

  start() {
    this.timerID = setInterval(() => {
      this.handleOneSecond();
    }, 1000);
  }

  handleOneSecond() {
    this.element.textContent = String(this.current);
    if (this.current === 0) {
      clearInterval(this.timerID);
      this.redirectToMain();
    } else {
      this.current -= 1;
    }
  }

  redirectToMain() {
    const newUrl = window.location.origin;

    const pageChangeEvent = new Event('pagechange');
    window.dispatchEvent(pageChangeEvent);

    history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const hashChange = new Event('hashchange');
    window.dispatchEvent(hashChange);
  }
}
