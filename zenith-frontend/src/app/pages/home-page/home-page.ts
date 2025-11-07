import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Categoria {
  id: number;
  nome: string;
  imagemUrl: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

//FIXME: isso aqui é para testar!!!
export class HomePageComponent {
  categorias: Categoria[] = [
    { id: 1, nome: "Academia", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Academia' },
    { id: 2, nome: "Cozinha", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Cozinha' },
    { id: 3, nome: "Livros", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Livros' },
    { id: 4, nome: "Laptops", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Laptops' },
    { id: 5, nome: "Celulares", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Celulares' },
    { id: 6, nome: "Tecnologia", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Tecnologia' },
    { id: 7, nome: "Casa", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Casa' },
    { id: 8, nome: "Escritório", imagemUrl: 'https://placehold.co/100x100/eeeeee/111111?text=Escritório' },
  ];
}