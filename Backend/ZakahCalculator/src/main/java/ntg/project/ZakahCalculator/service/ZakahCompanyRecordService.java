package ntg.project.ZakahCalculator.service;

import ntg.project.ZakahCalculator.dto.request.ZakahCompanyRecordRequest;
import ntg.project.ZakahCalculator.dto.response.ZakahCompanyRecordResponse;
import ntg.project.ZakahCalculator.dto.response.ZakahCompanyRecordSummaryResponse;

import java.util.List;

public interface ZakahCompanyRecordService {
    ZakahCompanyRecordSummaryResponse save(ZakahCompanyRecordRequest request);

    ZakahCompanyRecordResponse findById(Long id);

    List<ZakahCompanyRecordSummaryResponse> findAllSummariesByUserId();

    void deleteByIdAndUserId(Long id);

    ZakahCompanyRecordResponse findLatestByUserId();
    ZakahCompanyRecordSummaryResponse findLatestSummaryByUserId();
}
