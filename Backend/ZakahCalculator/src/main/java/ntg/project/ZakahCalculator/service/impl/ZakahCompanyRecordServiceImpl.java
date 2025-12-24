package ntg.project.ZakahCalculator.service.impl;

import ntg.project.ZakahCalculator.entity.ZakahCompanyRecord;
import ntg.project.ZakahCalculator.repository.ZakahCompanyRecordRepository;
import ntg.project.ZakahCalculator.service.ZakahCompanyRecordService;
import lombok.RequiredArgsConstructor;
import ntg.project.ZakahCalculator.uitility.UserIDUtility;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ZakahCompanyRecordServiceImpl
        implements ZakahCompanyRecordService {

    private final UserIDUtility userIDUtility;
    private final ZakahCompanyRecordRepository zakahCompanyRecordRepository;

    @Override
    public ZakahCompanyRecord save(ZakahCompanyRecord record) {
        return zakahCompanyRecordRepository.save(record);
    }
    @Override
    public ZakahCompanyRecord update(ZakahCompanyRecord record, Long id) {
        return zakahCompanyRecordRepository.save(record);
    }

    @Override
    public ZakahCompanyRecord findByIdAndUserId(Long id) {
        return  zakahCompanyRecordRepository.findByIdAndUserId(id,userIDUtility.getAuthenticatedUserId());
    }

    @Override
    public List<ZakahCompanyRecord> findAllByUserId() {
        return zakahCompanyRecordRepository.findAllByUserId(userIDUtility.getAuthenticatedUserId());
    }

    @Override
    public void deleteByIdAndUserId(Long id) {
        zakahCompanyRecordRepository.deleteByIdAndUserId(id,userIDUtility.getAuthenticatedUserId());
    }

}
