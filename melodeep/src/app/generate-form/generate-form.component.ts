import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UploadService} from '../upload/upload.service';
import {parse} from 'midiconvert';
import {ToneService} from '../tone.service';
import {saveAs as importedSaveAs} from "file-saver";

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
  private raw_midi: any;
  private filename: any;
  private temperature: number;
  private steps: number;
  private submodel: any;
  private melody: string;
  private submitting = false;

  melodies: string[] = [
    "Californication"
  ];

  submodels: any[] = [
    {key: "Basic RNN", value: "basic_rnn"},
    {key: "Lookback RNN", value: "lookback_rnn"},
    {key: "Attention RNN", value: "attention_rnn"},
  ];

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef,
              private uploadService: UploadService, private toneService: ToneService) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.submitting = false;
    this.file = undefined;
    this.filename = undefined;
    this.melody = undefined;
  }

  clearFile() {
    document.getElementById('fileToUpload').value = '';
    this.filename = undefined;
    this.file = undefined;

  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.file = file;
      this.filename = this.file.name;
    } else {
      this.filename = undefined;
    }
  }

  onSubmit() {
    const formData = new FormData();
    if (this.file) {
      formData.append('file', this.file);
    } else if (this.melody) {
      formData.append('melody', this.melody);
    } else {
      alert('Please upload or select a melody');
      return;
    }
    formData.append('temperature', (this.temperature / 100).toString());
    formData.append('steps', (this.steps).toString());
    if (this.submodel) {
      formData.append('submodel', this.submodel.value);
    } else {
      alert('Please select a submodel');
      return;
    }


    this.loading = true;
    this.toneService.stop();
    this.toneService.clear();

    this.submitting = true;
    this.uploadService.generate(formData)
      .subscribe(generated_midi => this.processMidi(generated_midi));
  }

  processMidi(generated_midi: any) {
    this.raw_midi = generated_midi;
    this.generated_midi = parse(generated_midi);
    console.log(this.generated_midi);
    this.submitting = false;
  }

  public playMelody() {
    console.log('Pressed play');
    this.toneService.play(this.generated_midi);
  }

  public stopMelody() {
    console.log('Pressed stop');
    this.toneService.stop();
  }

  public download() {
    let blob = new Blob([this.raw_midi], {
      type: 'audio/midi'
    });
    importedSaveAs(blob, 'melodeep_generated.mid');
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    return value / 100;
  }
}
