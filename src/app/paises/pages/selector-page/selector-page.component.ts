import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

// pS = paisesService.

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  paisesFrontera: string[] = [];

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private pS: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.pS.regiones;

    // Cuando cambie el value del Select
    // this.miFormulario
    //   .get('region')
    //   ?.valueChanges.subscribe((region) =>
    //     this.pS
    //       .getPaisesPorRegion(region)
    //       .subscribe((paises) => (this.paises = paises))
    //   );

    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap(() => {
          this.paises = [];
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this.pS.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap(() => {
          this.paisesFrontera = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap((codigo) => this.pS.getPaisPorCodigo(codigo))
      )
      .subscribe((paises) => {
        // if (paises!.length > 0) {
        this.paisesFrontera = paises![0]?.borders || [];
        this.cargando = false;
        // }
        // El api retorna un array de paises. Por esto se pone el [0]
      });

    // this.miFormulario
    //   .get('pais')
    //   ?.valueChanges.subscribe((codigo) => console.log(codigo));
  }

  guardar() {
    console.log('');
  }
}
