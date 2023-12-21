import { Injectable } from '@angular/core';
import {catchError, delay, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private DB: UserDto[] = [
    { id: 'u1', user_name: 'Ivan Z.', is_active: true },
    { id: 'u2', user_name: 'Mikhail X.', is_active: true },
    { id: 'u3', user_name: 'Ivan C.', is_active: true },
    { id: 'u4', user_name: 'Petr V.', is_active: true },
    { id: 'u5', user_name: 'Artyom B.', is_active: true },
    { id: 'u6', user_name: 'Gleb N.', is_active: true },
    { id: 'u7', user_name: 'Anton M.', is_active: true },
    { id: 'u8', user_name: 'Semyon A.', is_active: true },
    { id: 'u9', user_name: 'Arseniy S.', is_active: true },
    { id: 'u10', user_name: 'Nick D.', is_active: true },
    { id: 'u11', user_name: 'Alex F.', is_active: true },
    { id: 'u12', user_name: 'Kirill G.', is_active: true },
    { id: 'u13', user_name: 'Stas H.', is_active: true },
    { id: 'u14', user_name: 'Yuriy J.', is_active: true },
    { id: 'u15', user_name: 'Roman K.', is_active: true },
    { id: 'u16', user_name: 'Ivan L.', is_active: true },
    { id: 'u17', user_name: 'Ivan Q.', is_active: true },
  ];

  getList(request: ListRequest): Observable<UserListResponseDto> {
    const { pageNumber, search, itemsPerPage } = request;

    // Фильтрация по имени пользователя, если задано
    let filteredUsers = search
      ? this.DB.filter(user => user.user_name.toLowerCase().includes(search.toLowerCase()))
      : this.DB;

    // Получение общего количества пользователей после фильтрации
    const total_count = filteredUsers.length;

    // Пагинация
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const items = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return of({ total_count, items }).pipe(delay(500)); // Имитация задержки сети
  }

  getById(id: string): Observable<UserDto> {
    const user = this.DB.find(user => user.id === id);
    if (user) {
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('User not found')).pipe(
        delay(500),
        catchError(error => throwError(() => error))
      );
    }
  }

  remove(id: string): Observable<null> {
    this.DB = this.DB.filter(user => user.id !== id);
    return of(null).pipe(delay(500)); // Имитация задержки сети
  }
}

export interface UserDto {
  id: string;
  user_name: string;
  is_active: boolean;
}

export interface ListRequest {
  pageNumber: number;
  search?: string;
  itemsPerPage: 5 | 10 | 20;
}

export interface UserListResponseDto {
  total_count: number;
  items: UserDto[];
}
