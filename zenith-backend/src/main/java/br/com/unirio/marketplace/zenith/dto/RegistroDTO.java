package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres")
    private String senha;
    
    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    // FIXME: O registo de Vendedor teria um DTO separado e um fluxo diferente (com aprovação)
}