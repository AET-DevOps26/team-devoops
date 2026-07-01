package tum.devoops.memberservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tum.devoops.memberservice.converter.MemberConverter;
import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.exception.BadRequestException;
import tum.devoops.memberservice.exception.ConflictException;
import tum.devoops.memberservice.exception.NotFoundException;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberPartialUpdate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.repository.MemberRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemberService {

    @Autowired
    KeycloakService keycloakService;

    @Autowired
    MemberRepository memberRepository;

    public List<MemberSummary> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(MemberConverter::convertMemberEntityToMemberSummary)
                .toList();
    }

    public Optional<MemberSummary> getMemberSummaryById(UUID id) {
        return memberRepository.findById(id)
                .map(MemberConverter::convertMemberEntityToMemberSummary);
    }

    public Optional<Member> getMemberById(UUID id) {
        return memberRepository.findById(id)
                .map(MemberConverter::convertMemberEntityToMember);
    }

    public Member createMember(MemberCreate memberCreate, String bearerToken) {
        if (memberRepository.findByEmail(memberCreate.getEmail()).isPresent()) {
            throw new ConflictException("Email already in use by another member");
        }

        UUID id;
        try {
            id = keycloakService.createUser(memberCreate, bearerToken);
        } catch (Exception e) {
            throw new BadRequestException("Failed to create member: " + e.getMessage());
        }

        MemberEntity memberEntity = MemberConverter.convertMemberCreateToMemberEntity(memberCreate, id);
        memberEntity = memberRepository.save(memberEntity);

        return MemberConverter.convertMemberEntityToMember(memberEntity);
    }

    public Member updateMember(UUID memberId, MemberPartialUpdate update, String bearerToken) {
        MemberEntity entity = memberRepository.findById(memberId)
                .orElseThrow(() -> new NotFoundException("Member not found: " + memberId));

        if (update.getEmail() != null) {
            memberRepository.findByEmail(update.getEmail())
                    .filter(existing -> !existing.getId().equals(memberId))
                    .ifPresent(e -> {
                        throw new ConflictException("Email already in use by another member");
                    });
        }

        MemberConverter.applyPartialUpdate(entity, update);

        try {
            keycloakService.updateUser(MemberConverter.convertMemberEntityToMember(entity), bearerToken);
        } catch (Exception e) {
            throw new BadRequestException("Failed to update member: " + e.getMessage());
        }

        MemberEntity saved = memberRepository.save(entity);
        return MemberConverter.convertMemberEntityToMember(saved);
    }

    public void deleteMember(UUID id, String bearerToken) {
        MemberEntity entity = memberRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Member not found: " + id));

        try {
            keycloakService.deleteUser(id, bearerToken);
        } catch (Exception e) {
            throw new BadRequestException("Failed to delete member: " + e.getMessage());
        }

        memberRepository.delete(entity);
    }
}
