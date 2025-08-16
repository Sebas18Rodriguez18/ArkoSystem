package co.edu.sena.arkosystem.repository;

import co.edu.sena.arkosystem.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryRole extends JpaRepository<Roles, Long> {
    Optional<Roles> findByName(String name);
}