package tum.devoops.memberservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tum.devoops.memberservice.converter.MemberConverter;
import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.repository.MemberRepository;

import java.util.ArrayList;
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
        List<MemberEntity> members = memberRepository.findAll();
        List<MemberSummary> memberSummaries = new ArrayList<>();

        for (MemberEntity memberEntity : members) {
            memberSummaries.add(MemberConverter.convertMemberEntityToMemberSummary(memberEntity));
        }

        return memberSummaries;
    }

    public Optional<MemberSummary> getMemberSummaryById(UUID id) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(id);

        if (optionalMemberEntity.isEmpty()) {
            return Optional.empty();
        }

        MemberEntity memberEntity = optionalMemberEntity.get();
        MemberSummary memberSummary = MemberConverter.convertMemberEntityToMemberSummary(memberEntity);

        return Optional.of(memberSummary);
    }

    public Optional<Member> getMemberById(UUID id) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(id);

        if (optionalMemberEntity.isEmpty()) {
            return Optional.empty();
        }

        MemberEntity memberEntity = optionalMemberEntity.get();
        Member member = MemberConverter.convertMemberEntityToMember(memberEntity);

        return Optional.of(member);
    }

    public Optional<Member> createMember(MemberCreate memberCreate, String bearerToken) {
        // If a member with this email already exists
        if (memberRepository.findByEmail(memberCreate.getEmail()).isPresent()) {
            return Optional.empty();
        }

        UUID id;
        try {
            id = keycloakService.createUser(memberCreate, bearerToken);
        } catch (Exception e) {
            return Optional.empty();
        }

        MemberEntity memberEntity = MemberConverter.convertMemberCreateToMemberEntity(memberCreate, id);
        memberEntity = memberRepository.save(memberEntity);

        Member member = MemberConverter.convertMemberEntityToMember(memberEntity);

        return Optional.of(member);
    }

    public Optional<Member> updateMember(Member member, String bearerToken) {

        Optional<MemberEntity> memberEntityWithEmail = memberRepository.findByEmail(member.getEmail());

        if (memberEntityWithEmail.isPresent()) {
            // If a member other than the passed member has the email
            if (!memberEntityWithEmail.get().getId().equals(member.getId())) {
                return Optional.empty();
            }
        }

        try {
            keycloakService.updateUser(member, bearerToken);
        } catch (Exception e) {
            return Optional.empty();
        }

        MemberEntity memberEntity = MemberConverter.convertMemberToMemberEntity(member);
        MemberEntity updatedMemberEntity = memberRepository.save(memberEntity);
        Member updatedMember = MemberConverter.convertMemberEntityToMember(updatedMemberEntity);

        return Optional.of(updatedMember);
    }

    public boolean deleteMember(UUID id, String bearerToken) {

        try {
            keycloakService.deleteUser(id, bearerToken);
        }
        catch (Exception e) {
            return false;
        }

        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(id);

        if(optionalMemberEntity.isEmpty()) {
            return false;
        }

        MemberEntity memberEntity = optionalMemberEntity.get();
        memberRepository.delete(memberEntity);

        return true;
    }

}
