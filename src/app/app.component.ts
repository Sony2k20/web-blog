import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { environment } from '../environments/environment';
import { AuthService } from './core/auth.service';
import { PostDataService } from './post-data.service';
import { Post } from './posts/post';
import { PostDashboardComponent } from './posts/post-dashboard/post-dashboard.component';
import { PostDeleteDialogComponent } from './posts/post-delete-dialog/post-delete-dialog.component';
import { PostService } from './posts/post.service';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { SideNavService } from './side-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit {

  @ViewChild('sidenav') public sidenav: MatSidenav | undefined;

  public post: Post | undefined;
  public env = environment;
  deleteValue = false;
  editValue = false;
  valueIfPost = false; 
  data: any = {};


  constructor(
    private sideNavService: SideNavService,
    private router: Router,
    public authServ: AuthService,
    private snackbarService: SnackbarComponent,
    private postData: PostDataService,
    public dialog: MatDialog,
    private postService: PostService,
  ) {
  }

  ngOnInit() {
    AOS.init();
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.closeSideNav();
    });
    this.postData.globalPostData$?.subscribe((res) => {
      this.post = res;
    });
    this.postData.valueIfPost$.subscribe((res) => {
      this.valueIfPost = res;
    });
  }


  goToCreatePost() {
    this.router.navigateByUrl('/dashboard');
    this.closeSideNav()
  }

  closeSideNav() {
    this.sidenav?.toggle()
  }

  async login() {
    const test = this.authServ.login()
    this.closeSideNav()
  }

  logout() {
    this.authServ.logout()
    this.closeSideNav()
  }

  async delete() {
  
    if (this.post?.id)
    this.postService.deleteNote(this.post?.id)
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(
      PostDeleteDialogComponent, {data: {deleteValue: this.deleteValue}}
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.deleteValue && this.post?.id){
         this.postService.deleteNote(this.post?.id);
         this.closeSideNav()
         this.snackbarService.openSnackBar("Post wurde gelöscht", "", "green-font");
    }});
  }

  openChangeDialog(changeType: string) {
    if(changeType === 'edit'){
    this.data = {
      changeType: "edit",
      post: this.post,
    } 
    } else this.data = {
      changeType: "add"
    }

    const dialogRef = this.dialog.open(
      PostDashboardComponent, {
        width: '1000px',
        data: this.data
      }
    );
    dialogRef.afterClosed().subscribe(result => {
         this.closeSideNav()

         
    });
  } 


}
