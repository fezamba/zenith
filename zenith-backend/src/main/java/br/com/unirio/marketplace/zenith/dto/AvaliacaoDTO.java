package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.mongo.Avaliacao;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AvaliacaoDTO {

    private String id;
    private Integer produtoId;
    private Integer clienteId;
    private String nomeCliente;
    private int nota;
    private String comentario;
    private LocalDate data;

    public AvaliacaoDTO(Avaliacao avaliacao) {
        this.id = avaliacao.getId();
        this.produtoId = avaliacao.getProdutoId();
        this.clienteId = avaliacao.getClienteId();
        this.nomeCliente = avaliacao.getNomeCliente();
        this.nota = avaliacao.getNota();
        this.comentario = avaliacao.getComentario();
        this.data = avaliacao.getData();
    }
}