import { Book, Search } from "./schemas.ts";

const API_URL = new URL("https://openlibrary.org");

async function _fetch(url: string | URL): Promise<unknown> {
  const result = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  return result;
}

export async function searchBook(query: string): Promise<Search> {
  const url = API_URL;
  url.pathname = "/search.json";
  url.searchParams.set("q", query);

  const result = await _fetch(url);
  return Search.parse(result);
}

export async function searchByBookInfo({
  author,
  title,
}: {
  author?: string;
  title?: string;
}): Promise<Search> {
  const url = API_URL;
  url.pathname = "/search.json";
  
  if (author) url.searchParams.set("author", author);
  if (title) url.searchParams.set("title", title);
  if (!author && !title) {
    console.log("Please provide author or title to searchByBookInfo");
    return {
      start: 0,
      num_found: 0,
      docs: [],
    };
  }

  const result = await _fetch(url);
  return Search.parse(result);
}

export async function getBook(id: string): Promise<Book> {
  const url = API_URL;
  url.pathname = `/works/${id}`;

  const result = await _fetch(url);
  return Book.parse(result);
}
