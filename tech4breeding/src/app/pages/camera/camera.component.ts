import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  
  styleUrls: ['./camera.component.scss'],

})
export class CameraComponent {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;
  prediction: string = "";

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
    });
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob: Blob | null)  => {
      const formData = new FormData();
      formData.append('file', blob!, 'chicken.jpg');

      this.http.post<any>('http://127.0.0.1:5000/predict', formData).subscribe(response => {
        this.prediction = response.result;
      });
    }, 'image/jpeg');
  }
}
