package br.com.unirio.marketplace.zenith.model.mongo;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data 
class Item {
    @Field("produto_id")
    private Integer produtoId;
    private int quantidade;
    @Field("data_adicionado")
    private Instant dataAdicionado;
}

@Document(collection = "carrinhos") 
@Data
public class Carrinho {

    @Id
    private String id;

    @Field("usuario_id")
    private Integer usuarioId;

    @Field("data_modificado")
    private Instant dataModificado;

    private List<Item> itens; 

    public void adicionarOuAtualizarItem(Integer produtoId, int quantidade) {
        if (this.itens == null) {
            this.itens = new ArrayList<>();
        }
        
        Optional<Item> itemExistente = this.itens.stream()
            .filter(item -> item.getProdutoId().equals(produtoId))
            .findFirst();

        if (itemExistente.isPresent()) {
            Item item = itemExistente.get();
            item.setQuantidade(item.getQuantidade() + quantidade);
            item.setDataAdicionado(Instant.now());
        } else {
            Item novoItem = new Item();
            novoItem.setProdutoId(produtoId);
            novoItem.setQuantidade(quantidade);
            novoItem.setDataAdicionado(Instant.now());
            this.itens.add(novoItem);
        }
        
        this.dataModificado = Instant.now();
    }
}