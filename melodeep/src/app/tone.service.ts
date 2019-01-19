import {Injectable, OnInit} from '@angular/core';
import { Subject } from "rxjs/index";

export enum Command {
  Play = 1,
  Stop,
  MidiChange,
}

@Injectable({
  providedIn: 'root'
})
export class ToneService{
  public playing = false;
  private midiPart: any;

  private toneSource = new Subject<Command>();
  toneSourceListener = this.toneSource.asObservable();
  
  constructor() {
  }

  clear() {
    if (this.midiPart) {
      console.log('Cleared midi');
      this.midiPart.stop();
      Tone.Transport.stop();
      this.midiPart = null;
      this.toneSource.next(Command.MidiChange);
    }

  }

  play(midi) {
    console.log('Started playing...');
    if (this.playing) {
      return;
    }
    var synth = new Tone.PolySynth(4, Tone.Synth).toMaster();


    // make sure you set the tempo before you schedule the events
    Tone.Transport.bpm.value = midi.header.bpm;


    // pass in the note events from one of the tracks as the second argument to Tone.Part
    this.midiPart = new Tone.Part(function(time, note) {

      // use the events to play the synth
      synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);

    }, midi.tracks[1].notes).start();

    this.playing = true;
    this.toneSource.next(Command.Play);
    Tone.Transport.start();
  }

  stop() {
    if (this.midiPart) {
      console.log('Stopped playing...');
      this.midiPart.stop();
      this.playing = false;
      this.toneSource.next(Command.Stop);
    }
  }
}
