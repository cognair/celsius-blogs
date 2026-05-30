/**
 * ReviewedByDrAlex — reviewer attribution block for pet articles.
 *
 * Drop at the end of any pet-category blog body (after FAQs / References,
 * before the final CTA). Reused across all pet posts — only one source of
 * truth for Dr. Alex's photo + credentials.
 *
 * Photo lives at /dr-alex.png (public/dr-alex.png). Replace that file to
 * update the photo across every article that uses this component.
 *
 * Usage:
 *   import { ReviewedByDrAlex } from "@/components/blog/ReviewedByDrAlex";
 *   <ReviewedByDrAlex />
 */

export function ReviewedByDrAlex() {
  return (
    <aside
      data-reviewer="dr-alex"
      className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 my-12"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        {/* Photo */}
        <div className="shrink-0">
          <img
            src="/dr-alex.png"
            alt="Dr. Alex C, DVM MRCVS — veterinary reviewer"
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-2 ring-background shadow-sm"
            loading="lazy"
            width={112}
            height={112}
          />
        </div>

        {/* Credentials + bio */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent font-semibold mb-1.5">
            Reviewed by
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-foreground leading-tight">
            Dr. Alex C, DVM MRCVS
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            RCVS-accredited Veterinary Surgeon · Royal Veterinary College, UK
          </p>
          <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
            Dr. Alex is an RCVS-accredited veterinary surgeon and consultant
            currently practicing at a small-animal veterinary practice in the
            UK. He earned his veterinary medicine degree from the Royal
            Veterinary College — one of the top three vet schools in the
            world — and reviews Celsius Herbs pet articles for clinical
            accuracy, ensuring every recommendation reflects up-to-date,
            scientifically grounded veterinary care.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default ReviewedByDrAlex;
