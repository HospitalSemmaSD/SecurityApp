import {
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { toBase64 } from '../../funtions/toBase64';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-input-img',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './input-img.component.html',
  styleUrl: './input-img.component.css',
})
export class InputImgComponent implements OnInit {
  ngOnInit(): void {
    console.log('imagen actual', this.actualPhoto);
  }

  @Input({ required: true })
  title: string = 'Input Image Component';

  @Input()
  actualPhoto?: string;

  @Output()
  fileSelected = new EventEmitter<File>();
  image?: string;

  inputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      toBase64(file)
        .then((value: string) => {
          this.image = value;
        })
        .catch((error) => {
          console.error('Error converting file to base64:', error);
        });
      this.fileSelected.emit(file);
      this.actualPhoto = undefined;
    }
  }
}
