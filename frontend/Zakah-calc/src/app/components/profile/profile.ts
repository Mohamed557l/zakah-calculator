import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { disabled } from '@angular/forms/signals';

@Component({
 selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true,
  
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  
  infoForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit() {
    // Personal Info Form
    this.infoForm = this.fb.group({
      name: ['محمد علي', [Validators.required]],
      email: [{value:'mohamed.ali@example.com',disabled: true}]
    });

    // Password Change Form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onUpdateInfo() {
    if (this.infoForm.valid) console.log('Updating Info:', this.infoForm.value);
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) console.log('Updating Password...');
  }
}