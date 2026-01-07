package ntg.project.ZakahCalculator.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZakahIndividualRecordRequest {
    //To be added to total assets
    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal cash;//

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal gold;//
    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal silver;//

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal stocks;//

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal bonds; // الشهادات //

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal tradeOffers; // عروض التجارة

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal jewelry; // المجوهرات

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal otherAssets; // الاستثمارات الاخرى

    //To be deducted from total assists ( total liabilities)
    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal loans; // القروض

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal debt; // الديون

    //General
    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PositiveOrZero(message = "من فضلك أدخل رقمًا أكبر من أو يساوي صفر.")
    private BigDecimal goldPrice;

    @NotNull(message = "هذا الحقل مطلوب، من فضلك لا تتركه فارغًا.")
    @PastOrPresent(message = "من فضلك ادخل تاريخ النموذج ( يجب ان يكون تاريخ سابق او تاريخ اليوم ).")
    private LocalDate calculationDate;
}



