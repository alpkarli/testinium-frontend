import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CandidateService } from './candidate.service';
import { Candidate } from './candidate';
import { Observable, Subject, from, of } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, filter, startWith, retry
} from 'rxjs/operators';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {

  candidates$: Observable<Candidate[]>;
  private searchTerms = new Subject<string>();

  constructor(private candidateService: CandidateService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCandidates();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  getCandidates(): void {
    this.candidateService.getData().then((data) =>
      this.candidates$ = this.searchTerms.pipe(
        debounceTime(200),
        startWith(''),
        distinctUntilChanged(),
        switchMap((term: string) => {
          return term.trim() ? this.candidateService.search(term) : of(data);
        }),
      )
    );
  }

}
