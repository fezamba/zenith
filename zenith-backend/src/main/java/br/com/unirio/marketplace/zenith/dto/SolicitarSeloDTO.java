package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SolicitarSeloDTO {

    @NotBlank(message = "O tipo do selo é obrigatório")
    @Pattern(regexp = "SUSTENTAVEL|LOCAL", message = "O tipo do selo deve ser 'SUSTENTAVEL' ou 'LOCAL'")
    private String tipoSelo;

    @NotBlank(message = "A justificativa é obrigatória para a solicitação")
    private String justificativa;
}