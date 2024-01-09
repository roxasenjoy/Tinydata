import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-graphic-selector',
  templateUrl: './graphic-selector.component.html',
  styleUrls: ['./graphic-selector.component.css']
})

export class GraphicSelectorComponent implements OnInit, OnChanges {
  @Input() showSelector!: Boolean;

  @Output() public graphSelected = new EventEmitter<boolean>();

  isGraphSelected = false;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
   
    if(!this.showSelector){
      this.isGraphSelected = false;
    }
  }

  ngOnInit(): void {

  }

  clickDiv(){
    this.isGraphSelected = !this.isGraphSelected;
    this.onCheckboxChange();
  }

  onCheckboxChange(){
    this.graphSelected.emit(this.isGraphSelected);
  }


}
