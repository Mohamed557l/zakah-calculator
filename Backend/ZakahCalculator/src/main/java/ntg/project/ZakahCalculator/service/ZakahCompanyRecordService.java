package ntg.project.ZakahCalculator.service;

import ntg.project.ZakahCalculator.entity.ZakahCompanyRecord;

import java.util.List;

public interface ZakahCompanyRecordService {

    ZakahCompanyRecord save(ZakahCompanyRecord record);

    ZakahCompanyRecord update(ZakahCompanyRecord record, Long id);

    ZakahCompanyRecord findByIdAndUserId(Long id);

    List<ZakahCompanyRecord> findAllByUserId();

    void deleteByIdAndUserId(Long id);
}
