'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useCreateReview } from '@/lib/accountQueries';
import { useMounted } from '@/lib/hooks';
import { Spinner } from '@/components/ui/Feedback';
import { cn } from '@/lib/format';

export default function ReviewForm({ product }) {
  const mounted = useMounted();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const createReview = useCreateReview(product._id, product.slug);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  if (!mounted) return null;

  if (!token) {
    return (
      <p className="text-sm text-brand-slate mt-6">
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="font-semibold text-brand-blue hover:text-brand-blueDark">
          Log in
        </Link>{' '}
        to write a review.
      </p>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-outline mt-6 w-full">
        Write a review
      </button>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please choose a rating');
    if (comment.trim().length < 3) return toast.error('Please write a short review');
    try {
      await createReview.mutateAsync({ rating, comment });
      toast.success('Thanks for your review!');
      setOpen(false);
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-3 border border-brand-border rounded-md p-4 bg-white">
      <div>
        <p className="label">Your rating</p>
        <div className="flex gap-1 text-2xl" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              className={cn('transition-colors', star <= (hover || rating) ? 'text-brand-orange' : 'text-brand-border')}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="label">
          Your review
        </label>
        <textarea
          id="comment"
          rows={4}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input h-auto py-2.5"
          placeholder="How's the fit, fabric and quality?"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={createReview.isPending} className="btn-dark flex-1">
          {createReview.isPending ? <Spinner /> : 'Submit'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
