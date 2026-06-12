package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Attendance.Id> {

    // SELECT * FROM event.attendances WHERE event_id = ?
    List<Attendance> findAllById_EventId(UUID eventId);

    // SELECT * FROM event.attendances WHERE member_id = ?
    List<Attendance> findAllById_MemberId(UUID memberId);

    // DELETE FROM event.attendances WHERE event_id = ?
    void deleteAllById_EventId(UUID eventId);
}
