package tum.devoops.eventservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.DirectorEntity;

public interface DirectorRepository extends JpaRepository<DirectorEntity, DirectorEntity.Id> {
}
