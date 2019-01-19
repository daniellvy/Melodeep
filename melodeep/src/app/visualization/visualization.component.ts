import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import { ToneService } from '../tone.service';
import { Subscription } from 'rxjs/index';
import { Command } from '../tone.service';
declare var PIXI:any;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {
  private toneSubscription: Subscription;
  public app: any;

  constructor(public toneService: ToneService) { 
    this.app = new PIXI.Application({
      width: 800,
      height: 600
    });
  }

  ngOnInit() {
    this.toneSubscription = this.toneService.toneSourceListener.subscribe(command => {
      // if (command == Command.Play) {
          
      // }
      
      // if (command == Command.Stop) {
        
      // }
    
      // if (command == Command.MidiChange) {
        
      // }

    });

  }


}
