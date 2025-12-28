import { Component, computed, signal } from '@angular/core';
import { GuideSection } from '../../models/GuideSection';


@Component({
  selector: 'app-zakah-guide',
  imports: [],
  templateUrl: './zakah-guide.html',
  styleUrl: './zakah-guide.css',
})
export class ZakahGuide {
 readonly guideSections = signal<GuideSection[]>([
    {
      id: 'what-is-zakah',
      title: 'ما هي الزكاة؟',
      content: 'الزكاة، أحد أركان الإسلام الخمسة، وهي صدقة واجبة على المسلمين المؤهلين. هي شكل من أشكال تطهير المال ووسيلة لدعم الفقراء والمحتاجين. تُحسب سنوياً على صافي ثروة المسلم التي حال عليها الحول (عام هجري كامل).'
    },
    {
      id: 'what-is-nisab',
      title: 'ما هو النصاب؟',
      content: 'النصاب هو الحد الأدنى من الثروة الذي يجب أن يمتلكه المسلم قبل أن تصبح الزكاة واجبة عليه. إذا كانت ثروة الشخص أقل من هذا الحد، فلا تجب عليه الزكاة. يُحدد النصاب تقليدياً بقيمة 85 جرامًا من الذهب أو 595 جرامًا من الفضة. تستخدم هذه الحاسبة قيمة محددة مسبقًا للتبسيط.'
    },
    {
      id: 'what-is-hawl',
      title: 'ما هو الحول؟',
      content: 'الحول يشير إلى السنة القمرية، وهي الفترة التي يجب أن تمر وثروة المسلم باقية عند أو فوق حد النصاب. بمجرد مرور سنة قمرية كاملة (حوالي 354 يومًا)، تصبح الزكاة واجبة على الأصول الزكوية.'
    },
    {
      id: 'what-assets-are-zakatable',
      title: 'ما هي الأصول التي تجب فيها الزكاة؟',
      content: 'تشمل الأصول الزكوية بشكل عام النقد، والذهب، والفضة، وعروض التجارة (المخزون)، ودخل الاستثمارات، والأنعام. الممتلكات الشخصية مثل السكن الأساسي، والسيارة الشخصية، والملابس لا تخضع عادة للزكاة. تركز هذه الحاسبة على الأصول المالية الأكثر شيوعًا للأفراد والشركات.'
    }
  ]);

  activeSectionId = signal<string>(this.guideSections()[0].id);

  activeSection = computed(() => {
    return this.guideSections().find(s => s.id === this.activeSectionId()) ?? null;
  });

  selectSection(id: string) {
    this.activeSectionId.set(id);
    const element = document.getElementById('guide-content-top');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
