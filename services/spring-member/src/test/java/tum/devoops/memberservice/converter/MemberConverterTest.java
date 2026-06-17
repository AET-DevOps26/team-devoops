package tum.devoops.memberservice.converter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberSummary;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MemberConverterTest {

    UUID id;

    private MemberEntity memberEntity;
    private Member member;
    private MemberCreate memberCreate;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();
        LocalDate birthday = LocalDate.of(1990, 1, 1);
        LocalDate joiningDate = LocalDate.of(2020, 6, 15);

        memberEntity = new MemberEntity(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                birthday,
                "phoneNumber",
                "address",
                joiningDate,
                "information"
        );

        member = new Member(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                birthday,
                "phoneNumber",
                "address",
                joiningDate,
                "information"
        );

        memberCreate = new MemberCreate();
        memberCreate.setFirstName("firstName");
        memberCreate.setLastName("lastName");
        memberCreate.setEmail("email@email.com");
        memberCreate.setBirthday(birthday);
        memberCreate.setPhoneNumber("phoneNumber");
        memberCreate.setAddress("address");
        memberCreate.setInformation("information");
    }

    // Verifies that every field of a MemberEntity is mapped onto the resulting Member
    @Test
    void convertMemberEntityToMemberMapsAllFields() {
        Member result = MemberConverter.convertMemberEntityToMember(memberEntity);

        assertEquals(id, result.getId());
        assertEquals(memberEntity.getFirstName(), result.getFirstName());
        assertEquals(memberEntity.getLastName(), result.getLastName());
        assertEquals(memberEntity.getEmail(), result.getEmail());
        assertEquals(memberEntity.getBirthday(), result.getBirthday());
        assertEquals(memberEntity.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(memberEntity.getAddress(), result.getAddress());
        assertEquals(memberEntity.getJoiningDate(), result.getJoiningDate());
        assertEquals(memberEntity.getInformation(), result.getInformation());
    }

    // Verifies that every field of a Member is mapped onto the resulting MemberEntity
    @Test
    void convertMemberToMemberEntityMapsAllFields() {
        MemberEntity result = MemberConverter.convertMemberToMemberEntity(member);

        assertEquals(member.getId(), result.getId());
        assertEquals(member.getFirstName(), result.getFirstName());
        assertEquals(member.getLastName(), result.getLastName());
        assertEquals(member.getEmail(), result.getEmail());
        assertEquals(member.getBirthday(), result.getBirthday());
        assertEquals(member.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(member.getAddress(), result.getAddress());
        assertEquals(member.getJoiningDate(), result.getJoiningDate());
        assertEquals(member.getInformation(), result.getInformation());
    }

    // Verifies that the provided id is used, the MemberCreate fields are copied and joiningDate is set to today
    @Test
    void convertMemberCreateToMemberEntityMapsFieldsAndSetsJoiningDate() {
        LocalDate before = LocalDate.now();
        MemberEntity result = MemberConverter.convertMemberCreateToMemberEntity(memberCreate, id);
        LocalDate after = LocalDate.now();

        assertEquals(id, result.getId());
        assertEquals(memberCreate.getFirstName(), result.getFirstName());
        assertEquals(memberCreate.getLastName(), result.getLastName());
        assertEquals(memberCreate.getEmail(), result.getEmail());
        assertEquals(memberCreate.getBirthday(), result.getBirthday());
        assertEquals(memberCreate.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(memberCreate.getAddress(), result.getAddress());
        assertEquals(memberCreate.getInformation(), result.getInformation());

        // joiningDate is overridden with the current date rather than taken from the input
        assertTrue(!result.getJoiningDate().isBefore(before) && !result.getJoiningDate().isAfter(after));
    }

    // Verifies that only id, firstName, lastName and email are mapped onto the summary
    @Test
    void convertMemberEntityToMemberSummaryMapsSummaryFields() {
        MemberSummary result = MemberConverter.convertMemberEntityToMemberSummary(memberEntity);

        assertEquals(id, result.getId());
        assertEquals(memberEntity.getFirstName(), result.getFirstName());
        assertEquals(memberEntity.getLastName(), result.getLastName());
        assertEquals(memberEntity.getEmail(), result.getEmail());
    }

    // Verifies that null optional fields are preserved through the conversion
    @Test
    void convertMemberEntityToMemberPreservesNullOptionalFields() {
        MemberEntity entity = new MemberEntity(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                null,
                null,
                null,
                null,
                null
        );

        Member result = MemberConverter.convertMemberEntityToMember(entity);

        assertNull(result.getBirthday());
        assertNull(result.getPhoneNumber());
        assertNull(result.getAddress());
        assertNull(result.getJoiningDate());
        assertNull(result.getInformation());
    }
}
