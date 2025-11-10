package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.mongo.Carrinho;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarrinhoRepository extends MongoRepository<Carrinho, String> {

    Optional<Carrinho> findByUsuarioId(Integer usuarioId);
}