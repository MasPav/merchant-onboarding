import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as Pikaday from 'pikaday';

@Component({
  selector: 'pikaday-picker',
  templateUrl: './pikaday-picker.component.html',
  styleUrls: ['./pikaday-picker.component.css']
})
export class PikadayPickerComponent implements OnInit, AfterViewInit {

  @ViewChild('datepicker') datepicker!: ElementRef<any>;

  @Input() controlName: string = '';
  @Input() group!: FormGroup;
  @Input() placeholder = '';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const control = this.group.get(this.controlName)!;
    const picker = new Pikaday({ 
      field: this.datepicker.nativeElement, 
      position: 'right',
      onSelect: function(date) {
        control.setValue(picker.toString());
      }
     });
  }

}
