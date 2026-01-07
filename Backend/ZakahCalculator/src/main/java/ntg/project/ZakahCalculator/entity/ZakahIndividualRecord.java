package ntg.project.ZakahCalculator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "zakah_individual_records")
@DiscriminatorValue("INDIVIDUAL")
@PrimaryKeyJoinColumn(name = "record_id")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ZakahIndividualRecord extends ZakahRecord {
    //to be added to total assets
    @Column(precision = 15, scale = 2)
    private BigDecimal cash; // "النقد المتاح (سيولة نقدية)"

    @Column(precision = 15, scale = 2)
    private BigDecimal gold; // "قيمة الذهب المملوك (سبائك، عملات ذهبية)"

    @Column(precision = 15, scale = 2)
    private BigDecimal silver; // "قيمة الفضة المملوكة (سبائك، عملات فضية)"


    @Column(precision = 15, scale = 2)
    private BigDecimal stocks; // "قيمة الأسهم بالقيمة السوقية الحالية(استثمارات في البورصة)"

    @Column(precision = 15, scale = 2)
    private BigDecimal bonds; // "السندات (استثمارات ذات دخل ثابت)"

    @Column(precision = 15, scale = 2)
    private BigDecimal tradeOffers; // "عروض تجارية (كل ما تملك وتنوى بيعه كشقة او سيارة وتحسب اذا تم عرضها للبيع)"

    @Column(precision = 15, scale = 2)
    private BigDecimal jewelry; //"المجوهرات غير الذهب و الفضة (الحلي والمصوغات)"

    @Column(precision = 15, scale = 2)
    private BigDecimal otherAssets; // "أصول أخرى (غير مصنفة بالأعلى)"


    //to be deducted from total assets
    @Column(precision = 15, scale = 2)
    private BigDecimal loans;  // "قروض (المخططة لدفعها خلال حول الذكاة)"

    @Column(precision = 15, scale = 2)
    private BigDecimal debt; // "ديون (مستحقة السداد خلال الحول)"



    //General
    private LocalDate calculationDate;
    private BigDecimal totalAssets;
    private BigDecimal totalLiabilities;
    private BigDecimal zakahPool;

}

