package tum.devoops.memberservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tum.devoops.memberservice.converter.MemberConverter;
import tum.devoops.memberservice.entity.MemberEntity;
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

    public Optional<Member> createMember(MemberCreate memberCreate, String bearerToken) {
        if (memberRepository.findByEmail(memberCreate.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use by another member");
        }

        UUID id;
        try {
            id = keycloakService.createUser(memberCreate, bearerToken);
        } catch (Exception e) {
            return Optional.empty();
        }

        MemberEntity memberEntity = MemberConverter.convertMemberCreateToMemberEntity(memberCreate, id);
        memberEntity = memberRepository.save(memberEntity);

        return Optional.of(MemberConverter.convertMemberEntityToMember(memberEntity));
    }

    public Optional<Member> updateMember(UUID memberId, MemberPartialUpdate update, String bearerToken) {
        Optional<MemberEntity> optionalEntity = memberRepository.findById(memberId);
        if (optionalEntity.isEmpty()) {
            return Optional.empty();
        }

        MemberEntity entity = optionalEntity.get();

        if (update.getEmail() != null) {
            memberRepository.findByEmail(update.getEmail())
                    .filter(existing -> !existing.getId().equals(memberId))
                    .ifPresent(e -> {
                        throw new IllegalStateException("Email already in use by another member");
                    });
        }

        MemberConverter.applyPartialUpdate(entity, update);

        try {
            keycloakService.updateUser(MemberConverter.convertMemberEntityToMember(entity), bearerToken);
        } catch (Exception e) {
            return Optional.empty();
        }

        MemberEntity saved = memberRepository.save(entity);
        return Optional.of(MemberConverter.convertMemberEntityToMember(saved));
    }

    public boolean deleteMember(UUID id, String bearerToken) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(id);
        if (optionalMemberEntity.isEmpty()) {
            return false;
        }

        try {
            keycloakService.deleteUser(id, bearerToken);
        } catch (Exception e) {
            return false;
        }

        memberRepository.delete(optionalMemberEntity.get());
        return true;
    }
}
