package br.com.unirio.marketplace.zenith.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoStatsDTO {
    
    private double mediaNotas;
    private int totalAvaliacoes;
    private List<AvaliacaoDTO> avaliacoes;
}