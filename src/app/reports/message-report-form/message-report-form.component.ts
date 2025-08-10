import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-message-report-form',
  templateUrl: './message-report-form.component.html',
  styleUrls: ['./message-report-form.component.scss']
})
export class MessageReportFormComponent implements OnInit {
  messageText: string = '';
  selectedImage: File | null = null;

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  /**
   * Handles the file selection event for the image input.
   * @param event The DOM event triggered by file input change.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    } else {
      this.selectedImage = null;
    }
  }

  /**
   * Handles the form submission.
   * In a real application, you would send this data to your backend API.
   */
  onSubmit(): void {
    console.log('Datos del Mensaje de Reporte a enviar:');
    console.log('Mensaje:', this.messageText);
    console.log('Imagen:', this.selectedImage ? this.selectedImage.name : 'No image selected');

    // Here you would typically call a service to send this data to your API.
    // Example: this.reportService.createMessageReport(this.messageText, this.selectedImage).subscribe(...);

    alert('Mensaje de Reporte enviado (simulado) exitosamente!'); // For demonstration
    this.router.navigate(['/reports']); // Navigate back to the reports overview
  }

  /**
   * Navigates back to the main reports panel.
   */
  goBack(): void {
    this.router.navigate(['/reports']);
  }
}