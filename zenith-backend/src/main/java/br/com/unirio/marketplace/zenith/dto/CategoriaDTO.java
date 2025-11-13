package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.Categoria;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoriaDTO {

    private Integer id;
    private String nome;
    private String status;

    public CategoriaDTO(Categoria categoria) {
        this.id = categoria.getId();
        this.nome = categoria.getNome();
        this.status = categoria.getStatus();
    }
}