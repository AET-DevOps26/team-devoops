package tum.devoops.financeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tum.devoops.financeservice.entity.TraineeEntity;

public interface TraineeRepository extends JpaRepository<TraineeEntity, TraineeEntity.Id> {
}
