package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.Vendedor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VendedorDTO {

    private Integer id;
    private String nome;
    private String email;
    private String cnpj;
    private String status;
    private String tipoUsuario;

    public VendedorDTO(Vendedor vendedor) {
        this.id = vendedor.getId();
        this.nome = vendedor.getNome();
        this.email = vendedor.getEmail();
        this.cnpj = vendedor.getCnpj();
        this.status = vendedor.getStatus();
        this.tipoUsuario = vendedor.getTipoUsuario();
    }
}