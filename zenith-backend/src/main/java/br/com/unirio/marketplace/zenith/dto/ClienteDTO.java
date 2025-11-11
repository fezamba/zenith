package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.Cliente;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClienteDTO {

    private Integer id;
    private String nome;
    private String email;
    private String cpf;
    private int zenithPoints;
    private String tipoUsuario;

    public ClienteDTO(Cliente cliente) {
        this.id = cliente.getId();
        this.nome = cliente.getNome();
        this.email = cliente.getEmail();
        this.cpf = cliente.getCpf();
        this.zenithPoints = cliente.getZenithPoints();
        this.tipoUsuario = cliente.getTipoUsuario();
    }
}