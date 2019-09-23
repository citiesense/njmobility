/*@flow*/
import { createBrowserHistory, createHashHistory } from 'history';
import withQuery from 'history-query-enhancer';
import qs from 'qs';
import type {
  HistoryOpts as BrowserHistoryOpts,
  HistoryOpts as HashHistoryOpts,
} from 'history';

export default (props: BrowserHistoryOpts | HashHistoryOpts) => {
  let history;
  if (process.env.__PROD__) {
    history = createHashHistory(((props: any): HashHistoryOpts));
  } else {
    history = createBrowserHistory(((props: any): BrowserHistoryOpts));
  }
  const transformer = {
    parse: search =>
      qs.parse(search, { arrayLimit: 100, ignoreQueryPrefix: true }),
    stringify: qs.stringify,
  };
  return withQuery(transformer)(history);
};
