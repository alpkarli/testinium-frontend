import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Candidate } from './candidate';
import { Observable, of, from, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  candidates: Candidate[];
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getCandidate(id: number): Observable<Candidate> {
    return this.httpClient
      .get<Candidate>(this.apiUrl + '/' + id)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  handleError(error: HttpErrorResponse) {
    this.router.navigate(['/']);
    return throwError(error);
  }

  getData(): Promise<Candidate[]> {
    return new Promise( (resolve, reject)  => this.httpClient.get<Candidate[]>(this.apiUrl).subscribe((data) => {
      this.candidates = data.sort();
      return resolve(data.sort().sort((a, b) => {
        if (a.name < b.name) return -1;
        return a.name > b.name ? 1 : 0;
      }));
    }));
  }

  getCandidates(): Observable<Candidate[]> {
    return of(this.candidates);
  }

  search(text: string): Observable<Candidate[]> {
    return of(
      this.candidates
        .filter((candidate) =>
          candidate.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        )
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          return a.name > b.name ? 1 : 0;
        })
    );
  }
}
