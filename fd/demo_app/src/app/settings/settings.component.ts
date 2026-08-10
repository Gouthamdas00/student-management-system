import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormConfigService, StudentFormConfig } from '../services/form-config.service';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private configService = inject(FormConfigService);

  studentConfig: StudentFormConfig = {
    minMarks: 0,
    maxMarks: 100,
    minSemester: 1,
    maxSemester: 8
  };

  isSaved: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.studentConfig = { ...this.configService.studentConfig() };
  }

  onSave(): void {
    if (this.studentConfig.minMarks >= this.studentConfig.maxMarks) {
      this.errorMessage = 'Minimum mark must be strictly less than maximum mark.';
      return;
    }
    if (this.studentConfig.minSemester >= this.studentConfig.maxSemester) {
      this.errorMessage = 'Minimum semester must be strictly less than maximum semester.';
      return;
    }

    this.errorMessage = '';
    this.configService.saveStudentConfig(this.studentConfig);
    this.isSaved = true;
    setTimeout(() => (this.isSaved = false), 3000);
  }

  onReset(): void {
    this.configService.resetToDefault();
    this.studentConfig = { ...this.configService.studentConfig() };
    this.errorMessage = '';
  }
}