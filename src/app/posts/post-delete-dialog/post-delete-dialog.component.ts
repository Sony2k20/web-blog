import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { PostDataService } from 'src/app/post-data.service';
import { Post } from 'src/app/posts/post';
import { PostService } from '../post.service';


@Component({
  selector: 'app-post-delete-dialog',
  templateUrl: './post-delete-dialog.component.html',
  styleUrls: ['./post-delete-dialog.component.sass']
})
export class PostDeleteDialogComponent implements OnInit {



  constructor(
    private appComp: AppComponent, 
    private postData: PostDataService,
    private dialogRef: MatDialogRef<PostDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){ 
      
  }

  ngOnInit(): void {
    this.postData.globalPostData$?.subscribe((res) => {
      this.data = res; 
    })
  }
  
  delete() {
    
    this.dialogRef.close({deleteValue: true})
  }

}
