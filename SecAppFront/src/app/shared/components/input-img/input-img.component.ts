import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { toBase64 } from '../../funtions/toBase64';

@Component({
  selector: 'app-input-img',
  imports: [MatButtonModule],
  templateUrl: './input-img.component.html',
  styleUrl: './input-img.component.css',
})
export class InputImgComponent {
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
