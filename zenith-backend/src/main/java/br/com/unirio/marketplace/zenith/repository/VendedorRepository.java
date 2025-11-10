package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendedorRepository extends JpaRepository<Vendedor, Integer> {

    List<Vendedor> findByStatus(String status);
}