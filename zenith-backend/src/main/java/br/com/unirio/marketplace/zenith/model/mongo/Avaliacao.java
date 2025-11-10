package br.com.unirio.marketplace.zenith.model.mongo;

import java.time.LocalDate;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "avaliacoes")
@Data
public class Avaliacao {

    @Id
    private String id;

    @Field("produto_id")
    private Integer produtoId;

    @Field("cliente_id")
    private Integer clienteId;

    @Field("nome_cliente")
    private String nomeCliente;

    private int nota;
    private String comentario;
    private LocalDate data;
}