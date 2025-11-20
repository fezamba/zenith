package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AtualizarStatusPedidoDTO {

    @NotBlank(message = "O novo status é obrigatório")
    private String novoStatus;
    
}