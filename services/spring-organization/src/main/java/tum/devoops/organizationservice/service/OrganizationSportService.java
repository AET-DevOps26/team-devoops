package tum.devoops.organizationservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.organizationservice.entity.SportEntity;
import tum.devoops.organizationservice.exception.NotFoundException;
import tum.devoops.organizationservice.model.Sport;
import tum.devoops.organizationservice.repository.DirectorRepository;
import tum.devoops.organizationservice.repository.MemberRepository;
import tum.devoops.organizationservice.repository.SportRepository;
import tum.devoops.organizationservice.repository.TeamRepository;
import tum.devoops.organizationservice.repository.TraineeRepository;
import tum.devoops.organizationservice.repository.TrainerRepository;

@Service
public class OrganizationSportService {

    @Autowired
    private SportRepository sportRepository;
    @Autowired
    private DirectorRepository directorRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private TraineeRepository traineeRepository;

    @Transactional(readOnly = true)
    public List<Sport> getAllSports() {
        return sportRepository.findAll().stream()
                .map(this::toSport)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Sport getSport(String sportName) {
        return toSport(findSportOrThrow(sportName));
    }

    private SportEntity findSportOrThrow(String sportName) {
        return sportRepository.findById(sportName)
                .orElseThrow(() -> new NotFoundException("Sport not found: " + sportName));
    }

    private Sport toSport(SportEntity entity) {
        List<String> directors = entity.getDirectors().stream()
                .map(d -> d.getId().getMemberId().toString())
                .collect(Collectors.toList());
        return new Sport(entity.getName(), entity.getDescription(), entity.getCreatedAt(), directors);
    }
}
