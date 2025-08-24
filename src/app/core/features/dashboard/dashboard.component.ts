import { Component, OnInit } from '@angular/core';
import { JobService } from '../../core/services/job.service';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  jobs$!: Observable<any>;
  loading = false;
  totalJobs = 0;
  pageSize = 10;
  pageIndex = 0;
  displayedColumns: string[] = ['id', 'filename', 'fileType', 'uploadDate', 'status', 'actions'];

  constructor(
    private jobService: JobService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.jobs$ = this.jobService.getJobs(this.pageIndex, this.pageSize);
    this.jobs$.subscribe({
      next: (response: any) => {
        this.totalJobs = response.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadJobs();
  }

  viewJobDetails(jobId: number): void {
    // Navigate to job details page
  }
}
