import { apiJson } from './apiClient';

const REVIEW_ENDPOINT = '/plugin/seo-system-300/api/website/review.php';

export type WebsiteReviewResult = { id: number; status: string; progress: number };

/** Customer answer while the order waits in customer_review. */
export async function answerWebsiteReview(orderId: number, approve: boolean, message = '') {
  return apiJson<WebsiteReviewResult>(REVIEW_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ orderId, approve, message }),
  });
}
