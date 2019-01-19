import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  generate(data) {
    if (data) {
      console.log("Generating melody...");

      return this.http.post('generate-melody', data, {responseType: 'arraybuffer'})
        .pipe(
          tap(_ => console.log('Generated melody')),
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
