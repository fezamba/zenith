package br.com.unirio.marketplace.zenith.model.mongo;

import java.time.Instant;
import java.util.List;
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
}