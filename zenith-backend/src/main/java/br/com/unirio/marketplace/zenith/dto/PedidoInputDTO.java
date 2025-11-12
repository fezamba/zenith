package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PedidoInputDTO {
    
    @NotNull(message = "O ID do endereço de entrega é obrigatório")
    private Integer enderecoId;

    private Boolean usarZenithPoints = false;
}