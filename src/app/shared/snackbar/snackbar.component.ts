import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.sass']
})
export class SnackbarComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }
  ngOnInit(): void {
  }

  openSnackBar(message: string, action: any, classNames?: string | [string]) {
    this.snackBar.open(message, action, { duration: 3000, panelClass: classNames });
  }

  

}
