package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemCarrinhoInputDTO {

    @NotNull(message = "O ID do produto é obrigatório")
    private Integer produtoId;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser de pelo menos 1")
    private int quantidade;
}