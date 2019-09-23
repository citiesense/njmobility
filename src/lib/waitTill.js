/*@flow*/

export default (fn: () => boolean, ms: number = 100): Promise<void> =>
  new Promise(res => {
    if (fn()) {
      res();
    } else {
      const timer = setInterval(() => {
        if (fn()) {
          clearInterval(timer);
          res();
        }
      }, ms);
    }
  });
