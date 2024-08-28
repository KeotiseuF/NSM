import { getRequest } from "../request";

export async function getListStock() {
  try {
    const listStock = await getRequest('stock');
    return listStock;
  } catch {
    console.error('Error GET stock list.');
  }
}

export async function getArticleNYTimes() {
  try {
    const articleNYTimes = await getRequest('stock/article/ny-times');
    return articleNYTimes;
  } catch {
    console.error('Error GET ArticleNYTimes.');
  }
}