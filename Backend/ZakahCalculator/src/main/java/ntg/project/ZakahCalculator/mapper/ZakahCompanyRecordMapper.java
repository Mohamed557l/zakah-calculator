package ntg.project.ZakahCalculator.mapper;

import lombok.RequiredArgsConstructor;
import ntg.project.ZakahCalculator.dto.request.ZakahCompanyRecordRequest;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.ZakahCompanyRecord;
import ntg.project.ZakahCalculator.repository.UserRepository;
import ntg.project.ZakahCalculator.repository.ZakahCompanyRecordRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ZakahCompanyRecordMapper {

    public ZakahCompanyRecord ToEntity(ZakahCompanyRecordRequest request, User user) {
        if (request == null) {return null;}

        ZakahCompanyRecord record = new ZakahCompanyRecord();

        // Map all fields
        record.setCashEquivalents(request.getCashEquivalents() != null ? request.getCashEquivalents() : BigDecimal.ZERO);
        record.setAccountsReceivable(request.getAccountsReceivable() != null ? request.getAccountsReceivable() : BigDecimal.ZERO);
        record.setInventory(request.getInventory() != null ? request.getInventory() : BigDecimal.ZERO);
        record.setInvestment(request.getInvestment() != null ? request.getInvestment() : BigDecimal.ZERO);
        record.setAccountsPayable(request.getAccountsPayable() != null ? request.getAccountsPayable() : BigDecimal.ZERO);
        record.setShortTermLiability(request.getShortTermLiability() != null ? request.getShortTermLiability() : BigDecimal.ZERO);
        record.setAccruedExpenses(request.getAccruedExpenses() != null ? request.getAccruedExpenses() : BigDecimal.ZERO);
        record.setYearly_long_term_liabilities(request.getYearly_long_term_liabilities() != null ? request.getYearly_long_term_liabilities() : BigDecimal.ZERO);
        record.setGoldPrice(request.getGoldPrice() != null ? request.getGoldPrice() : BigDecimal.ZERO);
        record.setUser(user);

        if (request.getBalance_sheet_date() != null) {
            record.setBalance_sheet_date(request.getBalance_sheet_date());
        }

        return record;
    }

    public ZakahCompanyRecordRequest toDetailedZakahCompanyRecordResponse(ZakahCompanyRecord entity) {

        if (entity == null) {
            return null;
        }

        return ZakahCompanyRecordRequest.builder()
                .cashEquivalents(entity.getCashEquivalents())
                .accountsReceivable(entity.getAccountsReceivable())
                .inventory(entity.getInventory())
                .investment(entity.getInvestment())
                .accountsPayable(entity.getAccountsPayable())
                .shortTermLiability(entity.getShortTermLiability())
                .accruedExpenses(entity.getAccruedExpenses())
                .yearly_long_term_liabilities(entity.getYearly_long_term_liabilities())
                .goldPrice(entity.getGoldPrice())
                .userId(entity.getUser().getId())
                .balance_sheet_date(entity.getBalance_sheet_date())
                .build();
    }

    private BigDecimal nullToZero(BigDecimal value) {
        return Optional.ofNullable(value).orElse(BigDecimal.ZERO);
    }
}





