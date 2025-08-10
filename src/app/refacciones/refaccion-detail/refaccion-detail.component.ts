import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { AuthService } from '../../auth.service'; // Importa el servicio de autenticación

// Define the interface for the spare part, based on your API's structure
export interface Refaccion {
    id: number;
    nombre: string;
    descripcion: string;
    codigo: string;
    fabricante: string;
    vida_util_estimada: string;
    imagen: string;
    estatus: boolean;
}

@Component({
    selector: 'app-refaccion-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
    templateUrl: './refaccion-detail.component.html',
    styleUrls: ['./refaccion-detail.component.scss']
})
export class RefaccionDetailComponent implements OnInit {
    refaccionId: number | null = null;
    refaccion: Refaccion | undefined;
    isLoading: boolean = true;
    showStatusConfirmation: boolean = false;
    errorMessage: string | null = null;
    isEditing: boolean = false;
    refaccionForm!: FormGroup;
    selectedFile: File | null = null;
    isAdmin: boolean = false; // Propiedad para el control de roles

    private apiUrl = 'https://fixflow-backend.onrender.com/api/refacciones';
    
    // URL base de Cloudinary
    private cloudinaryBaseUrl = 'http://res.cloudinary.com/dfdcovbqs/';

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private fb: FormBuilder,
        private authService: AuthService // Inyecta el servicio de autenticación
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                this.isLoading = true;
                this.errorMessage = null;

                if (id) {
                    this.refaccionId = +id;
                    return this.http.get<Refaccion>(`${this.apiUrl}/${this.refaccionId}/`).pipe(
                        catchError(error => {
                            console.error('Error getting spare part:', error);
                            this.errorMessage = 'Could not find the spare part with the provided ID.';
                            return of(undefined);
                        })
                    );
                }
                return of(undefined);
            })
        ).subscribe(data => {
            this.refaccion = data;
            this.isLoading = false;
            if (this.refaccion) {
                this.initForm();
            }
        });
        
        // Suscribirse al rol del usuario para actualizar el estado de 'isAdmin'
        this.authService.userRole$.subscribe(role => {
            this.isAdmin = role === 'admin';
        });
    }

    initForm(): void {
        this.refaccionForm = this.fb.group({
            nombre: [this.refaccion?.nombre, Validators.required],
            descripcion: [this.refaccion?.descripcion, Validators.required],
            codigo: [this.refaccion?.codigo, Validators.required],
            fabricante: [this.refaccion?.fabricante, Validators.required],
            vida_util_estimada: [this.refaccion?.vida_util_estimada, Validators.required],
        });
    }

    /**
     * Constructs the full image URL.
     * @param imagePath The image path returned by the API.
     * @returns The complete image URL.
     */
   getRefaccionImageUrl(imagePath: string, width: number = 400, height: number = 200): string {
    if (!imagePath) {
        return `https://placehold.co/${width}x${height}/cccccc/ffffff?text=No+Image`;
    }

    // Si contiene una URL completa incrustada después de "upload/", la extraemos
    const match = imagePath.match(/https?:\/\/[^\s]+/);
    if (match) {
        return match[0].replace(
            '/upload/',
            `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`
        );
    }

    // Si es ruta relativa, la armamos optimizada
    return `https://res.cloudinary.com/dfdcovbqs/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${imagePath}`;
}

    onFileSelected(event: Event): void {
        const element = event.currentTarget as HTMLInputElement;
        if (element.files && element.files.length > 0) {
            this.selectedFile = element.files[0];
        } else {
            this.selectedFile = null;
        }
    }

    onEditClick(): void {
        if (!this.isAdmin) return; // Restringir el acceso a la edición
        this.isEditing = true;
    }

    onSaveEdit(): void {
        if (!this.isAdmin) return; // Restringir el guardado
        if (this.refaccionForm.valid && this.refaccion) {
            const url = `${this.apiUrl}/${this.refaccion.id}/`;
            const payload = new FormData();

            payload.append('nombre', this.refaccionForm.value.nombre);
            payload.append('descripcion', this.refaccionForm.value.descripcion);
            payload.append('codigo', this.refaccionForm.value.codigo);
            payload.append('fabricante', this.refaccionForm.value.fabricante);
            payload.append('vida_util_estimada', this.refaccionForm.value.vida_util_estimada);
            payload.append('estatus', this.refaccion.estatus.toString());
            
            if (this.selectedFile) {
                payload.append('imagen', this.selectedFile, this.selectedFile.name);
            }

            this.http.put<Refaccion>(url, payload).subscribe({
                next: (response) => {
                    console.log('Spare part updated successfully:', response);
                    this.refaccion = response;
                    this.isEditing = false;
                    this.selectedFile = null;
                },
                error: (error) => {
                    console.error('Error updating spare part:', error);
                }
            });
        }
    }

    onCancelEdit(): void {
        this.isEditing = false;
        this.initForm();
        this.selectedFile = null;
    }

    onToggleStatusClick(): void {
        if (!this.isAdmin) return; // Restringir el cambio de estado
        if (this.refaccion) {
            this.showStatusConfirmation = true;
        }
    }

    confirmToggleStatus(): void {
        if (!this.isAdmin) return; // Restringir la confirmación
        if (this.refaccion) {
            const nuevoEstatus = !this.refaccion.estatus;
            const id = this.refaccion.id;
            
            this.http.patch<Refaccion>(`${this.apiUrl}/${id}/`, { estatus: nuevoEstatus }).subscribe({
                next: (response) => {
                    console.log('Status updated successfully:', response);
                    this.refaccion!.estatus = response.estatus;
                    this.showStatusConfirmation = false;
                },
                error: (error) => {
                    console.error('Error updating status:', error);
                    this.showStatusConfirmation = false;
                }
            });
        }
    }

    cancelToggleStatus(): void {
        this.showStatusConfirmation = false;
    }
}
