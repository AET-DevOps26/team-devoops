package tum.devoops.memberservice.converter;

import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberSummary;

import java.time.LocalDate;
import java.util.UUID;

public class MemberConverter {
    public static Member convertMemberEntityToMember(MemberEntity memberEntity) {
        return new Member(
                memberEntity.getId(),
                memberEntity.getFirstName(),
                memberEntity.getLastName(),
                memberEntity.getEmail(),
                memberEntity.getBirthday(),
                memberEntity.getPhoneNumber(),
                memberEntity.getAddress(),
                memberEntity.getJoiningDate(),
                memberEntity.getInformation()
        );
    }

    public static MemberEntity convertMemberToMemberEntity(Member member) {
        return new MemberEntity(
                member.getId(),
                member.getFirstName(),
                member.getLastName(),
                member.getEmail(),
                member.getBirthday(),
                member.getPhoneNumber(),
                member.getAddress(),
                member.getJoiningDate(),
                member.getInformation()
        );
    }

    public static MemberEntity convertMemberCreateToMemberEntity(MemberCreate memberCreate, UUID id) {
        return new MemberEntity(
                id,
                memberCreate.getFirstName(),
                memberCreate.getLastName(),
                memberCreate.getEmail(),
                memberCreate.getBirthday(),
                memberCreate.getPhoneNumber(),
                memberCreate.getAddress(),
                LocalDate.now(),
                memberCreate.getInformation()
        );
    }

    public static MemberSummary convertMemberEntityToMemberSummary(MemberEntity memberEntity) {
        return new MemberSummary(memberEntity.getId(), memberEntity.getFirstName(), memberEntity.getLastName(), memberEntity.getEmail());
    }
}
