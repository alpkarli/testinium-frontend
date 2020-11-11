import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidates/candidate';
import { CandidateService } from '../candidates/candidate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  candidate: Candidate;
  constructor(
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCandidate();
  }

  getCandidate() {
    const id = this.activatedRoute.snapshot.params.id;
    this.candidateService.getCandidate(id).subscribe(
      (data: Candidate) => (this.candidate = data)
    );
  }
}
