package tum.devoops.organizationservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.organizationservice.api.OrganizationApi;
import tum.devoops.organizationservice.model.Sport;
import tum.devoops.organizationservice.service.OrganizationSportService;

@RestController
@PreAuthorize("hasAnyRole('admin', 'member')")
public class OrganizationController implements OrganizationApi {

    @Autowired
    private OrganizationSportService sportService;

    @Override
    public ResponseEntity<List<Sport>> getAllSports() {
        return ResponseEntity.ok(sportService.getAllSports());
    }

    @Override
    public ResponseEntity<Sport> getSport(String sportName) {
        return ResponseEntity.ok(sportService.getSport(sportName));
    }
}
