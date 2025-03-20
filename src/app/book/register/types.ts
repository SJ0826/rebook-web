import { BookStatus } from '@/types/books';

export interface ImageInput {
  uuid: string;
  sort: number;
}

export interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  price: number;
  status: BookStatus;
  description: string;
  imageUuids: ImageInput[];
}
