import { Observable, merge } from 'rxjs';
import { MyNews, NewsAPI } from 'src/news/interfaces/news';
import { reduce } from 'rxjs/operators';

interface ErrorMessage {
  statusCode: number;
  error: string;
  message: string;
}

export enum codes {
  'OK' = 200,
  'CREATED' = 201,
  'NO CONTENT' = 204,
  'BAD REQUEST' = 400,
  'UNAUTHORIZED' = 401,
  'FORBIDDEN' = 403,
  'NOT FOUND' = 404,
  'METHOD NOT ALLOWED' = 405,
  'CONFLICT' = 409,
  'INTERNAL SERVER ERROR' = 500,
  'SERVIDE UNAVAILABLE' = 503,
}

export function generateMessage(code: number, message = ''): ErrorMessage {
  return {
    statusCode: code,
    error: codes[code],
    message,
  };
}

export function mergeNews(
  nyNews: Observable<MyNews[]>,
  guardianNews: Observable<MyNews[]>,
  newsApi: Observable<MyNews[]>,
): Observable<MyNews[]> {
  return merge(nyNews, guardianNews, newsApi).pipe(
    reduce((acum, val) =>
      [...acum, ...val].sort((a, b) => {
        return a.webPublicationDate > b.webPublicationDate ? -1 : 1;
      }),
    ),
  );
}
