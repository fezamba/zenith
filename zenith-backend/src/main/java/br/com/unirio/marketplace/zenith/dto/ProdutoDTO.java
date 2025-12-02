package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.Produto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ProdutoDTO {

    private Integer id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private int estoque;
    private String status;
    private String statusSelo;
    private String nomeCategoria;
    private String nomeVendedor;
    private Integer vendedorId;

    public ProdutoDTO(Produto produto) {
        this.id = produto.getId();
        this.nome = produto.getNome();
        this.descricao = produto.getDescricao();
        this.preco = produto.getPreco();
        this.estoque = produto.getEstoque();
        this.status = produto.getStatus();
        this.statusSelo = produto.getStatusSelo();
        this.nomeCategoria = produto.getCategoria().getNome();
        this.nomeVendedor = produto.getVendedor().getNome();

        if (produto.getCategoria() != null) {
            this.nomeCategoria = produto.getCategoria().getNome();
        }
        
        if (produto.getVendedor() != null) {
            this.nomeVendedor = produto.getVendedor().getNome();
            this.vendedorId = produto.getVendedor().getId();
        }
    }
}