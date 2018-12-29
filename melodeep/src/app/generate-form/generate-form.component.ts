import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UploadService} from '../upload/upload.service';

@Component({
  selector: 'app-generate-form',
  templateUrl: './generate-form.component.html',
  styleUrls: ['./generate-form.component.css']
})
export class GenerateFormComponent implements OnInit {
  loading = false;

  formGroup = this.fb.group({
    file: [null, Validators.required]
  });
  private file: any;
  private generated_midi: any;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef,
              private uploadService: UploadService) {}

  ngOnInit() {
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.file = file;
    }
  }

  onSubmit() {
    let formData = new FormData();
    formData.append('file', this.file);

    this.loading = true;
    this.uploadService.generate(formData)
      .subscribe(generated_midi => this.generated_midi = generated_midi);
  }

}
