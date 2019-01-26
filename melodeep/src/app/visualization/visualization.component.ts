import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ToneService } from '../tone.service';
import { Subscription } from 'rxjs/index';
import { Command } from '../tone.service';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
// import 'p5/lib/addons/p5.dom';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {
  private toneSubscription: Subscription;
  public app: any;
  private note;
  private prevNote;
  private noteFrames;

  constructor(public toneService: ToneService) {
  }

  ngOnInit() {
    const sketch = (s) => {
      var width = s.windowWidth / 2 - 25;
      var height = s.windowHeight / 2;
      var minMidi = 20;
      var maxMidi = 80;
      var slices = maxMidi - minMidi;

      var maxNoteHeight = (height * 2 / 3) - 1;
      var noteWidth = width / slices;

      var background_color = 255;
      var midi_color = '#FFC107';

      s.preload = () => {
        // preload code
      };

      s.setup = () => {
        var l = s.createCanvas(width, height);
        l.parent('app-visualization');
        s.background(background_color);
        s.noStroke();
        s.fill(midi_color);
        s.frameRate(30);
      };

      s.draw = () => {
        if (this.note && this.note !== this.prevNote) {
          this.prevNote = this.note;
          this.noteFrames = this.note.duration * 30;
        } else if (this.note && this.noteFrames > 0) {
          s.background(background_color);
          this.noteFrames -= 1;
          var noteRectStart = (this.note.midi - minMidi) * noteWidth;
          var noteHeight = maxNoteHeight * (1 - (this.noteFrames / (this.note.duration * 30)));
          s.rect(noteRectStart, noteHeight, noteWidth, height - 1);
        }
        else {
          s.background(background_color);
        }
      };
    };
    const canvas = new p5(sketch);

    this.toneSubscription = this.toneService.toneSourceListener.subscribe(command => {
      if (command === Command.Play) {
        this.note = undefined;
      } else if (command === Command.Stop) {
        this.note = undefined;
      } else if (command === Command.MidiChange) {
        this.note = undefined;
      } else {
        this.note = command;
      }

    });

  }
}
