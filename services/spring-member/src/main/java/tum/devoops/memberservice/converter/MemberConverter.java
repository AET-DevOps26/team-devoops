package tum.devoops.memberservice.converter;

import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberPartialUpdate;
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

    public static void applyPartialUpdate(MemberEntity entity, MemberPartialUpdate update) {
        if (update.getFirstName() != null) {
            entity.setFirstName(update.getFirstName());
        }
        if (update.getLastName() != null) {
            entity.setLastName(update.getLastName());
        }
        if (update.getEmail() != null) {
            entity.setEmail(update.getEmail());
        }
        if (update.getBirthday() != null) {
            entity.setBirthday(update.getBirthday());
        }
        if (update.getPhoneNumber() != null) {
            entity.setPhoneNumber(update.getPhoneNumber());
        }
        if (update.getAddress() != null) {
            entity.setAddress(update.getAddress());
        }
        if (update.getInformation() != null) {
            entity.setInformation(update.getInformation());
        }
    }
}
