import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import { of } from "rxjs/internal/observable/of";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  generate(data) {

    if (data) {
      return this.http.post('generate-melody', data)
        .pipe(
          map(data => data),
          catchError(this.handleError('generate-melody', 'Generate melody failed'))
        );
    }
  }

  private handleError<T>  (operation = 'operation', result?: T)  {
    return (error: {}): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
