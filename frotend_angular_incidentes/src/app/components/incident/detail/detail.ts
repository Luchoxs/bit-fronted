import { Component, Input } from '@angular/core';
import { Incident } from '../../../models/incident.model';

@Component({
  selector: 'app-detail',
  imports: [],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  standalone: true
})
export class Detail {
  @Input() incidente: Incident | null = null;
}
