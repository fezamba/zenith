package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {
    
    List<Endereco> findByClienteId(Integer clienteId);
}