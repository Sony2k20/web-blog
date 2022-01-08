import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, of, tap } from 'rxjs';
import { PostService } from '../post.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.sass'],

})

export class PostDashboardComponent implements OnInit {

  progressbarValue: number | undefined = 0;
  imageUrl?: Observable<any>;
  image: any;
  newImage: string | undefined

  reviewTypes = {
    'Anime': 'animes',
    'Filme': 'movies',
    'Serien': 'series',
    'Spiele': 'games'
  };

  formGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    longTitle: new FormControl('', Validators.required),
    id: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });
  

  constructor(
    private postService: PostService, 
    private storage: AngularFireStorage, 
    private snackbarService: SnackbarComponent,
    private dialogRef: MatDialogRef<PostDashboardComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){
  }

  ngOnInit(): void {
    if(this.data.changeType === "edit"){
      this.formGroup.controls['title'].disable();
      this.formGroup.controls['title'].setValue(this.data.post.title);
      this.formGroup.controls['longTitle'].setValue(this.data.post.longTitle);
      this.formGroup.controls['type'].setValue(this.data.post.type);
      this.formGroup.controls['content'].setValue(this.data.post.content);
      this.formGroup.controls['image'].setValue(this.data.post.image);
      this.formGroup.controls['id'].setValue(this.data.post.id);
      this.replaceBR()
      this.newImage = "yes"
    }
  }

  async createPostBody() {
    if(await this.postService.countPostsbyType("title", this.formGroup?.get('title')?.value) === 1)  {
      return this.snackbarService.openSnackBar("Titel ist bereits vorhanden", "")
    }
    this.createNewLine();
    this.createID()
    const id = this.formGroup?.get('id')?.value
    const post = {
      title: this.formGroup?.get('title')?.value,
      longTitle: this.formGroup?.get('longTitle')?.value,
      content: this.formGroup?.get('content')?.value,
      image: this.formGroup?.get('image')?.value,
      type: this.formGroup?.get('type')?.value,
      published: Timestamp.now(),
    }
    
    if (this.formGroup.valid) {
      this.postService.setPost(post, id)
      this.replaceBR()
      if(this.data.changeType === "edit") {
        this.snackbarService.openSnackBar("Änderungen erfolgreich", "")
      } else {
        const routerLink = "/blog/" + this.formGroup?.get('id')?.value
        this.dialogRef.close({routerLink: routerLink})
      }
    } else {
      this.replaceBR()
      this.snackbarService.openSnackBar("Bitte alle Felder ausfüllen und ein Bild hochladen", "", "red-font");
    }
    
    
  }

  createID() {
    if (!this.formGroup?.get('id')?.value) {
      const newId = this.formGroup?.get('title')?.value
      return this.formGroup?.get('id')?.setValue(newId.toLowerCase().replace(/ /g, '-'));
    }
  }

  createNewLine() {
    const text = this.formGroup?.get('content')?.value
    return this.formGroup?.get('content')?.setValue(text.replace(/\n/g, '<br>'));
  }

  replaceBR() {
    const text = this.formGroup?.get('content')?.value
    return this.formGroup?.get('content')?.setValue(text.replace(/<br>/g, '\n'));
  }

  testa(){
    this.snackbarService.openSnackBar("Unzureichende Berechtigung", "")
  }

  onSelectFile(event: any) {
    const file = event.target.files[0];
    const filePath = event.target.files[0].name;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
    this.newImage = 'changed'

    uploadTask.percentageChanges().subscribe({
      next: res => this.progressbarValue = res,
      error: () => this.snackbarService.openSnackBar("Unzureichende Berechtigung", ""),
      complete: () => {
        this.snackbarService.openSnackBar("Bild erfolgreich hochgeladen", "")
      },
    })

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.imageUrl = fileRef.getDownloadURL();
        this.imageUrl?.subscribe(res => {
          this.formGroup.controls['image'].setValue(res);
          this.image = res;
        });
      }
      )
    ).subscribe()
  }





}
