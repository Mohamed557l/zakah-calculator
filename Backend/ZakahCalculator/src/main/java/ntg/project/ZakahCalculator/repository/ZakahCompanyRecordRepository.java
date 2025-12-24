package ntg.project.ZakahCalculator.repository;

import ntg.project.ZakahCalculator.entity.ZakahCompanyRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZakahCompanyRecordRepository
        extends JpaRepository<ZakahCompanyRecord, Long> {

    //Get Balance sheet records by user id and year
    ZakahCompanyRecord findByIdAndUserId(Long id, Long userId);

    //Get all balance sheet records by user id
    List<ZakahCompanyRecord> findAllByUserId(Long userId);

    void deleteByIdAndUserId(Long id,Long userId);
}
