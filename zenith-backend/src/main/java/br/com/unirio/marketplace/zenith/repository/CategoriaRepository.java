package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}