import { Component, input } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-functionality',
  imports: [],
  templateUrl: './functionality.component.html',
  styleUrls: ['./functionality.component.scss']
})
export class FunctionalityComponent{
  functionality = input<Functionality>();
}
