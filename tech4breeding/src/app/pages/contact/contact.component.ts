import emailjs from '@emailjs/browser';
import {Component, OnInit} from '@angular/core';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports:[NgxSpinnerModule,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements  OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  

// form:FormGroup = this.form.gr;
// constructor(private spinner: NgxSpinnerService,private form:FormBuilder
// ) {
// }
//   ngOnInit(): void {
//   this.spinner.show();
//   }
//   send(){
//     emailjs.send("service_64ztlrn","template_uuebff6");

//   }
 
// }
}