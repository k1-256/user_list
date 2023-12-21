import {Component, OnInit} from '@angular/core';
import {ListRequest, UserDto, UsersService} from "../service/users.service";
import {debounce, debounceTime, distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: UserDto[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage: 5 | 10 | 20 = 10;
  totalUsers = 0;
  searchQuery = '';
  totalPages = 0;

  constructor(private usersApiService: UsersService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    const request: ListRequest = {
      pageNumber: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      search: this.searchQuery
    };

    this.usersApiService.getList(request).pipe(debounceTime(300), distinctUntilChanged()).subscribe(response => {
      this.users = response.items;
      this.totalUsers = response.total_count;
      this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
      this.loading = false;
    });
  }

  onDelete(userId: string) {
    this.loading = true;
    this.usersApiService.remove(userId).subscribe(() => {
      this.loadUsers(); // Перезагрузка пользователей после удаления
      this.loading = false;
    });
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadUsers();
  }

  // Методы для управления пагинацией
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onItemsPerPageChange(event: Event) {
    const itemsPerPage = (event.target as HTMLInputElement).value;
    const numItemsPerPage = parseInt(itemsPerPage, 10);
    if ([5, 10, 20].includes(numItemsPerPage)) {
      this.itemsPerPage = numItemsPerPage as 5 | 10 | 20;
      this.currentPage = 1; // Сброс на первую страницу
      this.loadUsers();
    } else {
      // Обработка недопустимого значения
      console.error('Недопустимое количество элементов на странице');
    }
  }
}
