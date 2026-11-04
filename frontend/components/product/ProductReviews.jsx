'use client';
import { useState } from 'react';
import { useReviews } from '@/lib/queries';
import { Skeleton, Stars } from '@/components/ui/Feedback';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/lib/format';

export default function ProductReviews({ product }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReviews(product._id, page);

  const total = data?.pagination.total || 0;

  return (
    <section id="reviews" className="container-page py-16 border-t border-brand-border">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
        {/* Summary */}
        <div>
          <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">Reviews</span>
          <h2 className="text-2xl font-semibold tracking-tight text-brand-ink mb-4">What the brotherhood says</h2>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-semibold tracking-tighter">{product.rating?.toFixed(1) || '0.0'}</span>
            <div className="pb-1.5">
              <Stars value={product.rating} />
              <p className="text-xs text-brand-mutedGray">
                {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            {(data?.distribution || [5, 4, 3, 2, 1].map((star) => ({ star, count: 0 }))).map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-brand-slate">
                <span className="w-3">{star}</span>
                <span className="text-brand-orange">★</span>
                <div className="flex-1 h-1.5 bg-brand-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-full transition-all"
                    style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="w-5 text-right text-brand-mutedGray">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List */}
        <div>
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : total === 0 ? (
            <div className="bg-brand-offwhite border border-brand-border rounded-md p-8 text-center">
              <p className="text-sm text-brand-slate">No reviews yet. Be the first to share your thoughts.</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-brand-border">
                {data.reviews.map((review) => (
                  <li key={review._id} className="py-6 first:pt-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-xs font-semibold text-brand-slate">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-brand-ink">{review.name}</p>
                          {review.isVerifiedBuyer && (
                            <p className="text-[10px] font-semibold tracking-wide uppercase text-brand-blue">Verified Buyer</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-brand-mutedGray">{formatDate(review.createdAt)}</span>
                    </div>
                    <Stars value={review.rating} className="text-sm" />
                    <p className="text-sm text-brand-slate leading-relaxed mt-2">{review.comment}</p>
                  </li>
                ))}
              </ul>
              <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
