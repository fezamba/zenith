package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.mongo.Avaliacao;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends MongoRepository<Avaliacao, String> {

    List<Avaliacao> findByProdutoId(Integer produtoId);

    List<Avaliacao> findByClienteId(Integer clienteId);
}