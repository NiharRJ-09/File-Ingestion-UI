import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from './file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  uploadForm: FormGroup;
  fileToUpload: File | null = null;
  loading = false;
  supportedFileTypes = ['CSV', 'JSON', 'EXCEL'];

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      fileType: ['CSV', Validators.required],
      validationConfigId: ['']
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.fileToUpload) {
      this.snackBar.open('Please select a file to upload', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('fileType', this.uploadForm.get('fileType')?.value);

    const validationConfigId = this.uploadForm.get('validationConfigId')?.value;
    if (validationConfigId) {
      formData.append('validationConfigId', validationConfigId);
    }

    this.fileUploadService.uploadFile(formData)
      .subscribe({
        next: response => {
          this.loading = false;
          this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 });
          this.fileToUpload = null;
          this.uploadForm.reset({ fileType: 'CSV' });
        },
        error: error => {
          this.loading = false;
          this.snackBar.open(`Upload failed: ${error.error?.message || 'Unknown error'}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
